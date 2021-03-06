chains
------
### Table of Contents

- [get](#chainsGet)
- [create](#chainsCreate)
- [list](#chainsList)
- [search](#chainsSearch)
- [entries](#chainsEntries)
	- [get](#entriesGet)
	- [create](#entriesCreate)
	- [list](#entriesList)
	- [getFirst](#entriesFirst)
	- [getLast](#entriesLast)
	- [search](#entriesSearch)

### <a name="chainsGet"></a> get

Gets information about a specific chain from Connect.

**Sample**
```JS
const chainObj = await factomConnectSDK.chains.get({
      chainId: '4b9532c79d53ab22b85951b4a5853f81c2682132b3c810a95128c30401cd1e58'
});
```

**Parameters**

| **Name**                     | **Type** | **Description**                                                                                                                                                                                                                                                                       | **SDK Error Message & Description**       <img width=400/>                          |
|------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|
| `params.chainId`             | string <br> `Required` | The unique identifier created for each chain.                                                                                                                                                                                                                            | **chainId is required** </br> `chainId` parameter was not provided. |
| `params.signatureValidation` | boolean (`true`/`false`/`custom function`) <br> `Optional` |  Default value is `true`. Indicates whether the SDK automatically validates that the chain was signed based on our signing standard. </br> `custom function`: allows for validating the chain's signature  based on custom logic. |
| `params.accessToken` | object <br> `Optional` | This is the override parameter that allows user to specify the following two authentication parameters which will override the same parameters which have already been set on the instantiation of the SDK class </br>  * `appId` (string) </br> * `appKey`  (string)|
| `params.baseUrl` | string <br> `Optional` | This is the override parameter that allows user to specify a different API Base URL for your application (which you can see by clicking on any of the applications in the application list the you see upon logging into https://account.factom.com)   |

**Returns**

**Response:** OK
-   **data:** object
    -   **data.chain_id:** string </br> The unique identifier created for each chain.
    -   **data.content:** string </br> The data that was stored in the first entry of this chain.
    -   **data.external_ids:** array of strings </br> Tags that have been used to identify the first entry of this chain.
    -   **data.stage:** string </br> The immutability stage that this chain has reached.
    -   **data.entries:** object
        -   **data.entries.href:** string </br> An API link to all of the entries in this chain.
    -   **data.eblock:** object </br> Represents the Entry Block that contains the first entry of this chain. This will be null if the chain is not at least at the `factom` immutability stage.
	    -   **data.eblock.keymr:** string </br> The Key Merkle Root for this entry block.
	    -   **data.eblock.href:** string </br> An API link to retrieve all information about this entry block.
	-   **data.dblock:** object </br> Represents the Directory Block that relates to this chain. This will be null if the chain is not at least at the `factom` immutability stage.
		-   **data.dblock.keymr:** string </br> The Key Merkle Root for this directory block.
		-   **data.dblock.height:** integer </br> The Factom blockchain height of this directory block.
		-   **data.dblock.href:** string </br> An API link to retrieve all information about this directory block.
	-   **data.created_at:** string </br> The time at which the chain was created. Sent in [ISO 8601 Format](https://en.wikipedia.org/wiki/ISO_8601). For example: `YYYY-MM-DDThh:mm:ss.ssssssZ`. This will be null if the chain is not at least at the `factom` immutability stage.
-   **status:** string </br> The result of signature validation.</br>
Displays an empty string ("") when `signatureValidation` is set to `false`.
</br> Or displays a function's result when `signatureValidation` is set to `custom function`.
</br> In case `signatureValidation` is set to `true` then one of the following values will be returned based on an automatic comparison of the expected SignedChain structure outlined in our signing standard.
    -   **not_signed/invalid_chain_format:** A chain that was not signed or did not conform to the SignedChain structure.
    -   **invalid_signature:** A chain was created in the proper SignedChain structure, but the signature does not match the attached key.
    -   **retired_height:** A chain that conformed to the SignedChain structure and the signature was verified with the listed key, but
    that key was retired for the signer identity at a height lower than when this chain reached the `factom` immutability stage.
    -   **key_not_found:** A chain that conformed to the SignedChain structure but the signer public key does not belong to the signer identity chain.
    -   **valid_signature:** A chain that conformed to the SignedChain structure and the signature was verified with the listed key. That key was also active for the signer identity at the height when this chain reached the `factom` immutability stage.

```JS
{
  'chain':{
     'data':{
        'stage':'replicated',
        'external_ids':[
           'SignedChain',
           '0x01',
           'd22fd62b2c64061d48121d24bfa4e57826caaf532df1524da6eb243da3daa84f',
           'idpub25ZVKWA7BqTM7VmBtWK5DYNQwusqMpxbWABigfvqqQVNcd2Fr6',
           '2a0ebd83a34fef6e38049815d199398eb4e5ed34a32e8f9f1fa6184d2ec6015e7be601d0fb75679e62575c3cdd7779f52a84a9853f8725932e3a92143d2b3c05',
           '2019-03-15T03:43:22.200505',
           'NotarySimulation',
           'CustomerChain',
           'cust123'
        ],
        'entries':{
           'href':'/v1/chains/4b9532c79d53ab22b85951b4a5853f81c2682132b3c810a95128c30401cd1e58/entries'
        },
        'eblock':None,
        'dblock':None,
        'created_at':None,
        'content':"This chain represents a notary service's customer in the NotarySimulation, a sample implementation provided as part of the Factom Harmony SDKs. Learn more here: https://docs.harmony.factom.com/docs/sdks-clients",
        'chain_id':'4b9532c79d53ab22b85951b4a5853f81c2682132b3c810a95128c30401cd1e58'
     }
  },
  'status':'valid_signature'
}
```

### <a name="chainsCreate"></a>create

Creates a new chain with or without signature:

-   When the Factom SDK is initialized, if `automaticSigning` =  `true`; in order to create a signed chain, you need to pass:
    -   `signerChainId`
    -   `signerPrivateKey`
-   When the Factom SDK is initialized, if `automaticSigning` = `false`, SDK creates an unsigned chain and therefore it does not require these parameters.

**Sample**
```JS
const chainObj = await factomConnectSDK.chains.create({
      signerPrivateKey: 'idsec2rY42dadPcytBLEx9sanpCJk3PHqLnVwMYuPF7jcmDULVRySH2',
      signerChainId: 'd22fd62b2c64061d48121d24bfa4e57826caaf532df1524da6eb243da3daa84f',
      externalIds: ["TestFunction", "CustomerChain", "cust123"],
      content: "This chain represents a notary service’s customer in the NotarySimulation, a sample implementation provided as part of the Factom Harmony SDKs. Learn more here: https://docs.harmony.factom.com/docs/sdks-clients"
});
```

**Parameters**

| **Name**                  | **Type**                               | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                      | **SDK Error Message & Description**                                                                                               <img width=1500/>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|---------------------------|----------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `params.externalIds`      | array of strings <br> `Required or Optional` | Tags that can be used to identify your chain. You can search for records that contain a particular `externalIds` using Connect.</br>  **Note:** Since the Connect API requires each array element to be Base64 encoded, the SDK will do so before making the API request. This parameter is only required for creating an unsigned chain (`automaticSigning` is set to `false`). | **at least 1 externalId is required.** </br> `externalIds` parameter was not provided when `automaticSigning` was set to `false`. </br></br>**externalIds must be an array.**</br>  An invalid `externalIds` format was provided.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `params.content`                 | string <br> `Required`                               | This is the data that will make up the first entry in your new chain. It is customary to use this space to describe the entries that are to follow in the chain.</br> **Note:** Since the Connect API requires the `content` to be Base64 encoded, the SDK will do so before making the API request.                                                                                | **content is required.**</br>    `content` parameter was not provided.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `params.signerChainId`    | string <br> `Required or Optional` | The chain id of the signer identity.</br> **Note:** This parameter is optional for creating an unsigned chain. However, if `signerPrivateKey` is inputted then `signerChainId` must also be inputted.                                                                                                                                                                                                                                                         | In case of creating a signed chain: </br> **signerChainId is required.** </br> `signerChainId` parameter was not provided. </br></br> In case of creating an unsigned chain:</br> **signerChainId is required when passing a signerPrivateKey.**</br> `signerPrivateKey` parameter was provided but lacking `signerChainId` parameter.                                                                                                                                                                                                                                                                                                                                       |
| `params.signerPrivateKey` | base58 string in Idsec format <br> `Required or Optional` | The private key signer would like to sign with. In fact, private key is used to generate the public key, which is included as an external ID on the created signed entry. </br> **Note:** This parameter is optional for creating an unsigned chain. However, if `signerChainId` is inputted then `signerPrivateKey` must also be inputted.                                     | In case of creating a signed chain:</br> **signerPrivateKey is required.**</br> `signerPrivateKey` parameter was not provided.</br></br>  **signerPrivateKey is invalid.** </br> An invalid `signerPrivateKey` parameter was provided or key’s byte length is not equal to 41. </br></br> In case of creating an unsigned chain: </br> **signerPrivateKey is required when passing a signerChainId.** </br>   `signerChainId` parameter was provided but lacking `signerPrivateKey` parameter.  </br></br>  **signerPrivateKey is invalid.**  `signerChainId` was provided but either an invalid `signerPrivateKey` parameter was also provided or key’s byte length is not equal to 41. |
| `params.callbackUrl`      | string <br> `Optional`                               | The URL where you would like to receive the callback from Connect. </br> **Note:** If this is not specified, callbacks will not be activated.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | **callbackUrl is an invalid url format.** </br> An invalid `callbackUrl` format was provided.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `params.callbackStages`   | array of strings <br> `Optional` |                               | The immutability stages you would like to be notified about. This list can include any or all of the three stages: `replicated`, `factom`, and `anchored`. For example, when you would like to trigger the callback from Connect at `replicated` and `factom` stage, you would send them in the format: [‘replicated’, ‘factom’]. </br> **Note:** For this field to matter, the URL must be provided. If callbacks are activated (URL has been specified) and this field is not sent, it will default to `factom` and `anchored`. | **callbackStages must be an array.** </br> An invalid `callbackStages` format was provided.   |
| `params.accessToken` | object <br> `Optional` | This is the override parameter that allows user to specify the following two authentication parameters which will override the same parameters which have already been set on the instantiation of the SDK class </br>  * `appId` (string) </br> * `appKey`  (string)|
| `params.baseUrl` | string <br> `Optional` | This is the override parameter that allows user to specify a different API Base URL for your application (which you can see by clicking on any of the applications in the application list the you see upon logging into https://account.factom.com)   |
| `params.automaticSigning` | boolean <br> `Optional` | Setting this property to `false` allows user to create an unsigned entry, or implement their own way of signing the entry (it is set to `true` by default in the SDK class that gets instantiated)    |


**Returns**

**Response:** Accepted

-   **chain_id:** string </br> This is the unique identifier created for each chain.  </br>**Note**: Chain ID is a hash based on the external IDs you choose. External IDs must be unique or else the chain creation will fail.
-   **entry_hash:** string </br> The SHA256 Hash of the first entry of this new chain.
-   **stage:** string </br> The immutability stage that this chain has reached.

```JS
{
   'stage':'replicated',
   'entry_hash':'e76e92550fb49634f83bea791345c138e2f081da0053f0a2e19c03da98036a36',
   'chain_id':'4b9532c79d53ab22b85951b4a5853f81c2682132b3c810a95128c30401cd1e58'
}
```

### <a name="chainsList"></a>list

Gets all of the chains on Factom.

**Sample**
```JS
await factomConnectSDK.chains.list();
```

**Parameters**

| **Name**        | **Type** | **Description**                                                                                                                                                                                                                                                                                                                                                                                | **SDK Error Message & Description**       <img width=1300/>                                      |   |
|-----------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|---|
| `params.limit`  | integer <br> `Optional` | The number of items you would like to return back in each stage. The default value is 15.                                                                                                                                                                                                                                                                          | **limit must be an integer.**</br>   An invalid `limit` format was provided.  |   |
| `params.offset` | integer <br> `Optional` | The offset parameter allows you to select which item you would like to start from when a list is returned from Connect. For example, if you have already seen the first 15 items and you would like the next set, you would send an offset of 15. `offset=0` starts from the first item of the set and is the default position. | **offset must be an integer.**  </br>   An invalid `offset` format was provided. |   |
| `params.stages` | array of strings <br> `Optional` | The immutability stages you want to restrict results to. You can choose any from `replicated`, `factom`, and `anchored`. The default value are these three stages: `replicated`, `factom`, and `anchored`. </br>  **Note**: If you would like to search among multiple stages, you would send them in the format: [‘replicated’, ‘factom’]. | **stages must be an array.**</br>  An invalid `stages` format was provided.   |
| `params.accessToken` | object <br> `Optional` | This is the override parameter that allows user to specify the following two authentication parameters which will override the same parameters which have already been set on the instantiation of the SDK class </br>  * `appId` (string) </br> * `appKey`  (string)|
| `params.baseUrl` | string <br> `Optional` | This is the override parameter that allows user to specify a different API Base URL for your application (which you can see by clicking on any of the applications in the application list the you see upon logging into https://account.factom.com)   |

**Returns**

**Response:** OK
-   **data:** array of objects </br> An array that contains the chains on this page.
    -   **data[].chain_id:** string </br> The ID for this chain on the Factom blockchain.
    -   **data[].external_ids:** array of strings </br> The external IDs attached to this chain on the Factom blockchain.
    -   **data[].href:** string </br> An API link to retrieve all information about this chain.
    -   **data[].stage:** string </br> The immutability stage that this chain has reached.
    -   **data[].created_at:** string </br> The time when the chain was created. Sent in [ISO 8601 Format](https://en.wikipedia.org/wiki/ISO_8601). For example: `YYYY-MM-DDThh:mm:ss.ssssssZ`. This will be null if the chain is not at least at the `factom` immutability stage.
-   **offset:** integer </br> The index of the first chain returned from the total set, which starts from 0.
-   **limit:** integer </br> The number of chains returned.
-   **count:** integer </br> The total number of chains seen.

```JS
{
   'offset':0,
   'limit':1,
   'data':[
      {
         'stage':'replicated',
         'href':'/v1/chains/e8ac011c4b0f6a5539e835811da7404442fcbbe6c26ce5feaa8b702dbd99209e',
         'external_ids':[
            'SignedChain',
            '0x01',
            '7cdd5333033b4bb6a6c73b4b239257516793b3b83ea6c698d9b9db9764717704',
            'idpub2174LhCanGnM6dHiin6hkzVD7x2M18ChiQShJAohMc9yzP79R9',
	    'c12700993e2764ed3786f910a6d7038326a628966b5ea861b4522a76257c362b8bbdfd1a73f239a7aaa20737b579d60f1905879fff1e7b7f2edcc5e73c6bd601',
            '2019-03-15T03:51:57.383862',
            'NotarySimulation',
            'CustomerChain',
            'cust123'
         ],
         'created_at':None,
         'chain_id':'e8ac011c4b0f6a5539e835811da7404442fcbbe6c26ce5feaa8b702dbd99209e'
      }
   ],
   'count':1298
}
```

### <a name="chainsSearch"></a>search

Finds all of the chains with `externalIds` that match what you entered.

**Sample**
```JS
const chainObj = await factomConnectSDK.chains.search({
      externalIds: ["TestFunction", "CustomerChain", "cust123"]
});
```

**Parameters**

| **Name**             | **Type** | **Description**                                                                                                                                                                                                                                                                                                                                                                            | **SDK Error Message & Description**      <img width=1300/>                                                                                                                                                   |   |
|----------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---|
| `params.externalIds` | array of strings <br> `Required` | A list of external IDs associated with the chains user would like to search by.                                                                                                                                                                                                                                                                              | **at least 1 externalId is required.**</br>  `externalIds` parameter was not provided.</br> </br>  **externalIds must be an array.** </br>  An invalid `externalIds` format was provided. |   |
| `params.limit`       | integer <br> `Optional` | The number of items you would like to return back in each stage. The default value is 15.                                                                                                                                                                                                                                                                             | **limit must be an integer.** </br> An invalid `limit` format was provided.                                                                                                          |   |
| `params.offset`      | integer <br> `Optional` | The offset parameter allows you to select which item you would like to start from when a list is returned from Connect. For example, if you have already seen the first 15 items and you would like the next set, you would send an offset of 15. `offset=0` starts from the first item of the set and is the default position. | **offset must be an integer.**</br>  An invalid `offset` format was provided.                                                                                                      |
| `params.accessToken` | object <br> `Optional` | This is the override parameter that allows user to specify the following two authentication parameters which will override the same parameters which have already been set on the instantiation of the SDK class </br>  * `appId` (string) </br> * `appKey`  (string)|
| `params.baseUrl` | string <br> `Optional` | This is the override parameter that allows user to specify a different API Base URL for your application (which you can see by clicking on any of the applications in the application list the you see upon logging into https://account.factom.com)   |

**Returns**

**Response:** OK
-   **data:** array of objects </br> An array that contains the chains on this page.
    -   **data[].chain_id:** string </br> The ID for this chain on the Factom blockchain.
    -   **data[].external_ids:** array of strings </br> The external IDs attached to this chain on the Factom blockchain.
    -   **data[].href:** string </br> An API link to retrieve all information about this chain.
    -   **data[].stage:** string </br> The level of immutability that this chain has reached.
    -   **data[].created_at:** string </br> The time at which this chain was created. Sent in [ISO 8601 Format](https://en.wikipedia.org/wiki/ISO_8601). For example: `YYYY-MM-DDThh:mm:ss.ssssssZ`. This will be null if the chain is not at least at the `factom` immutability stage.
-   **offset:** integer </br> The index of the first chain returned from the total set, which starts from 0.
-   **limit:** integer </br> The number of chains returned.
-   **count:** integer </br> The total number of chains seen.

```JS
{
   'offset':0,
   'limit':1,
   'data':[
      {
         'stage':'factom',
         'href':'/v1/chains/75f40155d87c1da402c4e9e8e0ee6b8915aa5db98e32e6f4d1649ca495e7f225',
         'external_ids':[
            'SignedChain',
            '0x01',
            '33f4a13b69c91b0f6a13e940bcd83831cb1fefd4a26a956e1ec456b02d553fa3',
            'idpub2qSXVg7Tw2o3FUu7vz6j96FrS3BTVjvhM4mMLoAvmyK5t2VDXG',
	    '9aae05eb4c164f416fa1f2b7911c0a278dd9f10b5714781e4b14c579c70041fb937dfdc039c9f9b9a04d075915312c66c54a0e3ebecc5bd726ed14b12a4dc708',
            '2019-03-04T04:29:54.222Z',
            'TestFunction',
            'CustomerChain',
            'cust123'
         ],
         'created_at':'2019-03-04T04:30:00.000000Z',
         'chain_id':'75f40155d87c1da402c4e9e8e0ee6b8915aa5db98e32e6f4d1649ca495e7f225'
      }
   ],
   'count':19
}
```

### <a name="chainsEntries"></a>entries

##### <a name="entriesGet"></a> get

Gets information about a specific entry on Connect.

**Sample**
```JS
const entryObj = await factomConnectSDK.chains.entries.get({
      chainId: 'c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2',
      entryHash: 'cccf02ac98c9e04f556508aa4dc9e277d44e8ce2006a244ebec082e0bed36efc'
});
```

**Parameters**

| **Name**                     | **Type** | **Description**                                                                                                                                                                                                                                                                                                        | **SDK Error Message & Description**    <img width=400/>                                        |
|------------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| `params.chainId`             | string <br> `Required` | The chain identifier.                                                                                                                                                                                                                                                                                    | **chainId is required.**</br>  `chainId` parameter was not provided.</br>      |
| `params.entryHash`           | string <br> `Required` | The SHA256 hash of the entry.                                                                                                                                                                                                                                                                             | **entryHash is required.** </br> `entryHash` parameter was not provided. |
| `params.signatureValidation` | boolean (`true`/`false`/`custom function`) <br> `Optional` | The default value is `true`. Indicates whether the SDK automatically validates that the entry was signed based on our signing standard. </br> `custom function`: allows for validating the entry's signature based on custom logic. |
| `params.accessToken` | object <br> `Optional` | This is the override parameter that allows user to specify the following two authentication parameters which will override the same parameters which have already been set on the instantiation of the SDK class </br>  * `appId` (string) </br> * `appKey`  (string)|
| `params.baseUrl` | string <br> `Optional` | This is the override parameter that allows user to specify a different API Base URL for your application (which you can see by clicking on any of the applications in the application list the you see upon logging into https://account.factom.com)   |

**Returns**

**Response:** OK
-   **data:** object
    -   **data.entry_hash:** string </br> The SHA256 Hash of this entry.
    -   **data.chain:** object </br> An object that contains the Chain Hash (ID) as well as a URL for the chain.
        -   **data.chain.chain_id:** string </br> The ID for this chain on the Factom blockchain.
        -   **data.chain.href:** string </br> An API link to retrieve all information about this chain.
    -   **data.created_at:** string </br> The time when this entry was created. Sent in [ISO 8601 Format](https://en.wikipedia.org/wiki/ISO_8601). For example: `YYYY-MM-DDThh:mm:ssssssZ`.
    -   **data.external_ids:** array of strings </br> Tags that can be used to identify your entry. You can search for records that contain a particular external ID using Connect.</br> **Note**: Since the Connect API Base64 encodes these values for transport, each array element will be decoded for you by the SDK.
    -   **data.content:** string </br> This is the data that is stored by the entry.</br>  **Note**: Since the Connect API Base64 encodes these values for transport, `content` will be decoded for you by the SDK.
    -   **data.stage:** string </br> The level of immutability that this entry has reached.
    -   **data.dblock:** object </br> Represents the Directory Block that relates to this entry. This will be null if the chain is not at least at the `factom` immutability stage.
		-   **data.dblock.keymr:** string </br> The Key Merkle Root for this directory block.
		-   **data.dblock.height:** integer </br> The Factom blockchain height of this directory block.
		-   **data.dblock.href:** string </br> An API link to retrieve all information about this directory block.
	-   **data.eblock:** object </br> Represents the Entry Block that contains the entry. This will be null if the entry is not at least at the `factom` immutability stage.
		- **data.eblock.keymr:** string</br> The Key Merkle Root for this entry block.
		- **data.eblock.href:** string</br> An API link to retrieve all information about this entry block.
-   **status:** string </br> The result of signature validation.</br>
Displays an empty string ("") when `signatureValidation` is set to `false`.</br>
Or displays a function's result when `signatureValidation` is set to `custom function`.</br>
In case `signatureValidation` is set to `true` then one of the following values will be returned based on an automatic comparison of the expected SignedEntry structure outlined in our signing standard.
    - **not_signed/invalid_entry_format:** An entry that was not signed or did not conform to the SignedEntry structure.
    - **invalid_signature:** An entry was created in the proper SignedEntry structure, but the signature does not match the attached key.
    - **retired_height:** An entry that conformed to the SignedEntry structure and the signature was verified with the listed key, but that key was retired for the signer identity at a height lower than when this entry reached the `factom` immutability stage.
    -   **key_not_found:** An entry that conformed to the SignedEntry structure but the signer public key does not belong to the signer identity chain.
    - **valid_signature:** An entry that conformed to the SignedEntry structure and the signature was verified with the listed key. That key was also active for the signer identity at the height when this entry reached the `factom` immutability stage.

```JS
{
   'entry':{
      'data':{
         'stage':'replicated',
         'external_ids':[
            'SignedEntry',
            '0x01',
            '8c33e7432cdfd3933beb6de5ccbc3706ac21458ed53352e02658daf2dce8f27c',
            'idpub3D92p9aiSFo6ad4UbkvcPDE7cFcGqQky2yMk1gjKCfWwh9zfpq',
	    '116ef1cdcbb6b047729dd5cba77aeb2ef61a764af847a2c85c6aee531545aa678ef220ec35e36d13ee9b82779bef1106d5fb7f97b1640a6991cc645c67d6ee0e',
            '2019-03-15T03:58:31.259724',
            'NotarySimulation',
            'DocumentEntry',
            'doc987'
         ],
         'entry_hash':'cccf02ac98c9e04f556508aa4dc9e277d44e8ce2006a244ebec082e0bed36efc',
         'eblock':None,
         'dblock':None,
         'created_at':None,
         'content':'{"document_hash": "98e8447527dd18fd054ff76371d4885972887481b1499dad02ac3c39748a4012", "hash_type": "sha256"}',
         'chain':{
            'href':'/v1/chains/c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2',
            'chain_id':'c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2'
         }
      }
   },
   'status':'valid_signature'
}
```

##### <a name="entriesCreate"></a>create

Creates a new entry for the selected chain with or without signature:

-   When the Factom SDK is initialized, if `automaticSigning` = `true`; in order to create a signed entry, you need to pass:
    -   `signerChainId`
    -   `signerPrivateKey`
-   When the Factom SDK is initialized, if `automaticSigning` =
    `false`, SDK creates an unsigned entry and therefore it does
    not require these parameters.

**Sample**
```JS
const entryObj = await factomConnectSDK.chains.entries.create({
      chainId: 'c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2',
      signerPrivateKey: 'idsec1xbKD6tkgLPMBuNQbTnHPr6mFoeF7iQV4ybTN63sKdFg7h1uWH',
      signerChainId: '8c33e7432cdfd3933beb6de5ccbc3706ac21458ed53352e02658daf2dce8f27c',
      externalIds: ["TestFunction", "DocumentEntry", "doc987"],
      content: 'Abc123'
});
```

**Parameters**

| **Name**                  | **Type**                         | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | **SDK Error Message & Description**    <img width=1500/>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|---------------------------|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `params.chainId`          | string <br> `Required`                         | The chain identifier.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | **chainId is required.**</br>  `chainId` parameter was not provided.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `params.externalIds`      | array of strings <br> `Required or Optional` | Tags that can be used to identify your entry. You can search for records that contain a particular external ID using Connect.</br>  **Note:** Since the Connect API requires each array element to be Base64 encoded, the SDK will do so before making the API request. This parameter is only required for creating an unsigned entry  (`automaticSigning` is set to `false`).                                                                                                                                                         | **at least 1 externalId is required.**</br> `externalIds` parameter was not provided when `automaticSigning` is set to `false`.</br></br>  **externalIds must be an array.**</br>  An invalid `externalIds` format was provided.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `params.content`          | string <br> `Required`                         | This is the data that will be stored directly</br>  on the blockchain. Please be sure that no</br>  private information is entered here.</br>   **Note:** The value in `content` parameter will</br>  be encoded in Base64 format by Connect</br>  SDK.                                                                                                                                                                                                                                                                                                                                                        | **content is required.**</br>   `content` parameter was not provided.</br>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |The chain ID of the signer identity.</br>  **Note:** This parameter is optional for creating an unsigned entry. However, if `signerPrivateKey` is inputted then `signerChainId` must also be inputted.                                                                                                                                                                                                                                                                                                                                                                                       | In case of creating a signed entry:</br> **signerChainId is required.**</br> `signerChainId` parameter was not provided.</br></br>  In case of creating an unsigned entry:</br>  **signerChainId is required when passing a signerPrivateKey.**</br> `signerPrivateKey` was provided but lacking `signerChainId` parameter.                                                                                                                                                                                                                                                                                                                                                                                                   |
| `params.signerChainId`    | string <br> `Required or Optional`   | The chain ID of the signer identity.</br>  **Note:** This parameter is optional for creating an unsigned entry. However, if `signerPrivateKey` is inputted then `signerChainId` must also be inputted.                                                                                                                                                                                                                                                                                                                                                                                       | In case of creating a signed entry:</br> **signerChainId is required.**</br> `signerChainId` parameter was not provided.</br></br>  In case of creating an unsigned entry:</br>  **signerChainId is required when passing a signerPrivateKey.**</br> `signerPrivateKey` was provided but lacking `signerChainId` parameter.                                                                                                                                                                                                                                                                                                                                                                                                   |
| `params.signerPrivateKey` | a base58 string in Idsec format <br> `Required or Optional` | The private key signer would like to sign with. In fact, private key is used to generate the public key, which is included as an external ID on the created signed entry.</br>   **Note:** This parameter is optional for creating an unsigned entry. However, if `signerChainId` is inputted then `signerPrivateKey` must also be inputted.                                                                                                                                                                                               | In case of creating a signed entry:</br>  **signerPrivateKey is required.**</br> `signerPrivateKey` parameter was not provided.</br></br>  **signerPrivateKey is invalid.**</br> An invalid `signerPrivateKey` parameter was provided or key's byte length is not equal to 41. </br></br>  In case of creating an unsigned  entry:</br>  **signerPrivateKey is required when passing a signerChainId.**</br> `signerChainId` was provided but lacking `signerPrivateKey` parameter.</br></br>  **signerPrivateKey is invalid.**</br>  `signerChainId` was provided but an invalid `signerPrivateKey` parameter was provided or key's byte length is not equal to 41. |
| `params.callbackUrl`      | string <br> `Optional`                         | the URL you would like the callbacks to be sent to **Note:** If this is not specified, callbacks will not be activated.                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | **callbackUrl is an invalid url format.**</br> An invalid `callbackUrl` format was provided                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `params.callbackStages`   | array of strings <br> `Optional`                         | The immutability stages you would like to be notified about. This list can include any or all of these three stages: `replicated`,  `factom`, and `anchored`. For example, when you would like to trigger the callback from Connect from `replicated` and `factom` then you would send them in the format: ['replicated', 'factom'].</br> **Note:** For this field to matter, the URL must be provided.</br> If callbacks are activated (URL has been specified) and this field is not sent, it will default to `factom` and `anchored`. | **callbackStages must be an array.**</br> An invalid `callbackStages` format was provided   |
| `params.accessToken` | object <br> `Optional` | This is the override parameter that allows user to specify the following two authentication parameters which will override the same parameters which have already been set on the instantiation of the SDK class </br>  * `appId` (string) </br> * `appKey`  (string)|
| `params.baseUrl` | string <br> `Optional` | This is the override parameter that allows user to specify a different API Base URL for your application (which you can see by clicking on any of the applications in the application list the you see upon logging into https://account.factom.com)   |
| `params.automaticSigning` | boolean <br> `Optional` | Setting this property to `false` allows user to create an unsigned entry, or implement their own way of signing the entry (it is set to `true` by default in the SDK class that gets instantiated)    |

**Returns**

**Response:** Accepted
-   **entry_hash** string </br>
    The SHA256 Hash of the entry you just created. You can use this hash
    to reference this entry in the future.
-   **stage:** string </br> The current immutability stage of the new entry.

```JS
{
   'stage':'replicated',
   'entry_hash':'cccf02ac98c9e04f556508aa4dc9e277d44e8ce2006a244ebec082e0bed36efc'
}
```

##### <a name="entriesList"></a> list

Gets list of all entries contained on a specified chain.

**Sample**
```JS
const entriesObj = await factomConnectSDK.chains.entries.list({
      chainId: 'c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2'
});
```

**Parameters**

| **Name**         | **Type** | **Description**                                                                                                                                                                                                                                                                                                                                                                            | **SDK Error Message & Description** <img width=1300/>                                                   |
|------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| `params.chainId` | string <br> `Required` | The chain identifier.                                                                                                                                                                                                                                                                                                                                                        | **chainId is required.**</br>  `chainId` parameter was not provided.           |
| `params.limit`   | integer <br> `Optional` | The number of items you would like back in each page. The default value is 15.                                                                                                                                                     | **limit must ben an integer.**</br> An invalid `limit` format was provided.  |
| `params.offset`  | integer <br> `Optional` | The offset parameter allows you to select which item you would like to start from when a list is returned from Connect. For example, if you have already seen the first 15 items and you would like the next set, you would send an offset of 15. `offset=0` starts from the first item of the set and is the default position.  | **offset must be an integer.**</br> An invalid `offset` format was provided.|
| `params.stages`  | array of strings <br> `Optional` | The immutability stages you want to restrict results to. You can choose any from `replicated`, `factom`, and `anchored`. The default value are these three stages: `replicated`, `factom` and `anchored`.</br>  **Note:** If you would like to search among multiple stages, you would send them in the format ['replicated', 'factom'].  | **stages must be an array.**</br>  An invalid `stages` format was provided. |
| `params.accessToken` | object <br> `Optional` | This is the override parameter that allows user to specify the following two authentication parameters which will override the same parameters which have already been set on the instantiation of the SDK class </br>  * `appId` (string) </br> * `appKey`  (string)|
| `params.baseUrl` | string <br> `Optional` | This is the override parameter that allows user to specify a different API Base URL for your application (which you can see by clicking on any of the applications in the application list the you see upon logging into https://account.factom.com)   |

**Returns**

**Response:** OK

-   **data:** array of objects </br> An array that contains the entries on this page.
    -   **data[].entry_hash:** string </br> The SHA256 Hash of this entry.
    -   **data[].chain:** object </br> An object that contains the Chain Hash (ID) as well as a URL for the chain.
        -   **data[].chain.chain_id:** string </br> The ID for this chain on the Factom blockchain.
        -   **data[].chain.href:** string </br> An API link to retrieve all information about this chain.
    -   **data[].created_at:** string </br> The time at which this entry was created. Sent in [ISO 8601 Format](https://en.wikipedia.org/wiki/ISO_8601). For example: `YYYY-MM-DDThh:mm:ssssssZ`.
    -   **data[].href:** string </br>  An API link to retrieve all information about this entry.
-   **offset:** integer </br> The index of the first entry returned from the total set starting from 0.
-   **limit:** integer </br> The number of entries returned per page.
-   **count:** integer </br> The total number of entries seen.

```JS
{
   'offset':0,
   'limit':15,
   'data':[
      {
         'stage':'replicated',
         'href':'/v1/chains/c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2/entries/bcf9ce3beba20007408319a3965a6dde2ad23eb45a20f0d61827b8dc3c584ced',
         'entry_hash':'bcf9ce3beba20007408319a3965a6dde2ad23eb45a20f0d61827b8dc3c584ced',
         'created_at':None,
         'chain':{
            'href':'/v1/chains/c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2',
            'chain_id':'c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2'
         }
      },
      {
         'stage':'replicated',
	 'href':'/v1/chains/c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2/entries/cccf02ac98c9e04f556508aa4dc9e277d44e8ce2006a244ebec082e0bed36efc',
         'entry_hash':'cccf02ac98c9e04f556508aa4dc9e277d44e8ce2006a244ebec082e0bed36efc',
         'created_at':None,
         'chain':{
            'href':'/v1/chains/c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2',
            'chain_id':'c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2'
         }
      }
   ],
   'count':2
}
```

##### <a name="entriesFirst"></a>getFirst

Retrieves the first entry that has been saved to this chain.

**Sample**
```JS
const entryObj = await factomConnectSDK.chains.entries.getFirst({
      chainId: 'c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2'
});
```

**Parameters**

| **Name**                     | **Type** | **Description**                                                                                                                                                                                                                                                                                                   | **SDK Error Message & Description**          <img width=400/>                             |
|------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| `params.chainId`             | string <br> `Required` | The chain identifier.                                                                                                                                                                                                                                                                               | **chainId is required.**</br>  `chainId` parameter was not provided.|
| `params.signatureValidation` | boolean (`true`/`false`/`custom function`) <br> `Optional` | Default value is `true`. Indicates whether the SDK automatically validates that the entry was signed based on our signing standard.</br>`custom function`: allows for validating the entry's signature based on custom logic. |
| `params.accessToken` | object <br> `Optional` | This is the override parameter that allows user to specify the following two authentication parameters which will override the same parameters which have already been set on the instantiation of the SDK class </br>  * `appId` (string) </br> * `appKey`  (string)|
| `params.baseUrl` | string <br> `Optional` | This is the override parameter that allows user to specify a different API Base URL for your application (which you can see by clicking on any of the applications in the application list the you see upon logging into https://account.factom.com)   |

**Returns**

**Response:** OK

-   **data:** object
    -   **data.entry_hash:** string </br> The SHA256 Hash of this entry.
    -   **data.chain:** object </br> An object that contains the Chain Hash (ID) as well as a URL for the chain.
        -   **data.chain.chain_id:** string </br> The ID for this chain on the Factom blockchain.
        -   **data.chain.href:**: string </br> An API link to retrieve all information about this chain.
    -   **data.created_at:** string </br> The time at which this entry was created. Sent in [ISO 8601 Format](https://en.wikipedia.org/wiki/ISO_8601). For example: `YYYY-MM-DDThh:mm:ssssssZ`.
    -   **data.external_ids:** array of strings </br> Tags that can be used to identify your entry. You can search for records that contain a particular external ID using Connect. </br> **Note:** Since the Connect API Base64 encodes these values for transport, each array element will be decoded for you by the SDK.
    -   **data.content:** string </br> This is the data that is stored by the entry. </br> **Note:** Since the Connect API Base64 encodes these values for transport, `content` will be decoded for you by the SDK.
    -   **data.stage:** string </br> The level of immutability that this entry has reached.
    -   **data.dblock:** object </br> Represents the Directory Block that relates to this entry. This will be null if the chain is not at least at the `factom` immutability stage.
		-   **data.dblock.keymr:** string </br> The Key Merkle Root for this directory block.
		-   **data.dblock.height:** integer </br> The Factom blockchain height of this directory block.
		-   **data.dblock.href: :** string </br> An API link to retrieve all information about this directory block.
	-   **data.eblock**: object </br> Represents the Entry Block that contains the entry. This will be null if the entry is not at least at the `factom` immutability stage.
		-   **data.eblock.keymr:** string </br> The Key Merkle Root for this entry block.
		-   **data.eblock.href**: string </br> An API link to retrieve all information about this entry block.
-   **status:** string </br> The result of signature validation.</br>
Displays an empty string ("") when `signatureValidation` is set to `false`.</br>
Or displays a function's result when `signatureValidation` is set to `custom function`.</br>
In case `signatureValidation` is set to `true` then one of the following values will be returned based on an automatic comparison of the expected SignedEntry structure outlined in our signing standard.
    - **not_signed/invalid_entry_format:** An entry that was not signed or did not conform to the SignedEntry structure.
    - **invalid_signature:** An entry was created in the proper SignedEntry structure, but the signature does not match the attached key.
    - **retired_height:** An entry that conformed to the SignedEntry structure and the signature was verified with the listed key, but that key was retired for the signer identity at a height lower than when this entry reached the `factom` immutability stage.
    -   **key_not_found:** An entry that conformed to the SignedEntry structure but the signer public key does not belong to the signer identity chain.
    - **valid_signature:** An entry that conformed to the SignedEntry structure and the signature was verified with the listed key. That key was also active for the signer identity at the height when this entry reached the `factom` immutability stage.

```JS
{
   'entry':{
      'data':{
         'stage':'replicated',
         'external_ids':[
            'SignedChain',
            '0x01',
            '8c33e7432cdfd3933beb6de5ccbc3706ac21458ed53352e02658daf2dce8f27c',
            'idpub3D92p9aiSFo6ad4UbkvcPDE7cFcGqQky2yMk1gjKCfWwh9zfpq',
            '54d5c4771f70bc197a8f6a347ce3a921425e3db4957918cc7bc305d694d59566989bf0be29843e805cc958ad0eed81b9a766c7b54602f474cc503c908729010d',
            '2019-03-15T03:58:28.544972',
            'NotarySimulation',
            'CustomerChain',
            'cust123'
         ],
         'entry_hash':'bcf9ce3beba20007408319a3965a6dde2ad23eb45a20f0d61827b8dc3c584ced',
         'eblock':None,
         'dblock':None,
         'created_at':None,
         'content':"This chain represents a notary service's customer in the NotarySimulation, a sample implementation provided as part of the Factom Harmony SDKs. Learn more here: https://docs.harmony.factom.com/docs/sdks-clients",
         'chain':{
            'href':'/v1/chains/c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2',
            'chain_id':'c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2'
         }
      }
   },
   'status':'not_signed/invalid_entry_format'
}
```

##### <a name="entriesLast"></a> getLast

Gets the last entry that has been saved to this chain.

**Sample**
```JS
const entryObj = await factomConnectSDK.chains.entries.getLast({
      chainId: 'c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2'
});
```

**Parameters**

| **Name**                     | **Type** | **Description**                                                                                                                                                                                                                                                                                                   | **SDK Error Message & Description**        <img width=400/>                               |
|------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| `params.chainId`             | string <br> `Required` | The chain identifier.                                                                                                                                                                                                                                                                               | **chainId is required.**</br>  `chainId` parameter was not provided.</br> |
| `params.signatureValidation` | boolean (`true`/`false`/`custom function`) <br> `Optional` | Default value is `true`. Indicates whether the SDK automatically validates that the entry</br> was signed based on our signing standard.</br>`custom function`: allows for validating the entry's signature based on custom logic.|
| `params.accessToken` | object <br> `Optional` | This is the override parameter that allows user to specify the following two authentication parameters which will override the same parameters which have already been set on the instantiation of the SDK class </br>  * `appId` (string) </br> * `appKey`  (string)|
| `params.baseUrl` | string <br> `Optional` | This is the override parameter that allows user to specify a different API Base URL for your application (which you can see by clicking on any of the applications in the application list the you see upon logging into https://account.factom.com)   |

**Returns**


**Response:** OK

-   **data:** object
    -   **data.entry_hash:** string </br> The SHA256 Hash of this entry.
    -   **data.chain:** object </br> An object that contains the Chain Hash (ID) as well as a URL for the chain.
        -   **data.chain.chain_id:** string </br> The ID for this chain on the Factom blockchain.
        -   **data.chain.href:**: string </br> An API link to retrieve all information about this chain.
    -   **data.created_at:** string </br> The time at which this entry was created. Sent in [ISO 8601 Format](https://en.wikipedia.org/wiki/ISO_8601). For example: `YYYY-MM-DDThh:mm:ssssssZ`.
    -   **data.external_ids:** array of strings </br> Tags that can be used to identify your entry. You can search for records that contain a particular external ID using Connect. </br> **Note:** Since the Connect API Base64 encodes these values for transport, each array element will be decoded for you by the SDK.
    -   **data.content:** string </br> This is the data that is stored by the entry. </br> **Note:** Since the Connect API Base64 encodes these values for transport, `content` will be decoded for you by the SDK.
    -   **data.stage:** string </br> The level of immutability that this entry has reached.
    -   **data.dblock:** object </br> Represents the Directory Block that relates to this entry. This will be null if the chain is not at least at the `factom` immutability stage.
		-   **data.dblock.keymr:** string </br> The Key Merkle Root for this directory block.
		-   **data.dblock.height:** integer </br> The Factom blockchain height of this directory block.
		-   **data.dblock.href: :** string </br> An API link to retrieve all information about this directory block.
	-   **data.eblock**: object </br> Represents the Entry Block that contains the entry. This will be null if the entry is not at least at the `factom` immutability stage.
		-   **data.eblock.keymr:** string </br> The Key Merkle Root for this entry block.
		-   **data.eblock.href**: string </br> An API link to retrieve all information about this entry block.
-   **status:** string </br> The result of signature validation.</br>
Displays an empty string ("") when `signatureValidation` is set to `false`.</br>
Or displays a function's result when `signatureValidation` is set to `custom function`.</br>
In case `signatureValidation` is set to `true` then one of the following values will be returned based on an automatic comparison of the expected SignedEntry structure outlined in our signing standard.
    - **not_signed/invalid_entry_format:** An entry that was not signed or did not conform to the SignedEntry structure.
    - **invalid_signature:** An entry was created in the proper SignedEntry structure, but the signature does not match the attached key.
    - **retired_height:** An entry that conformed to the SignedEntry structure and the signature was verified with the listed key, but that key was retired for the signer identity at a height lower than when this entry reached the `factom` immutability stage.
    -   **key_not_found:** An entry that conformed to the SignedEntry structure but the signer public key does not belong to the signer identity chain.
    - **valid_signature:** An entry that conformed to the SignedEntry structure and the signature was verified with the listed key. That key was also active for the signer identity at the height when this entry reached the `factom` immutability stage.

```JS
{
   'entry':{
      'data':{
         'stage':'replicated',
         'external_ids':[
            'SignedChain',
            '0x01',
            '8c33e7432cdfd3933beb6de5ccbc3706ac21458ed53352e02658daf2dce8f27c',
            'idpub3D92p9aiSFo6ad4UbkvcPDE7cFcGqQky2yMk1gjKCfWwh9zfpq',
            '54d5c4771f70bc197a8f6a347ce3a921425e3db4957918cc7bc305d694d59566989bf0be29843e805cc958ad0eed81b9a766c7b54602f474cc503c908729010d',
            '2019-03-15T03:58:28.544972',
            'NotarySimulation',
            'CustomerChain',
            'cust123'
         ],
         'entry_hash':'bcf9ce3beba20007408319a3965a6dde2ad23eb45a20f0d61827b8dc3c584ced',
         'eblock':None,
         'dblock':None,
         'created_at':None,
         'content':"This chain represents a notary service's customer in the NotarySimulation, a sample implementation provided as part of the Factom Harmony SDKs. Learn more here: https://docs.harmony.factom.com/docs/sdks-clients",
         'chain':{
            'href':'/v1/chains/c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2',
            'chain_id':'c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2'
         }
      }
   },
   'status':'not_signed/invalid_entry_format'
}
```

##### <a name="entriesSearch"></a>search

Finds all of the entries with `externalIds` that match what you entered.

**Sample**
```JS
const entriesObj = await factomConnectSDK.chains.entries.search({
      chainId: 'c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2',
      externalIds: ["TestFunction", "DocumentEntry", "doc987"]
});
```

**Parameters**

| **Name**             | **Type** | **Description**                                                                                                                                                                                                                                                                                                                                                                            | **SDK Error Message & Description** <img width=1300/>                                                                                                                                                |
|----------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `params.chainId`     | string <br> `Required` | The chain identifier.                                                                                                                                                                                                                                                                                                                                                        | **chainId is required.**</br>  `chainId` parameter was not provided.</br>                                                                                                           |
| `params.externalIds` | array of strings <br> `Required` | A list of external IDs.</br> **Note:** Since the Connect API requires each array element to be Base64 encoded, the SDK will do so before  making the API request.                                                                                                                                                                                   | **at least 1 externalId is required.**</br> `externalIds` parameter was not provided. </br></br>  **externalIds must be an array.**</br> An invalid `externalIds`parameter was provided. |
| `params.limit`       | integer <br> `Optional` | The number of items you would like to return back in each page. The default value is 15.                                                                                                                                                                                                                                                                              | **limit must be an integer.**</br> An invalid `limit` format was provided.</br>                                                                                                      |
| `params.offset`      | integer <br> `Optional` | The offset parameter allows you to select which item you would like to start from when a list is returned from Connect. For example, if you have already seen the first 15 items and you would like the next set, you would send an offset of 15. `offset=0` starts from the first item of the set and is the default position. | **offset must be an integer.**</br> An invalid `offset` format was provided. |
| `params.accessToken` | object <br> `Optional` | This is the override parameter that allows user to specify the following two authentication parameters which will override the same parameters which have already been set on the instantiation of the SDK class </br>  * `appId` (string) </br> * `appKey`  (string)|
| `params.baseUrl` | string <br> `Optional` | This is the override parameter that allows user to specify a different API Base URL for your application (which you can see by clicking on any of the applications in the application list the you see upon logging into https://account.factom.com)   |

**Returns**


**Response:** OK

-   **data:** array of objects
	-   **data[].entry_hash:** string </br> The SHA256 Hash of this entry.
    -   **data[].external_ids:** array of strings </br> Tags that can be used to identify your entry.</br> **Note:** Since the Connect API Base64 encodes these values for transport, each array element will be decoded for you by the SDK.
    -   **data[].stage:** string </br> The level of immutability that this entry has reached.
    -   **data[].href:** string </br> An API link to retrieve all information about this entry.
-   **offset:** integer </br> The index of the first item returned from the total set, which starts from 0.
-   **limit:** integer </br> The number of entries returned per page.
-   **count:** integer </br> The total number of entries seen.

```JS
{
   'offset':0,
   'limit':15,
   'data':[
      {
         'stage':'replicated',
         'href':'/v1/chains/c15f9e51781a8a4c520c15fd135e761b922b709217ebea974537e8689c74d0c2/entries/cccf02ac98c9e04f556508aa4dc9e277d44e8ce2006a244ebec082e0bed36efc',
         'external_ids':[
            'SignedEntry',
            '0x01',
            '8c33e7432cdfd3933beb6de5ccbc3706ac21458ed53352e02658daf2dce8f27c',
            'idpub3D92p9aiSFo6ad4UbkvcPDE7cFcGqQky2yMk1gjKCfWwh9zfpq',
            '116ef1cdcbb6b047729dd5cba77aeb2ef61a764af847a2c85c6aee531545aa678ef220ec35e36d13ee9b82779bef1106d5fb7f97b1640a6991cc645c67d6ee0e',
            '2019-03-15T03:58:31.259724',
            'NotarySimulation',
            'DocumentEntry',
            'doc987'
         ],
         'entry_hash':'cccf02ac98c9e04f556508aa4dc9e277d44e8ce2006a244ebec082e0bed36efc'
      }
   ],
   'count':1
}
```
