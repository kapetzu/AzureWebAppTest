const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const credential = new DefaultAzureCredential();

const client = new SecretClient(
  process.env.KEY_VAULT_URL,
  credential
);

async function getMongoCredentials() {
  const usernameSecret = await client.getSecret("MongoDBUsername");
  const passwordSecret = await client.getSecret("MongoDBPassword");

  return {
    username: usernameSecret.value,
    password: passwordSecret.value
  };
}

module.exports = { getMongoCredentials };