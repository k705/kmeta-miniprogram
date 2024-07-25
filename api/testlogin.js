/*
 * @Author: hyman
 * @Date: 2022-12-17 16:16:23
 * @LastEditors: 陌上寒 moshanghan@gmail.com
 * @LastEditTime: 2023-08-22 21:37:12
 * @Description: 请填写简介
 */
const { getNetworkType } = require('./tools');
import { loginByOpenId, getUserInfo } from '../api/common';
import { setToken } from './token';

// const {
//   routeTo
// } = getApp();
module.exports = {
  isLogin: () => {
    return new Promise((resolve, reject) => {
      const network = getNetworkType();
      if (network) {
        getUserInfo()
          .then((res) => {
            resolve && resolve(res);
          })
          .catch((err) => {
            console.log('catch: ', err);
            wx.navigateTo({
              url: '../register/index',
            });
          });
      } else {
        reject();
      }
    });
  },
  // jumpLogin: (cb) => {
  //   try {
  //     wx.clearStorageSync()
  //   } catch (e) {
  //   }
  //   const pages = getCurrentPages();
  //   if (!pages[pages.length - 1].route.includes('pagesSys/login/index')) {
  //     wx.navigateTo({
  //       url: "/pagesSys/login/index",
  //       success() {
  //         if (cb) {
  //           cb()
  //         }
  //       }
  //     });
  //   }

  // },
  // 401时尝试一次重新登录
  async loginTry(currentPage) {
    const loginTypFlag = wx.getStorageSync('loginTypFlag');
    if (!loginTypFlag) return false;
    wx.removeStorageSync('loginTypFlag');
    wx.login({
      async success(loginRes) {
        await loginByOpenId({ code: loginRes.code })
          .then(async (res) => {
            if (res.Code === 200) {
              // console.log('currentPage', currentPage)
              setToken(res.Data);
              // if (currentPage.indexOf('pages/index/index') < 0) {
              wx.reLaunch({
                url: '/pages/index/index',
              });
              // }
            } else {
              wx.jumpLogin();
            }
          })
          .catch(() => {
            wx.jumpLogin();
          });
      },
      fail() {
        wx.jumpLogin();
      },
    });
  },
  async loginFn() {
    wx.login({
      async success(loginRes) {
        // console.log(loginRes)
        // getOpenId({ code: loginRes.code }).then(openRes => {
        // if (openRes.Code === 200) {
        await loginByOpenId({ code: loginRes.code })
          .then(async (res) => {
            if (res.Code === 200) {
              setToken(res.Data);
              // await getUserInfo().then(userInfoRes => {
              //   let {
              //     globalData
              //   } = getApp();
              //   globalData.userInfo = userInfoRes.Data
              //   globalData.roles = userInfoRes.Data.roles
              //   // console.log('globalData.userInfo', globalData.userInfo)
              //   // wx.setStorageSync('userInfo', userInfoRes.Data)
              //   const roles = userInfoRes.Data.roles
              //   wx.setStorageSync('roles', roles)
              //   if (roles.length > 1) {
              //     wx.redirectTo({
              //       url: "/pagesSys/selectRole/index",
              //     })
              //   } else if (roles.length === 0) {
              //     wx.showToast({
              //       title: '没有权限',
              //       icon: 'none'
              //     })
              //   } else {
              //     const currentRole = roles[0]
              //     globalData.roleVal = currentRole
              //     wx.setStorageSync('roleVal', currentRole)
              //     wx.redirectTo({
              //       url: "/pages/index/index",
              //     })
              //   }
              // }).catch(err => {
              //   wx.showToast({
              //     title: err.Error.Message,
              //     icon: "none",
              //   });
              // })
            } else {
              wx.jumpLogin();
              // module.exports.jumpLogin()
            }
          })
          .catch((err) => {
            if (err.Code === 500) {
              wx.jumpLogin();
              // module.exports.jumpLogin()
            }
          });
        // }
        // })
      },
    });
  },
};
