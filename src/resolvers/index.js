import Resolver from '@forge/resolver';
import api, { storage, startsWith } from '@forge/api';
const resolver = new Resolver();

resolver.define('getCredentials', async (params) => {
  try {
    var salesforceCreds = await storage.query()
    // Filter the response to only keys that start with the string 'value'
    .where('key', startsWith('salesforceCredentials')).getMany();
    var retrunValue = salesforceCreds.results[0].value[params.payload.type];
    return retrunValue;
  }catch(err) {
    console.error("🚀 => getCredentials => err:", err);
    return '';
  }
});

// resolver.define('salesforceCreds', async (params) => {
//   var response,
//       res;
//   const fetchHeader = new Headers();
//   const urlencoded = new URLSearchParams();
//   // --------------------------------------------------------------------
//   fetchHeader.append("Content-Type", "application/x-www-form-urlencoded");
//   // --------------------------------------------------------------------
//   urlencoded.append("grant_type", "client_credentials");
//   urlencoded.append("client_id", params.payload.consumerKey);
//   urlencoded.append("client_secret", params.payload.consumerSecret);
//   const requestOptions = {
//     method: "POST",
//     headers: fetchHeader,
//     body: urlencoded,
//     redirect: "follow"
//   };
//   try {
//     res = await api.fetch(params.payload.endPoint, requestOptions).then(result => { 
//       return result; 
//     }).catch(error => {
//       console.error("🚀 => resolver.define => error:", error);
//     });
//     if(res) {
//       response = await res.json();
//       await storage.set('salesforceToken', {type : response.token_type, token : response.access_token});
//     } else {
//       response = await storage.query()
//       // Filter the response to only keys that start with the string 'value'
//       .where('key', startsWith('salesforceToken')).getMany();
//     }
//     // console.debug('salesforceToken: ', await storage.get('salesforceToken'));
//   }catch(err) {
//     console.error("🚀 => salesforceToken => err:", err);
//   }
//   return `Salesforce response: ${JSON.stringify(response)}`;
// });

resolver.define('setSalesforceCredential', async (params) => {
  await storage.set('salesforceCredentials', {
    clientId : params.payload.consumerKey,
    clientSecret : params.payload.consumerSecret,
    baseURL : params.payload.baseURL
  });
});

export const handler = resolver.getDefinitions();