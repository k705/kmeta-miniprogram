// pages/world/world.js
import {
  getBannerListApi,
  getAdInfoApi,
  informationBrowseApi,
  informationListApi
}
from '../../api/world';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // banner
    bannerList: [],
    id: '', //	banner id	string	
    image: '', //	banner图片	string	
    linkUrl: '', //	链接地址	string	
    title: '', //	标题
    navigateUrl: '',

    // 资讯
    noticeList: [],
    noticeId: '', //	动态id	
    createTime: '', //	发布时间	string(date-time)	
    id: '', //	分页id	
    informationLink: '', //	资讯链接	
    thumbnail: '', //	缩略图	
    title: '', //	标题	string

    // 广告位
    adColumn: '', //	广告栏	
    adList1: [], //		array	Ad
    adList2: [], //		array	Ad
    adList3: [], //		array	Ad
    id: '', //	banner id	
    image: '', //	banner图片	
    linkUrl: '', //	链接地址	
    title: '', //	标题	
    displayStyle: '', //	显示样式 1-横屏多个 2-横屏1个 3-横屏两个	integer	
    richestRanking: '', //	最富榜	RichestRanking	RichestRanking
    displayStyle3_avatar: '', //	头像	string	
    displayStyle3_nickname: '', //	昵称	string
    showBackToTop: false, // 控制回到顶部按钮的显示和隐藏
    screenHeight: 0 // 屏幕高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getBannerList()
    this.getInformationList();
    this.getAdInfo()
    const that = this;
    wx.getSystemInfo({
      success(res) {
        // 设置屏幕高度
        that.setData({
          screenHeight: res.windowHeight
        });
      }
    });
  },

  /**banner*/
  async getBannerList() {
    const res = await getBannerListApi();
    let bannerList = this.data.bannerList
    bannerList = [...bannerList, ...res]
    this.setData({
      bannerList,
    })
    console.log(bannerList, 'bannerList');
  },
  goLinkUrl(e) {
    let linkUrl = e.currentTarget.dataset.linkurl
    console.log(e, 'e');
    if (linkUrl != '') {
      this.handleLinkUrl(linkUrl)
    }

  },
  handleLinkUrl(linkUrl) {
    let navigateUrl = ''
    // 根据linkUrl的不同情况进行处理
    switch (linkUrl) {
      case 'kmeta://home-tab?starId=123':
        navigateUrl = '/pages/home/home';
        break;
      case 'kmeta://market-tab':
        navigateUrl = '/pages/goApp/goApp';
        break;
      case 'kmeta://world-tab':
        navigateUrl = '/pages/world/world';
        break;
      case 'kmeta://market-tab?index=1':
        navigateUrl = '/pages/goApp/goApp?select=1';
        break;
      case 'kmeta://market-tab?index=2':
        navigateUrl = '/pages/goApp/goApp?select=2';
        break;
      case 'kmeta://market-tab?index=3':
        navigateUrl = '/pages/goApp/goApp?select=3';
        break;
      case 'kmeta://treasure':
        navigateUrl = '/pages/task/task';
        break;
      case 'kmeta://market':
        navigateUrl = '/pages/goApp/goApp';
        break;
      case 'kmeta://invite':
        navigateUrl = '/pages/invite/invite';
        break;
      case 'kmeta://rank-daily':
        navigateUrl = '/pages/rank/rank';
        break;
      default:
        console.log('Unsupported linkUrl:', linkUrl);
    }
    this.setData({
      navigateUrl
    })
    if (this.data.navigateUrl != '')
      wx.navigateTo({
        url: navigateUrl,
      })
  },

  /**资讯*/
  async informationBrowse(informationid) {
 await informationBrowseApi(informationid);
   
  },
  async getInformationList() {
    let noticeId = this.data.noticeId
    let noticeList = this.data.noticeList
    const res = await informationListApi(noticeId, 10);
    if (res.length == 0) {
      return
    }
    console.log(res, 'res');
    noticeList = [...noticeList, ...res]
    noticeId = noticeList[noticeList.length - 1].id
    this.setData({
      noticeList,
      noticeId,
    })
    console.log(noticeList);
  },

  goInformationLink(e) {
    console.log(e);
    let informationLink = e.currentTarget.dataset.linkurl;
    let informationid = e.currentTarget.dataset.informationid;
    wx.navigateTo({
      url: `/pages/webview/webview?url=${informationLink}&&title=资讯` // 解码
    })
    this.informationBrowse(informationid)
  },
  goHome() {
    wx.navigateTo({
      url: '/pages/home/home',
    })
  },
  /**广告位*/
  async getAdInfo() {
    const res = await getAdInfoApi();
    let adList = res.adList
    let displayStyle3_avatar = res.richestRanking.avatar
    let displayStyle3_nickname = res.richestRanking.nickname
    console.log(displayStyle3_avatar, displayStyle3_nickname);
    let res1 = adList.filter(item => item.displayStyle === 2)[0] ? adList.filter(item => item.displayStyle === 2)[0].adList : []
    let res2 = adList.filter(item => item.displayStyle === 3)[0] ? adList.filter(item => item.displayStyle === 3)[0].adList : []
    let res3 = adList.filter(item => item.displayStyle === 1)[0] ? adList.filter(item => item.displayStyle === 1)[0].adList : []
    console.log(res3, 'res3');
    let adList1 = this.data.adList1
    let adList2 = this.data.adList2
    let adList3 = this.data.adList3
    adList1 = [...adList1, ...res1]
    adList2 = [...adList2, ...res2]
    adList3 = [...adList3, ...res3]
    this.setData({
      adList1,
      adList2,
      adList3,
      displayStyle3_avatar,
      displayStyle3_nickname
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
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 页面卸载时清除定时器
    // clearInterval(this.data.timer);
    console.log('结束计时器');
    // clearInterval(this.data.cosmosTrendsInterval);
  },
  onPageScroll: function (e) {
    // 获取当前滚动距离
    const scrollTop = e.scrollTop;
    // 获取屏幕高度
    const screenHeight = this.data.screenHeight;
    // console.log(scrollTop);
    // console.log(screenHeight);


    // 判断是否超过一屏的高度
    if (scrollTop > (screenHeight / 4.5)) {
      // console.log(this.data.showBackToTop);

      this.setData({
        showBackToTop: true
      });
      // console.log(this.data.showBackToTop,'222');
    } else {
      // console.log(333);
      this.setData({
        showBackToTop: false
      });
    }
  },

  backToTop: function () {
    // 滚动到页面顶部
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  }
})