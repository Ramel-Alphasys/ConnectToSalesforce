// -------------------------------------------------------------------------------
// Trigger handler
// -------------------------------------------------------------------------------
import api, { route, storage, startsWith } from "@forge/api";
export async function run(event, context) {
    try {
        const getIssue = await getIssueData(event);
        const urlencoded = new URLSearchParams();
        var salesforceCreds = await storage.query()
        // Filter the response to only keys that start with the string 'value'
        .where('key', startsWith('salesforceCredentials')).getMany();
        urlencoded.append("grant_type", "client_credentials");
        urlencoded.append("client_id", salesforceCreds.results[0].value['clientId']);
        urlencoded.append("client_secret", salesforceCreds.results[0].value['clientSecret']);
        const getToken = await getAccessToken(urlencoded, salesforceCreds.results[0].value['baseURL']);
        const sendToSalesforceEntry = await sendToSalesforce(event, getToken.access_token, getIssue, salesforceCreds.results[0].value['baseURL']);
        console.debug("🚀 => run => sendToSalesforce:", sendToSalesforceEntry);
    } catch (error) {
        console.error("🚀 => run => error:", error);
    }
}
async function getAccessToken(bodyRec, baseURL) {
    const res = await api.fetch(`${baseURL}/services/oauth2/token`,
        {
            body: bodyRec,
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
    )
    const data = await res.json();
    return data;
}
async function sendToSalesforce(eventData, accessToken, issueData, baseURL) {
    var bodyVal = {
        "subject" : eventData.issue.fields.summary,
        "transition": '5',
        "project": eventData.issue.fields.project.name,
        "branch": null,
        "status" : eventData.issue.fields.status.name,
        "issueId" : eventData.issue.id,
        "issueType" : eventData.issue.fields.issuetype.name,
        "createdDate" : issueData.fields.created
    };
    if(issueData.fields.assignee) bodyVal.assignee = issueData.fields.assignee.displayName;
    if(issueData.fields.description) bodyVal.description = issueData.fields.description;
    if(issueData.fields.priority) bodyVal.priority = issueData.fields.priority.name;
    const response = await api.fetch(`${baseURL}/services/apexrest/jiraTransitionUpdate`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyVal)
    });

    const data = await response.json();
    return data;

}


async function getIssueData(eventData) {
    const getIssue = await api.asApp().requestJira(route`/rest/api/2/issue/${eventData.issue.id}`, {
        headers: {
            'Accept': 'application/json'
        }
    });
    return await getIssue.json();
}