/*
 * @Author: 陌上寒 moshanghan@gmail.com
 * @Date: 2023-08-09 17:26:00
 * @LastEditTime: 2023-08-23 09:04:43
 * @LastEditors: 陌上寒 moshanghan@gmail.com
 * @Description:
 * @FilePath: /digital-areas-applet/utils/token.js
 * 可以输入预定的版权声明、个性签名、空行等
 */

module.exports = {
  setToken: (val) => {
    wx.setStorageSync('token', val);
  },
  getToken: () => {
    return wx.getStorageSync('token');
  },
};
