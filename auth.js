const msal = require('@azure/msal-node');

const msalConfig = {
  auth: {
    clientId: process.env.ENTRA_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.ENTRA_TENANT_ID}`,
    clientSecret: process.env.ENTRA_CLIENT_SECRET
  }
};

const cca = new msal.ConfidentialClientApplication(msalConfig);

module.exports = { cca };