/* eslint-env jest */
import KeyCommon from '../lib/utils/keyCommon';

describe('KEY COMMON Test', () => {
  describe('Create Key pair', () => {
    it('should return an object with private and public keys.', () => {
      KeyCommon.createKeyPair();
    });
  });
  describe('Validate Check Sum', () => {
    it('should return false when signer key is missing.', () => {
      expect(KeyCommon.validateCheckSum()).toBe(false);
    });
    it('should return false when signer key bytes length is not equal 41.', () => {
      expect(KeyCommon.validateCheckSum({ signerKey: 'idpub2' })).toBe(false);
    });
    it('should return false when signer key is invalid.', () => {
      expect(KeyCommon.validateCheckSum({ signerKey: 'idpub2TWHFrWrJxVEmbeXnMRWeKBdFp7bEByosS1phV1bH7NS99zH12' })).toBe(false);
    });
    it('should return true.', () => {
      expect(KeyCommon.validateCheckSum({ signerKey: 'idpub2TWHFrWrJxVEmbeXnMRWeKBdFp7bEByosS1phV1bH7NS99zHF9' })).toBe(true);
    });
  });
  describe('Get Invalid Keys', () => {
    it('should return errors array when keys have at least 1 invalid item.', () => {
      const errors = [
        {
          key: '123',
          error: 'key is invalid',
        },
        {
          key: '123',
          error: 'key is invalid',
        },
      ];
      expect(KeyCommon.getInvalidKeys({ signerKeys: ['123', '123'] })).toEqual(errors);
    });
    it('should return empty array when validated.', () => {
      expect(KeyCommon.getInvalidKeys({ signerKeys: ['idpub2FEZg6PwVuDXfsxEMinnqVfgjuNS2GzMSQwJgTdmUFQaoYpTnv', 'idpub1tkTRwxonwCfsvTkk5enWzbZgQSRpWDYtdzPUnq83AgQtecSgc'] })).toEqual([]);
    });
  });
  describe('Get Duplicate Keys', () => {
    it('should return duplicate array when keys have at least 1 duplicate item.', () => {
      const errors = [
        {
          key: '123',
          error: 'key is duplicated, keys must be unique.',
        },
      ];
      expect(KeyCommon.getDuplicateKeys({ signerKeys: ['123', '123'] })).toEqual(errors);
    });
    it('should return empty array', () => {
      expect(KeyCommon.getDuplicateKeys()).toEqual([]);
    });
  });
  describe('Get Key bytes from Key', () => {
    it('should return error message when signer key is invalid.', () => {
      try {
        KeyCommon.getKeyBytesFromKey({ signerKey: '' });
      } catch (error) {
        expect(error).toEqual(new Error('key is invalid.'));
      }
    });
    it('should return key bytes.', () => {
      KeyCommon.validateCheckSum({ signerKey: 'idpub2TWHFrWrJxVEmbeXnMRWeKBdFp7bEByosS1phV1bH7NS99zHF9' });
    });
  });
  describe('Get Public Key from Private Key', () => {
    it('should return error message when private key is invalid.', () => {
      try {
        KeyCommon.getPublicKeyFromPrivateKey();
      } catch (error) {
        expect(error).toEqual(new Error('signerPrivateKey is invalid.'));
      }
    });
    it('should return public key.', () => {
      KeyCommon.getPublicKeyFromPrivateKey({ signerPrivateKey: 'idsec1Xbja4exmHFNgVSsk7VipNi4mwt6BjQFEZFCohs4Y7TzfhHoy6' });
    });
  });
  describe('Sign Content', () => {
    it('should return error message when private key is missing.', () => {
      try {
        KeyCommon.signContent();
      } catch (error) {
        expect(error).toEqual(new Error('signerPrivateKey is required.'));
      }
    });
    it('should return error message when private key is invalid.', () => {
      try {
        KeyCommon.signContent({ signerPrivateKey: 'idsec2' });
      } catch (error) {
        expect(error).toEqual(new Error('signerPrivateKey is invalid.'));
      }
    });
    it('should return error message when message is missing.', () => {
      try {
        KeyCommon.signContent({ signerPrivateKey: 'idsec1Xbja4exmHFNgVSsk7VipNi4mwt6BjQFEZFCohs4Y7TzfhHoy6' });
      } catch (error) {
        expect(error).toEqual(new Error('message is required.'));
      }
    });
    it('should return signature when signed.', () => {
      expect(KeyCommon.signContent({ signerPrivateKey: 'idsec1Xbja4exmHFNgVSsk7VipNi4mwt6BjQFEZFCohs4Y7TzfhHoy6', message: 'Abc' }))
        .toMatch('Z4qvla16B9+gW/IFyng+5Q0njgwT2aRr5kmYMARRbT8+nivUiQO74O/y3MOH42R9cqTdkXkETLDitUO48DviBw==');
    });
  });
  describe('Validating Signature', () => {
    it('should return error message when public key is missing.', () => {
      try {
        KeyCommon.validateSignature();
      } catch (error) {
        expect(error).toEqual(new Error('signerPublicKey is required.'));
      }
    });
    it('should return error message when public key is invalid.', () => {
      try {
        KeyCommon.validateSignature({ signerPublicKey: 'idpub2' });
      } catch (error) {
        expect(error).toEqual(new Error('signerPublicKey is invalid.'));
      }
    });
    it('should return error message when signature is missing.', () => {
      try {
        KeyCommon.validateSignature({ signerPublicKey: 'idpub2TWHFrWrJxVEmbeXnMRWeKBdFp7bEByosS1phV1bH7NS99zHF9' });
      } catch (error) {
        expect(error).toEqual(new Error('signature is required.'));
      }
    });
    it('should return error message when message is missing.', () => {
      try {
        KeyCommon.validateSignature({ signerPublicKey: 'idpub2TWHFrWrJxVEmbeXnMRWeKBdFp7bEByosS1phV1bH7NS99zHF9', signature: 'D+lzNLb88IKXQk2BglvP7o6yK/DNAsO1B9qXdqArvrotTqSCI4Y4d8J8bwbfAyCvJT9tLYj9Ll7grCnyDWVtCg==' });
      } catch (error) {
        expect(error).toEqual(new Error('message is required.'));
      }
    });
    it('should return value when validated.', () => {
      expect(KeyCommon.validateSignature({ signerPublicKey: 'idpub2TWHFrWrJxVEmbeXnMRWeKBdFp7bEByosS1phV1bH7NS99zHF9', signature: 'D+lzNLb88IKXQk2BglvP7o6yK/DNAsO1B9qXdqArvrotTqSCI4Y4d8J8bwbfAyCvJT9tLYj9Ll7grCnyDWVtCg==', message: 'MTcxZTU4NTE0NTFjZTZmMmQ5NzMwYzE1MzdkYTQzNzVmZWI0NDI4NzBkODM1YzU' })).toBe(false);
    });
  });
});
