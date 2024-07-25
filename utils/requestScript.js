const CryptoJS = require('crypto-js');
const JSEncrypt = require('./jsencrypt');
const aesKey = randomString(16);
import { baseUrl } from '../config/request';

const getPk = () => {
  return new Promise(async (resolve) => {
    await wx.request({
      url: `${baseUrl}/kong/requestEncryption/getPublicKey`,
      method: 'GET',
      success: (res) => {
        resolve(res.data.Response.PublicKey);
      },
      fail: (err) => {
        console.log(err);
      },
    });
  });
};

const requeryFn = async (request) => {
  if ('POST' == request.method) {
    let ppk = wx.getStorageSync('publicKey');
    if (!ppk) {
      ppk = await getPk();
      ppk = ppk.replace(/-----BEGIN RSA PUBLIC KEY-----/g, '');
      ppk = ppk.replace(/-----END RSA PUBLIC KEY-----/g, '');
      ppk = ppk.replace(/[\r\n]/g, '');
      wx.setStorageSync('publicKey', ppk);
    }
    // console.log(ppk)
    const JSEncryptor = new JSEncrypt();
    JSEncryptor.setPublicKey(ppk);
    const xSSVSKey = JSEncryptor.encrypt(`${aesKey}:${Math.floor(Date.now() / 1000)}`);
    return {
      data: encrypt(request.data, aesKey),
      header: {
        'X-SSV-SKEY': xSSVSKey,
        ...request.header,
      },
    };
  } else {
    return request;
  }
};
//随机字符串
function randomString(length) {
  const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    let id = Math.floor(Math.random() * str.length);
    result += str[id];
  }
  return result;
}
// 加密
function encrypt(word, keyStr = aesKey) {
  const key = CryptoJS.enc.Utf8.parse(keyStr);
  const data = CryptoJS.enc.Utf8.parse(JSON.stringify(word));
  return CryptoJS.AES.encrypt(data, key, {
    iv: key,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
}

// 解密
function decrypt(word, AESKEY = aesKey) {
  const key = CryptoJS.enc.Utf8.parse(AESKEY);
  const data = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Base64.parse(word));
  return CryptoJS.AES.decrypt(data, key, {
    iv: key,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
}

module.exports = { requeryFn, encrypt, decrypt };
