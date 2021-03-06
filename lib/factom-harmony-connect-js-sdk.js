import Chains from './resources/Chains';
import Identities from './resources/Identities';
import ApiInfo from './resources/ApiInfo';
import Receipts from './resources/Receipts';
import Anchors from './resources/Anchors';
import Utils from './utils/utils';

export default class FactomSDK {
  /**
   * @constructor
   * @param  {Object} options - An object containing the access token and the base URL
   * @param  {String} options.baseUrl - The URL with the account domain
   * @param  {String} options.accessToken.appId - The App Id
   * @param  {String} options.accessToken.appKey - The App Key
   */
  constructor(options) {
    let { automaticSigning } = options;
    if (typeof automaticSigning !== 'boolean') {
      automaticSigning = true;
    }

    this.options = {
      baseUrl: options.baseUrl,
      accessToken: {
        appId: options.accessToken.appId,
        appKey: options.accessToken.appKey,
      },
      automaticSigning: automaticSigning,
    };

    this.apiInfo = new ApiInfo(this.options);
    this.chains = new Chains(this.options);
    this.identities = new Identities(this.options);
    this.receipts = new Receipts(this.options);
    this.anchors = new Anchors(this.options);
    this.utils = Utils;
  }
}
