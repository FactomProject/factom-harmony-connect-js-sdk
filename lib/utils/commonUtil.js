/* eslint-disable no-param-reassign */
export default class CommonUtil {
  static decodeResponse(data = {}) {
    const arrarDecode = ['external_ids', 'content', 'name'];

    arrarDecode.forEach((o) => {
      if (Object.prototype.hasOwnProperty.call(data, o)) {
        if (Array.isArray(data[o])) {
          const decoded = [];
          data[o].forEach((i, index) => {
            if (o === 'external_ids' && (index === 1 || index === 4)) {
              decoded.push(Buffer.from(i, 'base64').toString('hex'));
            } else {
              decoded.push(Buffer.from(i, 'base64').toString('utf-8'));
            }
          });

          data[o] = decoded;
        } else if (typeof data[o] === 'string') {
          data[o] = Buffer.from(data[o], 'base64').toString('utf-8');
        }
      }
    });

    return data;
  }

  static isEmptyString(value) {
    const type = typeof value;
    return (type === 'string' && value.trim() === '') || type !== 'string';
  }
}