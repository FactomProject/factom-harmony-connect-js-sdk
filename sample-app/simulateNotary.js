/* eslint-disable  */
// Will be changed to require ('FactomSDK') after publish
const FactomConnectSDK = require('../dist/factomHarmonyConnectSdk.cjs');
const sha256 = require('js-sha256'); // Using any external library for hash data
const globalTunnel = require('global-tunnel-ng');
const fs = require('fs');
const axios = require('axios')

//This part will be remove after Connect API updated
axios.interceptors.response.use((response) => {
  // Do something with response data
  response.data = {
    ...response.data,
      dblock: {
      height: 121115,
      keymr: "0fc6fc4c48b45b0d82638717d2b7de327ec5f2eea485c0c5e41999f6f0f5349e",
      href: "/v1/dblocks/0fc6fc4c48b45b0d82638717d2b7de327ec5f2eea485c0c5e41999f6f0f5349e"
    }
  }
  console.log(response)
  return response ;
});

//FPT Dev-Env
globalTunnel.initialize({
  host: '10.133.93.63',
  port: 8080,
});

// Handle node response
const responseData = (response, data) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(data), 'utf-8');
};

module.exports = async (request, response) => {
  // Init factom sdk with your app_id and app_key
  const factomConnectSDK = new FactomConnectSDK({
    baseURL: 'https://durable.sandbox.harmony.factom.com/v1',
    accessToken: {
      app_id: 'aabe7d81',
      app_key: '502a5c77f8f600b9ec32e94fbe008f11',
    },
  });

  try {
    // Create initial key pairs, sdk will create 3 key pairs by default change the number of create key by passing {numberOfKeyPair: } to the params
    // Create single key pair by using factomConnectSDK.keyUtil.createKeyPair()
    const originalKeyPairs = factomConnectSDK.identity.createIdentityKeyPair();
    const publicKeyArr = [];
    for (let index = 0; index < originalKeyPairs.length; index++) {
      publicKeyArr.push(originalKeyPairs[index].publicKey);
    }

    // Create identity with originalKeyPairs created above
    const createIdentityChainResponse = await factomConnectSDK.identity.createAnIdentity({
      name: [
        'NotarySimulation',
        (new Date()).toISOString(),
      ],
      keys: [
        ...publicKeyArr,
      ],
    });

    // Using a document from Customer as input for hash process
    const documentBuffer = fs.readFileSync('./NotaryDoc.pdf');
    const documentHash = sha256(documentBuffer);

    const document = {
      link: '/document',
      hash: documentHash,
    };

    responseData(response, {
      originalKeyPairs: originalKeyPairs,
      identityChainId: createIdentityChainResponse.chain_id,
      document: document,
    });
  } catch (error) {
    console.log(error);
  }
};
