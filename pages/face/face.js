
import {

  getWxacodeApi
}
from '../../api/invite';

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
    name: '',
    showImage: true,
    page: 1,
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
    Wxacode: null,
    isHidden: true, // 初始时元素隐藏
    imageTempPath: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.getInviteRecordsList();
    this.getWxacode()
    this.getRankList();
    // this.getRankList();
    // 在需要显示加载提示的地方调用 wx.showLoading
    wx.showLoading({
      title: '海报生成中...',
      mask: true // 是否显示透明蒙层，防止触摸穿透
    });


    // // 模拟异步操作，比如网络请求
    // setTimeout(() => {
    //   // 在异步操作完成后调用 wx.hideLoading 隐藏加载提示
    //   wx.hideLoading();
    //   this.setData({
    //     showModal: true,
    //     isHidden: !this.data.isHidden
    //   });
    // }, 3000); // 模拟2秒后完成异步操作

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
    if (Wxacode) {
      this.getCanvas(Wxacode)
    }

  },

  getCanvas(Wxacode) {
    const query = wx.createSelectorQuery()
    query.select('#myCanvas')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio
        console.log(dpr, 'dpr');
        canvas.width = res[0].width * dpr // 获取宽
        canvas.height = res[0].height * dpr // 获取高
        ctx.scale(dpr, dpr)
        wx.showLoading({
          title: '海报生成中...',
          mask: true // 是否显示透明蒙层，防止触摸穿透
        });
        let image = canvas.createImage(); //创建iamge实例
        image.src = 'https://image.kmeta.world/applet/images/invite/posterbac.png'; // 引入本地图片
        image.onload = function () {
          ctx.drawImage(image, 0, 0, canvas.width / dpr, canvas.height / dpr); // 背景图
        }

        // 小程序码
        setTimeout(() => {
          let image1 = canvas.createImage(); //创建iamge实例
          image1.src = Wxacode; // 引入本地图片
          image1.onload = function () {
            ctx.drawImage(image1, (canvas.width - 260) / 2 / dpr, (canvas.height - 260) / 1.2 / dpr, 260 / dpr, 260 / dpr); // 背景图
          }
        }, 2000);


        //  文字
        setTimeout(() => {
          // 在异步操作完成后调用 wx.hideLoading 隐藏加载提示
          wx.hideLoading();
          this.setData({
            showModal: true,
            isHidden: !this.data.isHidden
          });
          ctx.font = '15px HarmonyOS_Sans_SC'
          ctx.textAlign = 'left';
          ctx.fillStyle = 'rgba(255, 255, 255, 1)'
          let name = `${this.data.name} 邀请你前往元宇宙K星探索`
          console.log(ctx.measureText(name).width, 'ctx.measureText(name).width');
          ctx.fillText(name, (canvas.width / dpr - ctx.measureText(name).width) / 2, 40);
        }, 2000);
        //  背景图



        let that = this
        setTimeout(() => {
          wx.canvasToTempFilePath({
            // x: 0, //指定的画布区域的左上角横坐标    
            // y: 0, //指定的画布区域的左上角纵坐标    
            // width: 375, //指定的画布区域的宽度
            // height: 589, //指定的画布区域的高度
            // destWidth: 375*dpr, //输出的图片的宽度 
            // destHeight: 589*dpr, //输出的图片的高度 
            canvas: canvas,
            // canvasId: 'firstCanvas',
            fileType: 'jpg', //图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
            success(res) {
              // 获得图片临时路径
              console.log(res, '8520');
              wx.hideLoading({
                fial: (err) => {}
              })
              that.setData({
                imageTempPath: res.tempFilePath
              });
              // that.saveImg(res.tempFilePath)

            }
          })
        }, 4000);

      })
  },
  saveImg() {
    let that = this
    wx.showModal({
      title: '提示', // 标题
      content: '是否保存到相册', // 提示内容
      showCancel: true, // 是否显示取消按钮
      cancelText: '取消', // 取消按钮的文字，默认为"取消"
      cancelColor: '#000000', // 取消按钮的文字颜色，默认为"#000000"
      confirmText: '确定', // 确定按钮的文字，默认为"确定"
      confirmColor: '#3CC51F', // 确定按钮的文字颜色，默认为"#3CC51F"
      success(res) {
        if (res.confirm) {
          // 用户点击了确定按钮，执行相应操作
          // wx.hideLoading()
         
          wx.saveImageToPhotosAlbum({
            filePath: that.data.imageTempPath,
            success: (res) => {
              wx.showToast({
                title: '已保存到相册',
                icon: 'success',
                duration: 2000
              })
            },
            fail: (err) => {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              });
            }
          })
        } else if (res.cancel) {
          // 用户点击了取消按钮，执行相应操作
          console.log('用户点击取消');
        }
      }
    })




  },
  // 发送请求，获取商品列表
  async getRankList() {
    const res = await getRankListApi();
    const self = res.self
    const name = self.nickname
    this.setData({
      name
    })
  },
  onShareAppMessage(options) {
    const inviteId = app.globalData.customerId
    console.log(inviteId, 'inviteId');
    return {
      title: 'K星矿元 ，K分兑大奖！',
      path: '/pages/home/home?scene=' + inviteId,
      imageUrl: 'https://image.kmeta.world/applet/images/coffeeSharePic.png', // 分享图片路径

    }
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