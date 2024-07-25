// app.js
App({
  // 小程序全局状态管理方案
  globalData: {
    accessToken: wx.getStorageSync('accessToken') || '',
    customerId: wx.getStorageSync('customerId') || '',
    scene: wx.getStorageSync('scene') || '',
    address: wx.getStorageSync('address') || '',
    addressId: wx.getStorageSync('addressId') || ''
  },

})

