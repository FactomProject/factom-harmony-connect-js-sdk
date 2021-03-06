/* eslint class-methods-use-this: ["error", { "exceptMethods": ["createKeyPairs"] }] */

import isUrl from 'is-url';
import constants from '../utils/constants';
import APICall from '../api';
import KeyCommon from '../utils/keyCommon';
import CommonUtil from '../utils/commonUtil';
import IdentitiesKeyUtil from '../utils/identities/identitiesKeyUtil';

/**
 * @classdesc Represents the Identity. It allows the user to make call to the Identity API
 * with a single function.
 * @class
 */
export default class Identity {
  /**
   * @constructor
   * @param  {Object} options - An object containing the access token and the base URL
   */
  constructor(options) {
    this.apiCall = new APICall(options);
    this.keys = new IdentitiesKeyUtil(options);
  }

  /**
   * @param  {String} params.identityChainId='' The chain id of the desired Identity.
   * @return  {Promise} Returns a Promise that, when fulfilled, will either return an Object
   * with the Identity or an Error with the problem.
   */
  async get(params = {}) {
    if (!params.identityChainId) {
      throw new Error('identityChainId is required.');
    }
    const response = await this.apiCall.send(
      constants.GET_METHOD,
      `${constants.IDENTITIES_URL}/${params.identityChainId}`,
      {},
      params.baseUrl,
      params.accessToken,
    );

    return response;
  }

  /**
   * @param  {String[]} params.names=[]
   * @param  {String[]} params.keys=[]
   * @param  {String} params.callbackUrl=''
   * @param  {String[]} params.callbackStages=[]
   * @return  {Promise} Returns a Promise that, when fulfilled, will either return an Object
   * with the chain or an Error with the problem
   */
  async create(params = {}) {
    if (CommonUtil.isEmptyArray(params.names)) {
      throw new Error('at least 1 name is required.');
    }
    if (!Array.isArray(params.names)) {
      throw new Error('names must be an array.');
    }
    const keyPairs = [];
    let signerKeys = [];
    if (typeof params.keys !== 'undefined') {
      if (CommonUtil.isEmptyArray(params.keys)) {
        throw new Error('at least 1 key is required.');
      }
      if (!Array.isArray(params.keys)) {
        throw new Error('keys must be an array.');
      }
      signerKeys = params.keys;
    } else {
      for (let i = 0; i < 3; i += 1) {
        const pair = KeyCommon.createKeyPair();
        keyPairs.push(pair);
        signerKeys.push(pair.publicKey);
      }
    }

    if (params.callbackStages && !Array.isArray(params.callbackStages)) {
      throw new Error('callbackStages must be an array.');
    }

    const keysInvalid = KeyCommon.getInvalidKeys({ signerKeys: signerKeys });
    if (keysInvalid.length) {
      throw new Error(keysInvalid);
    }

    const duplicates = KeyCommon.getDuplicateKeys({ signerKeys: signerKeys });
    if (duplicates.length) {
      throw new Error(duplicates);
    }

    if (
      !CommonUtil.isEmptyString(params.callbackUrl)
      && !isUrl(params.callbackUrl)
    ) {
      throw new Error('callbackUrl is an invalid url format.');
    }

    let nameByteCounts = 0;
    params.names.forEach((o) => {
      nameByteCounts += Buffer.from(o).length;
    });

    // 2 bytes for the size of extid + 13 for actual IdentityChain ext-id text
    // 2 bytes per name for size * (number of names) + size of all names
    // 23 bytes for `{"keys":[],"version":1}`
    // 58 bytes per `"idpub2PHPArpDF6S86ys314D3JDiKD8HLqJ4HMFcjNJP6gxapoNsyFG",` array element
    // -1 byte because last key element has no comma
    // = 37 + name_byte_count + 2(number_of_names) + 58(number_of_keys)
    const totalBytes = 37 + nameByteCounts + 2 * params.names.length + signerKeys.length * 58;
    if (totalBytes > 10240) {
      throw new Error(`calculated bytes of names and keys is ${totalBytes}. It must be less than 10240, use less/shorter names or less keys.`);
    }

    const namesBase64 = [];
    params.names.forEach((o) => {
      namesBase64.push(Buffer.from(o.trim()).toString('base64'));
    });

    const data = {
      names: namesBase64,
      keys: signerKeys,
    };

    if (!CommonUtil.isEmptyString(params.callbackUrl)) {
      data.callback_url = params.callbackUrl;
    }
    if (Array.isArray(params.callbackStages)) {
      data.callback_stages = params.callbackStages;
    }

    const response = await this.apiCall.send(constants.POST_METHOD, constants.IDENTITIES_URL,
      data, params.baseUrl, params.accessToken);
    if (typeof params.keys === 'undefined') {
      const pairs = [];
      keyPairs.forEach((i) => {
        pairs.push({
          public_key: i.publicKey,
          private_key: i.privateKey,
        });
      });
      response.key_pairs = pairs;
    }

    return response;
  }
}
