// pages/rank/rank.js
// import {
//   getInviteRecordsApi
// }
// from '../../api/invite';
import {
  getInviteRecordsApi,
  getWxacodeApi
}
from '../../api/invite';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newpeople:false
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad(options) {
   
    // 获取参数
    const newpeople = options.newpeople;
   this.setData({
    newpeople
   })
  },
  
 

/**
   * 用户点击右上角分享
   */
  onShareAppMessage(options) {
    const inviteId = app.globalData.customerId
    return {
      title: 'K星矿元 ，K分兑大奖！',
      path: '/pages/home/home?scene=' + inviteId,
      imageUrl: 'https://image.kmeta.world/applet/images/coffeeSharePic.png', // 分享图片路径

    }
  },
   /**分享朋友圈 */
   onShareTimeline: function () {
    return {
      title: 'K星矿元 ，K分兑大奖！', // 分享标题
      path: '/pages/home/home', // 分享的页面路径
      imageUrl: 'https://image.kmeta.world/applet/images/share_logo.png', // 分享图片路径
      // query: 'key=value',  // 分享参数，可选
    }
  },
})