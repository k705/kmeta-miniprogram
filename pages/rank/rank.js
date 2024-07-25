// pages/rank/rank.js
import {
  getRankListApi
}
from '../../api/rank';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankList: [], // 排行榜列表
    scrollList: [], // 后面列表
    first: {},
    second: {},
    third: {},
    self: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getRankList();

  },
  /**星球 */
  // 发送请求，获取商品列表
  async getRankList() {
    const res = await getRankListApi();

    const rankList = res.rankingList
    const self = res.self
    // 初始化kingList和scrollList
    const first = rankList[0];
    const second = rankList[1];
    const third = rankList[2];
    const scrollList = rankList.slice(3);


    this.setData({
      rankList,
      first,
      second,
      third,
      scrollList,
      self
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
    }
  },
   /**分享朋友圈 */
  //  onShareTimeline: function () {
  //   return {
  //     title: 'K星矿元 ，K分兑大奖！', // 分享标题
  //     path: '/pages/home/home', // 分享的页面路径
  //     // imageUrl: '../../static/share_logo.png', // 分享图片路径
  //     imageUrl: 'https://image.kmeta.world/applet/images/share_logo.png', // 分享图片路径
  //     // query: 'key=value',  // 分享参数，可选
  //   }
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },



})