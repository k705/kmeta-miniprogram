// pages/rank/rank.js
// import {
//   getInviteRecordsApi
// }
// from '../../api/invite';
import {
  getInviteRecordsApi,
  getWxacodeApi,
  getInviteNumberdeApi,
  inviteApi
}
from '../../api/invite';
import {

  appletShareFriendApi
}
from '../../api/task';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showImage: true,
    page: 1,
    inviteNumber:0,
    totalPages: 0, // 总页数
    pageSize: 5, //每页条数
    lastId: '', //最后一条id
    recordsList: [], // 邀请列表
    showNoMore: false,
    showNoData: false,
    loading: false,
    showModal: false,
    scrollTop: 0, // 记录滚动位置
    imageUrl: 'https://image.kmeta.world/applet/images/invite/btnbac.png',
    customerId: '',
    path: '',
    envVersion: 'trial',
    scene: '',
    Wxacode: '',
    isHidden: true, // 初始时元素隐藏
    awardedBlockReward: '',	// 已获得区块奖励	
    awardedScoreReward: '',// 	已获得K分奖励
  },

// wxCode(){
//   // 在页面的js文件中引入 wx.request
// const wxRequest = require('path/to/wxRequest');

// // 在页面的js文件中调用微信小程序码接口
// wxRequest({
//   url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
//   method: 'POST',
//   data: {
//     scene: '111',
//     page: 'pages/login/login', // 小程序页面路径，可根据实际情况修改
//     width: 280 // 小程序码的宽度，可根据实际情况修改
//   },
//   success: function (res) {
//     // res.data 包含小程序码的数据，可以显示在页面上或保存为图片
//   },
//   fail: function (err) {
//     console.error(err);
//   }
// });
// },


  
  // downloadImage() {
  //   const imageUrl = this.data.imageUrl;
  //   wx.downloadFile({
  //     url: imageUrl,
  //     success(res) {
  //       if (res.statusCode === 200) {
  //         wx.saveImageToPhotosAlbum({
  //           filePath: res.tempFilePath,
  //           success() {
  //             wx.showToast({
  //               title: '图片保存成功',
  //               icon: 'success',
  //               duration: 2000
  //             });
  //           },
  //           fail() {
  //             wx.showToast({
  //               title: '图片保存失败',
  //               icon: 'none',
  //               duration: 2000
  //             });
  //           }
  //         });
  //       } else {
  //         wx.showToast({
  //           title: '图片下载失败',
  //           icon: 'none',
  //           duration: 2000
  //         });
  //       }
  //     },
  //     fail() {
  //       wx.showToast({
  //         title: '图片下载失败',
  //         icon: 'none',
  //         duration: 2000
  //       });
  //     }
  //   });
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInviteRecordsList();
    this.getInviteNumberde();
    this.getInviteInfo();
    this.getWxacode()
    
  },

  scrollToNextPage: function () {
    wx.pageScrollTo({
      scrollTop: wx.getSystemInfoSync().windowHeight, // 滚动到下一页的位置，这里使用屏幕高度作为示例
      duration: 300, // 滚动动画持续时间，单位为毫秒
      success: () => {
        // 滚动成功后的回调
       
      },
      
    });
    this.setData({
      showImage: false, // 隐藏图片
    });
  },



  showCard() {
    // 在需要显示加载提示的地方调用 wx.showLoading
    wx.showLoading({
      title: '海报生成中...',
      mask: true // 是否显示透明蒙层，防止触摸穿透
    });

    // 模拟异步操作，比如网络请求
    setTimeout(() => {
      // 在异步操作完成后调用 wx.hideLoading 隐藏加载提示
      wx.hideLoading();
      this.setData({
        showModal: true,
        isHidden: !this.data.isHidden
      });
    }, 1000); // 模拟2秒后完成异步操作

  },

  closeCard() {
    this.setData({
      showModal: false,
      isHidden: !this.data.isHidden
    });
  },
  /**邀请记录 */
  // 发送请求，获取邀请记录
  async getInviteRecordsList() {
    const res = await getInviteRecordsApi(this.data.lastId, this.data.pageSize);
    
  
    const recordsList = [...this.data.recordsList, ...res]
    if(recordsList?.length==0){
      this.setData({
        showNoData: true
      });
      return;
    }
    // 获取数组长度
    const arrayLength = res.length;
    const totalPages = recordsList.length;

    // 获取最后一条数据的 id 字段
    const lastId = res[arrayLength - 1]?.id;
    this.setData({
      lastId, //最后一个id
      recordsList,
      totalPages
    })
  },
  navigateToFace() {
    wx.navigateTo({
      url: '/pages/face/face',
    })
  },
  onShareAppMessage(options) {
    let scene = 'appletShareFriend'
    const inviteId = app.globalData.customerId
    const data = {
      scene,
      resourceId: inviteId
    }
    this.appletShareFriend(data)
    return {
      title: 'K星矿元 ，K分兑大奖！',
      path: '/pages/home/home?scene=' + inviteId,
      imageUrl: 'https://image.kmeta.world/applet/images/coffeeSharePic.png', // 分享图片路径
    }
  },
  async appletShareFriend(data) {
    await appletShareFriendApi(data);
    // this.getTreasuryList();
    // this.getTaskList();

  },
  async getInviteNumberde() {
    const inviteNumber = await getInviteNumberdeApi();
    this.setData({
      inviteNumber
    })
  },
  async getInviteInfo() {
    const inviteInfo = await inviteApi();
    let {
      awardedBlockReward,
    awardedScoreReward
    }=inviteInfo
    this.setData({
      awardedBlockReward,
    awardedScoreReward
    })
  },
  async getWxacode() {

    const customerId = app.globalData.customerId
    var scene = customerId; //拼接你要添加的参数
    // let scene = 'code'; //拼接你要添加的参数
    const path = 'pages/home/home'
    this.setData({
      path,
      scene
    })
    const res = await getWxacodeApi(this.data.path, this.data.envVersion, this.data.scene);

    const Wxacode = res
    this.setData({
      Wxacode
    })


  },
  // 上拉加载
  pullUpLoad() {
  
    // 到达总页数的时候，不获取新数据了
    if (this.data.page > this.data.totalPages / this.data.pageSize) {
  
      // 假设到达最后一页，设置 showNoMore 为 true
      this.setData({
        showNoMore: true
      });
      return;
    }
    // 请求下一页数据
    this.setData({
      page: this.data.page + 1
    })
    this.getInviteRecordsList();
  },


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