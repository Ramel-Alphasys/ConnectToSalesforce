import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text, Form, FormHeader, RequiredAsterisk, Textfield, useForm, Label, Button, Inline, Stack, Toggle } from '@forge/react';
import { invoke } from '@forge/bridge';

const App = () => {
  const { handleSubmit, register, getFieldId } = useForm();
  const [data, setData] = useState(null);
  const [clientId, clientIdHandler] = useState(null);
  const [consumerSecret, consumerSecretHandler] = useState(null);
  const [baseURL, baseURLHandler] = useState('');
  const [endPoint, endPointHandler] = useState(null);
  const [salesforceData, sfData] = useState(null);
  const [sectionVisibility, sectionVisibilityHandler] = useState(null);
  
  useEffect(() => {
    invoke('getCredentials', { type: 'clientId' }).then(clientIdHandler);
    invoke('getCredentials', { type: 'clientSecret' }).then(consumerSecretHandler);
    invoke('getCredentials', { type: 'baseURL' }).then(baseURLHandler);
  }, []);

  const connectionHandler = (data) => {
    invoke('setSalesforceCredential', data).then(consumerKeyHandler);
    sectionVisibilityHandler(false);
  };

  return (
    <>
      {sectionVisibility ? 
        <Form onSubmit={handleSubmit(connectionHandler)}>
          <FormHeader>
            Required fields are marked with an asterisk<RequiredAsterisk />
          </FormHeader>
          <Stack space="space.100" grow="fill">
            <Stack space="space.025" grow="fill">
              <Label labelFor="consumerKey">Client Id<RequiredAsterisk /></Label>
              <Textfield {...register("consumerKey", { required: true })} label="Client Id" type="password" isRequired="True" description="Salesforce consumer key." />
            </Stack>
            <Stack space="space.025" grow="fill">
              <Label labelFor="consumerSecret">Client Secret<RequiredAsterisk /></Label>
              <Textfield {...register("consumerSecret", { required: true })}  label="Client Secret" type="password" isRequired="True" description="Salesforce consumer secret." />
            </Stack>
            <Stack space="space.025" grow="fill">
              <Label labelFor="consumerSecret">Base URL<RequiredAsterisk /></Label>
              <Textfield {...register("baseURL", { required: true })}  label="Base URL" type="text" isRequired="True" description="Salesforce domain url." />
            </Stack>
            <Inline space="space.100" grow="hug">
              <Button type="submit">Connect</Button>
            </Inline>
          </Stack>
        </Form>
        : 
        <Form onSubmit={handleSubmit(connectionHandler)}>
          <Stack space="space.100" grow="fill">
            <Inline space="space.100" grow="hug">
              <Button type="submit" onClick={e => sectionVisibilityHandler(true)}>Edit</Button>
            </Inline>
            <Stack space="space.025" grow="fill">
              <Label labelFor="consumerKey">Client Id</Label>
              <Textfield label="Client Id" type="password" value={clientId ? clientId : ''} description="Salesforce consumer key." />
            </Stack>
            <Stack space="space.025" grow="fill">
              <Label labelFor="consumerSecret">Client Secret</Label>
              <Textfield label="Client Secret" value={consumerSecret ? consumerSecret : ''} type="password" description="Salesforce consumer secret." />
            </Stack>
            <Stack space="space.025" grow="fill">
              <Label labelFor="consumerSecret">Base URL</Label>
              <Textfield label="Base URL" value={baseURL ? baseURL : ''} type="text" description="Salesforce domain url." />
            </Stack>
          </Stack>
        </Form>
      }
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);