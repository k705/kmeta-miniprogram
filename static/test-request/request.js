/**测试环境 */ 

/**
 * 封装请求函数模块
 */
import {
  loginApi
} from '../api/user';
let system = ''; // 操作系统版本
let model = ''; // 机型
/**设备号  deviceId(原始字符串)
 手机品牌厂商  deviceBrand  (例：xiaomi、iphon、huawei)
 机型 deviceModel(例：iPhone 12、xiaomi 10)
 操作系统 operatingSystem (例：Android 10)
 os版本 osVersion (例：Harmony4.0) */
wx.getSystemInfo({
  success: function (res) {
    // console.log(res);
    // 在res中可以获取到设备信息
    system = res.system; // 操作系统版本
    model = res.model; // 操作系统版本

    // ... 其他设备信息
  }
});
// 测试环境
const baseUrl = 'https://apitest.kmeta.world/customer-api';
// 正式
// const baseUrl = 'https://api.kmeta.world/customer-api';
const CryptoJS = require('crypto-js');
const app = getApp();
// 加密生成请求头
/**测试 */
//  appId：应用ID（由后端分配，应用固定）
const appId = '39287461023985'
//   appSecret：应用密钥（由后端分配，应用固定）
const appSecret = 'a7Bh9C4jP2kL0mX8nQ6rY3sU1tW5zF7v'


/**生产 */
//  appId：应用ID（由后端分配，应用固定）
// const appId = '2345678901234567'
// //   appSecret：应用密钥（由后端分配，应用固定）
// const appSecret = 'A9lB3dZ7cX0tW5o8vR1yP2sM4uN6jFq'
// requestAgent: 客户端 0-ios 1-安卓 2-小程序
const requestAgent = '2'
// version：版本号
const version = '1.1.4'


//requestId：请求ID(唯一)随机字符串
function randomString(length) {
  const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let requestId = '';
  for (let i = 0; i < length; i++) {
    let id = Math.floor(Math.random() * str.length);
    requestId += str[id];
  }
  return requestId;
}

function genSign(timestamp, requestId) {
  // customerId：用户ID
  let customerId = app.globalData.customerId
  // sign：签名
  // HMAC-SHA256 加密 earlySign
  let content = appId + customerId;
  let encryptedEarlySign = CryptoJS.HmacSHA256(content, appSecret).toString().toUpperCase();
  // console.log('encryptedEarlySign:', encryptedEarlySign);

  // MD5 加密 finalSign
  let combinedContent = encryptedEarlySign + requestId + timestamp;
  let sign = CryptoJS.MD5(combinedContent).toString();
  // console.log('sign:', sign);
  return sign;
}


// 设置请求超时时间
const timeoutDuration = 300; // 单位：毫秒
function request(url, data = {}, method = 'GET') {
  // requestId：请求ID(唯一)
  let requestId = randomString(20)
  // timestamp：时间戳（秒）
  let timestamp = (Math.floor((new Date().getTime()) / 1000)).toString();
  let sign = genSign(timestamp, requestId);
  // customerId：用户ID
  let customerId = app.globalData.customerId
  let operatingSystem = system
  let deviceModel = model
  // if(!customerId){
  //   wx.redirectTo({
  //     url: '/pages/home/home', // 此处路径根据实际情况填写
  //   });
  //   return
  // }
  //  accessToken：用户登录token
  let accessToken = app.globalData.accessToken;
  return new Promise((resolve, reject) => {
    // wx.showLoading({
    //   title: '加载中...',
    //   mask: true // 是否显示透明蒙层，防止触摸穿透
    // });  
    // 设置超时定时器
    const timeoutTimer = setTimeout(() => {
      // 请求超时，显示 loading
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
    }, 300);
    wx.request({
      url: baseUrl + url,
      method,
      data,
      header: {
        customerId,
        requestId,
        timestamp,
        appId,
        accessToken,
        requestAgent,
        version,
        sign,
        operatingSystem,
        deviceModel
      },
      success(res) {
        /*
          res:
            cookies 放cookie
            data 请求成功的数据（响应体数据）
              code 功能状态码
              data 成功的数据
              message 失败的原因
            errMsg 失败信息
            header 响应头
            statusCode 响应状态码
        */
        // 请求成功，隐藏 loading
        wx.hideLoading();
        clearTimeout(timeoutTimer);
        // 处理请求成功的数据
        // console.log(res.data);
        if (res.statusCode >= 200) {
          // 请求成功
          if (res.data.code === 200) {
            // 功能成功
            resolve(res.data.data);
          } else if (res.data.code === 601 || res.data.code === 607) {
            wx.redirectTo({
              url: '/pages/home/home', // 此处路径根据实际情况填写
            });
          } else {
            // 功能失败
            wx.showToast({
              title: res.data.message,
              icon: 'error'
            })
            reject(res.data.message);
          }
        } else {
          // 请求失败

          wx.showToast({
            title: res.data.error,
            icon: 'error'
          })
          reject(res.data.error);
        }
      },
      fail(err) {
        // 服务器没有在规定内返回响应，就会进入fail
        // console.log('fail', err.errMsg);
        wx.showToast({
          title: err.errMsg,
          icon: 'error'
        })
        reject(err.errMsg);
      },
      complete: function () {
        // 清除超时定时器
        clearTimeout(timeoutTimer);
      }
    })
  })
};

export default request;