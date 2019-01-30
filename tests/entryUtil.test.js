/* eslint-env jest */
import axios from 'axios';
import ApiCall from '../lib/api';
import EntryUtil from '../lib/utils/entryUtil';

jest.mock('axios');
describe('ENTRY UTIL Test', () => {
  describe('Entry Info', () => {
    let apiCall;
    beforeAll(() => {
      apiCall = new ApiCall({
        baseURL: 'https://apicast.io',
        accessToken: {
          appId: '123456',
          appKey: '123456789',
        },
      });
    });
    it('should return error message when chain id is missing', async () => {
      try {
        await EntryUtil.entryInfo();
      } catch (error) {
        expect(error).toEqual(new Error('chain id is required.'));
      }
    });
    it('should return error message when entry hash is missing', async () => {
      try {
        await EntryUtil.entryInfo({ chainId: '123456' });
      } catch (error) {
        expect(error).toEqual(new Error('entry hash is required.'));
      }
    });
    it('should return entry info successfully', async () => {
      const resp = {
        status: 200,
        data: {
          chain_id: '123456',
        },
      };
      axios.mockImplementationOnce(() => Promise.resolve(resp));
      const response = await EntryUtil.entryInfo({ chainId: '123456', entryHash: 'sha256', apiCall: apiCall });
      expect(axios).toHaveBeenCalledWith('https://apicast.io/chains/123456/entries/sha256', { data: '', headers: { 'Content-Type': 'application/json', app_id: '123456', app_key: '123456789' }, method: 'GET' });
      expect(response).toEqual({ chain_id: '123456' });
    });
  });
  describe('Create An Entry', () => {
    let apiCall;
    beforeAll(() => {
      apiCall = new ApiCall({
        baseURL: 'https://apicast.io',
        accessToken: {
          appId: '123456',
          appKey: '123456789',
        },
      });
    });
    it('should return error message when chain id is missing', async () => {
      try {
        await EntryUtil.createAnEntry();
      } catch (error) {
        expect(error).toEqual(new Error('chain id is required.'));
      }
    });
    it('should return error message when external ids is missing', async () => {
      try {
        const data = {
          chainId: '123456',
        };

        await EntryUtil.createAnEntry(data);
      } catch (error) {
        expect(error).toEqual(new Error('external ids is a required array.'));
      }
    });
    it('should return error message when content is missing', async () => {
      try {
        const data = {
          chainId: '123456',
          externalIds: ['1'],
        };

        await EntryUtil.createAnEntry(data);
      } catch (error) {
        expect(error).toEqual(new Error('content is required.'));
      }
    });
    it('should return error message when callback url is invalid', async () => {
      try {
        const data = {
          chainId: '123456',
          externalIds: ['1'],
          content: '123',
          callbackUrl: 'callback.com',
        };

        await EntryUtil.createAnEntry(data);
      } catch (error) {
        expect(error).toEqual(new Error('invalid url: missing URL scheme.'));
      }
    });
    it('should return error message when callback stages is not array', async () => {
      try {
        const data = {
          chainId: '123456',
          externalIds: ['1'],
          content: '123',
          callbackUrl: 'http://callback.com',
          callbackStages: '123',
        };

        await EntryUtil.createAnEntry(data);
      } catch (error) {
        expect(error).toEqual(new Error('callback stages must be in array format.'));
      }
    });
    it('should create an entry successfully', async () => {
      const data = {
        chainId: '123456',
        externalIds: ['1'],
        content: '123',
        callbackUrl: 'http://callback.com',
        callbackStages: ['factom', 'replicated'],
        apiCall: apiCall,
      };

      const resp = {
        status: 200,
        data: {
          entry_hash: '123456',
        },
      };

      const dataPostAPI = {
        external_ids: [
          Buffer.from('1').toString('base64'),
        ],
        content: Buffer.from('123').toString('base64'),
        callback_url: 'http://callback.com',
        callback_stages: [
          'factom',
          'replicated',
        ],
      };

      axios.mockImplementationOnce(() => Promise.resolve(resp));
      const response = await EntryUtil.createAnEntry(data);
      expect(axios).toHaveBeenCalledWith('https://apicast.io/chains/123456/entries', { data: dataPostAPI, headers: { 'Content-Type': 'application/json', app_id: '123456', app_key: '123456789' }, method: 'POST' });
      expect(response).toEqual({ entry_hash: '123456' });
    });
  });
  describe('Create An Signed Entry', () => {
    let apiCall;
    beforeAll(() => {
      apiCall = new ApiCall({
        baseURL: 'https://apicast.io',
        accessToken: {
          appId: '123456',
          appKey: '123456789',
        },
      });
    });
    it('should return error message when chain id is missing', async () => {
      try {
        await EntryUtil.createAnSignedEntry();
      } catch (error) {
        expect(error).toEqual(new Error('chain id is required.'));
      }
    });
    it('should return error message when content is missing', async () => {
      try {
        const data = {
          chainId: '123456',
          externalIds: ['1'],
        };

        await EntryUtil.createAnSignedEntry(data);
      } catch (error) {
        expect(error).toEqual(new Error('content is required.'));
      }
    });
    it('should return error message when private key is missing', async () => {
      try {
        const data = {
          chainId: '123456',
          externalIds: ['1'],
          content: '123',
        };

        await EntryUtil.createAnSignedEntry(data);
      } catch (error) {
        expect(error).toEqual(new Error('private key is required.'));
      }
    });
    it('should return error message when private key is invalid', async () => {
      try {
        const data = {
          chainId: '123456',
          externalIds: ['1'],
          content: '123',
          privateKey: 'idsec',
        };

        await EntryUtil.createAnSignedEntry(data);
      } catch (error) {
        expect(error).toEqual(new Error('private key is invalid.'));
      }
    });
    it('should return error message when signer chain id is missing', async () => {
      try {
        const data = {
          chainId: '123456',
          externalIds: ['1'],
          content: '123',
          privateKey: 'idsec1xQLPp8bDpbaiDiZGiowSgLQ5cpBifJtDSdYX9XAqLrPPxwcvB',
        };

        await EntryUtil.createAnSignedEntry(data);
      } catch (error) {
        expect(error).toEqual(new Error('signer chain id is required.'));
      }
    });
    it('should return error message when callback url is invalid', async () => {
      try {
        const data = {
          chainId: '123456',
          externalIds: ['1'],
          content: '123',
          privateKey: 'idsec1xQLPp8bDpbaiDiZGiowSgLQ5cpBifJtDSdYX9XAqLrPPxwcvB',
          signerChainId: '12345',
          callbackUrl: 'callback.com',
        };

        await EntryUtil.createAnSignedEntry(data);
      } catch (error) {
        expect(error).toEqual(new Error('invalid url: missing URL scheme.'));
      }
    });
    it('should return error message when callback stages is not array', async () => {
      try {
        const data = {
          chainId: '123456',
          externalIds: ['1'],
          content: '123',
          privateKey: 'idsec1xQLPp8bDpbaiDiZGiowSgLQ5cpBifJtDSdYX9XAqLrPPxwcvB',
          signerChainId: '12345',
          callbackUrl: 'http://callback.com',
          callbackStages: 'factom',
        };

        await EntryUtil.createAnSignedEntry(data);
      } catch (error) {
        expect(error).toEqual(new Error('callback stages must be in array format.'));
      }
    });
    it('should return error message when external ids is not array', async () => {
      try {
        const data = {
          chainId: '123456',
          externalIds: '1',
          content: '123',
          privateKey: 'idsec1xQLPp8bDpbaiDiZGiowSgLQ5cpBifJtDSdYX9XAqLrPPxwcvB',
          signerChainId: '12345',
          callbackUrl: 'http://callback.com',
        };

        await EntryUtil.createAnSignedEntry(data);
      } catch (error) {
        expect(error).toEqual(new Error('external ids is a required array.'));
      }
    });
    it('should create an signed entry successfully', async () => {
      const data = {
        chainId: '123456',
        content: '123',
        privateKey: 'idsec1xQLPp8bDpbaiDiZGiowSgLQ5cpBifJtDSdYX9XAqLrPPxwcvB',
        signerChainId: '12345',
        callbackUrl: 'http://callback.com',
        callbackStages: ['factom', 'replicated'],
        apiCall: apiCall,
      };

      const resp = {
        status: 200,
        data: {
          entry_hash: '123456',
        },
      };

      axios.mockImplementationOnce(() => Promise.resolve(resp));
      const response = await EntryUtil.createAnSignedEntry(data);
      expect(response).toEqual({ entry_hash: '123456' });
    });
  });
  describe('Get Entries', () => {
    let apiCall;
    beforeAll(() => {
      apiCall = new ApiCall({
        baseURL: 'https://apicast.io',
        accessToken: {
          appId: '123456',
          appKey: '123456789',
        },
      });
    });
    it('should return error message when chain id is missing', async () => {
      try {
        await EntryUtil.getEntries();
      } catch (error) {
        expect(error).toEqual(new Error('chain id is required.'));
      }
    });
    it('should return error message when limit is not number', async () => {
      try {
        const data = {
          chainId: '123456',
          limit: '15',
        };
        await EntryUtil.getEntries(data);
      } catch (error) {
        expect(error).toEqual(new Error('limit must be number.'));
      }
    });
    it('should return error message when offset is not number', async () => {
      try {
        const data = {
          chainId: '123456',
          limit: 15,
          offset: '1',
        };
        await EntryUtil.getEntries(data);
      } catch (error) {
        expect(error).toEqual(new Error('offset must be number.'));
      }
    });
    it('should return error message when stages is not array', async () => {
      try {
        await EntryUtil.getEntries({ chainId: '123456', stages: '123' });
      } catch (error) {
        expect(error).toEqual(new Error('stages must be in array format.'));
      }
    });
    it('should return entries info successfully', async () => {
      const data = {
        chainId: '123456',
        limit: 1,
        offset: 1,
        apiCall: apiCall,
      };

      const resp = {
        status: 200,
        data: {
          chain_id: '123456',
        },
      };
      axios.mockImplementationOnce(() => Promise.resolve(resp));
      const response = await EntryUtil.getEntries(data);
      expect(axios).toHaveBeenCalledWith('https://apicast.io/chains/123456/entries?limit=1&offset=1', { data: '', headers: { 'Content-Type': 'application/json', app_id: '123456', app_key: '123456789' }, method: 'GET' });
      expect(response).toEqual({ chain_id: '123456' });
    });
  });
  describe('First Entry', () => {
    let apiCall;
    beforeAll(() => {
      apiCall = new ApiCall({
        baseURL: 'https://apicast.io',
        accessToken: {
          appId: '123456',
          appKey: '123456789',
        },
      });
    });
    it('should return error message when chain id is missing', async () => {
      try {
        await EntryUtil.firstEntry();
      } catch (error) {
        expect(error).toEqual(new Error('chain id is required.'));
      }
    });
    it('should return entries info successfully', async () => {
      const data = {
        chainId: '123456',
        apiCall: apiCall,
      };

      const resp = {
        status: 200,
        data: {
          chain_id: '123456',
        },
      };
      axios.mockImplementationOnce(() => Promise.resolve(resp));
      const response = await EntryUtil.firstEntry(data);
      expect(axios).toHaveBeenCalledWith('https://apicast.io/chains/123456/entries/first', { data: '', headers: { 'Content-Type': 'application/json', app_id: '123456', app_key: '123456789' }, method: 'GET' });
      expect(response).toEqual({ chain_id: '123456' });
    });
  });
  describe('Last Entry', () => {
    let apiCall;
    beforeAll(() => {
      apiCall = new ApiCall({
        baseURL: 'https://apicast.io',
        accessToken: {
          appId: '123456',
          appKey: '123456789',
        },
      });
    });
    it('should return error message when chain id is missing', async () => {
      try {
        await EntryUtil.lastEntry();
      } catch (error) {
        expect(error).toEqual(new Error('chain id is required.'));
      }
    });
    it('should return entries info successfully', async () => {
      const data = {
        chainId: '123456',
        apiCall: apiCall,
      };

      const resp = {
        status: 200,
        data: {
          chain_id: '123456',
        },
      };
      axios.mockImplementationOnce(() => Promise.resolve(resp));
      const response = await EntryUtil.lastEntry(data);
      expect(axios).toHaveBeenCalledWith('https://apicast.io/chains/123456/entries/last', { data: '', headers: { 'Content-Type': 'application/json', app_id: '123456', app_key: '123456789' }, method: 'GET' });
      expect(response).toEqual({ chain_id: '123456' });
    });
  });
  describe('Search Entries', () => {
    let apiCall;
    beforeAll(() => {
      apiCall = new ApiCall({
        baseURL: 'https://apicast.io',
        accessToken: {
          appId: '123456',
          appKey: '123456789',
        },
      });
    });
    it('should return error message when chain id is missing', async () => {
      try {
        await EntryUtil.searchEntries();
      } catch (error) {
        expect(error).toEqual(new Error('chain id is required.'));
      }
    });
    it('should return error message when external ids is missing', async () => {
      try {
        await EntryUtil.searchEntries({ chainId: '123456' });
      } catch (error) {
        expect(error).toEqual(new Error('external ids is a required array.'));
      }
    });
    it('should return error message when limit is not number', async () => {
      try {
        const data = {
          chainId: '123456',
          externalIds: ['1'],
          limit: '1',
          offset: 1,
        };

        await EntryUtil.searchEntries(data);
      } catch (error) {
        expect(error).toEqual(new Error('limit must be number.'));
      }
    });
    it('should return error message when offset is not number', async () => {
      try {
        const data = {
          chainId: '123456',
          externalIds: ['1'],
          limit: 1,
          offset: '1',
        };

        await EntryUtil.searchEntries(data);
      } catch (error) {
        expect(error).toEqual(new Error('offset must be number.'));
      }
    });
    it('should return entries info successfully', async () => {
      const data = {
        chainId: '123456',
        externalIds: ['1'],
        apiCall: apiCall,
      };

      const dataPostAPI = {
        external_ids: [
          Buffer.from('1').toString('base64'),
        ],
      };

      const resp = {
        status: 200,
        data: {
          chain_id: '123456',
        },
      };
      axios.mockImplementationOnce(() => Promise.resolve(resp));
      const response = await EntryUtil.searchEntries(data);
      expect(axios).toHaveBeenCalledWith('https://apicast.io/chains/123456/entries/search', { data: dataPostAPI, headers: { 'Content-Type': 'application/json', app_id: '123456', app_key: '123456789' }, method: 'POST' });
      expect(response).toEqual({ chain_id: '123456' });
    });
  });
});