import {
  getMyBlockApi,
  blockPrizeDecryptApi

}
from '../../api/decrypt';
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
    select: 0,
    sortList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    myBlock: [],
    blockPrizeId: '', //	大区块id		
    blockState: '', //	大区块状态		状态 1-待开始 2-抢兑中 3-解密待开始 4-解密中 5-已结束	
    secretKey: '', //	密钥		
    id: '', //	每个区块id		
    state: 1, //	每个区块状态 1-待开奖 2-中奖 3-未中奖 4-已失效
    secretKeyArray: [],

    animationList: [],

    win: false,
    isHidden: true,
    imageTempPath: '',

    prizePic: '',
    name: '',
    Wxacode: null,
    customerId: '',
    path: '',
    envVersion: 'trial',
    avatar: '',

    nowin: false,
    lastTapTime: 0,
    disableBtn: false,

    // 滚动
    start: false,
    currentIndex: 0,
    mysecretKeyArray: ['', '', '', '', '', '', '', ''], // 初始化为空字符串
    randomInterval: null,
    displayTime: 2000 // 持续显示时间，单位为毫秒
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad(options) {

    let blockPrizeId = options.id
    // let blockState = options.state
    let blockState = options.state
    this.setData({
      blockPrizeId,
      blockState
    })
    this.getMyBlock()
    // this.getWxacode()

    this.getRankList()

  },

  getCanvas(Wxacode) {

    var posterHeight = 0
    var posterWidth = 0

    this.setData({
      isHidden: false
    });
    const query = wx.createSelectorQuery()
    query.select('#myCanvas')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node
        console.log('canvas', canvas);
        const ctx = canvas.getContext('2d')
        wx.getSystemInfo({
          success: function (res) {
            console.log(res, 'res');
            posterWidth = Math.round(res.screenWidth * 0.77) // 0.68是我的canvas占屏幕宽的百分比
            posterHeight = Math.round(posterWidth * 1800 / 1080) // 1920/1080是UI的宽高比，由此得出需要的canvas高
          },
        })
        const dpr = wx.getSystemInfoSync().pixelRatio
        console.log(dpr, 'dpr');
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(0, 0, posterWidth, posterHeight);
        canvas.width = res[0].width * dpr // 获取宽
        canvas.height = res[0].height * dpr // 获取高
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(0, 0, posterWidth, canvas.height);
        ctx.scale(dpr, dpr)
        wx.showLoading({
          title: '海报生成中...',
          mask: true // 是否显示透明蒙层，防止触摸穿透
        });
        let image = canvas.createImage(); //创建iamge实例
        //  console.log(this.data.prizePic,'this.data.prizePic');
        // image.src = '../../static/11.jpg'; // 引入本地图片
        image.src = this.data.prizePic; // 引入本地图片
        image.onload = function () {
          ctx.drawImage(image, 0, 0, posterWidth, posterHeight); // 背景图
        }

        // 小程序码
        setTimeout(() => {
          let image1 = canvas.createImage(); //创建iamge实例
          console.log(image1, 'image1');
          image1.src = Wxacode; // 引入本地图片
          image1.onload = function () {
            ctx.drawImage(image1, posterWidth / 375 * 302, posterWidth / 375 * 543, 96.79 / dpr, 96.79 / dpr); // 背景图
          }
        }, 2000);

        // 头像
        setTimeout(() => {
          let avatar = canvas.createImage(); //创建iamge实例
          avatar.src = this.data.avatar; // 引入本地图片
          avatar.onload = function () {
            ctx.drawImage(avatar, posterWidth / 375 * 23, posterWidth / 375 * 520, 40 / dpr, 40 / dpr); // 背景图
          }
        }, 2000);

        //  文字
        setTimeout(() => {
          // 在异步操作完成后调用 wx.hideLoading 隐藏加载提示
          wx.hideLoading();
          this.setData({
            // showModal: true,
            // isHidden: !this.data.isHidden
          });
          ctx.font = '15px HarmonyOS_Sans_SC'
          ctx.textAlign = 'left';
          ctx.fillStyle = 'rgba(255, 255, 255, 1)'
          ctx.fillText('你也有机会赢取K区块大奖！', posterWidth / 375 * 20, posterWidth / 375 * 593);
          ctx.fillText('赶紧来试试', posterWidth / 375 * 20, posterWidth / 375 * 570);
          ctx.font = '8px HarmonyOS_Sans_SC_Light'
          ctx.fillText('长按二维码', posterWidth / 375 * 298, posterWidth / 375 * 532);
          ctx.fillText(`${this.data.name}`, posterWidth / 375 * 52, posterWidth / 375 * 534);
        }, 2000);
        //  背景图
        let that = this
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvas: canvas,
            // canvasId: 'firstCanvas',
            fileType: 'png', //图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
            success(res) {
              that.setData({
                imageTempPath: res.tempFilePath,
                // isHidden: false
              });
              // 获得图片临时路径
              console.log(res, '8520');
              setTimeout(()=>{ wx.hideLoading({
                fial: (err) => {}
              })},2000)
            }
          })
        }, 4000);

      })
  },
  onShareImageMenu: function () {
    wx.showLoading({
      title: '图片生成中...',
      mask: true
    });
    setTimeout(() => {
      wx.hideLoading();
      wx.showShareImageMenu({
        path: this.data.imageTempPath,
        success: (res) => {
          console.log(res, 'res');
          wx.showToast({
            title: '成功',
          })
          this.setData({
            isHidden: true
          });
        },
        fail: (res) => {
          console.log(res);
        }
      })
    }, 2000);

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

  // 发送请求，获取商品列表
  async getRankList() {
    const res = await getRankListApi();
    const self = res.self
    const name = self.nickname
    const avatar = self.avatar
    this.setData({
      name,
      avatar
    })
  },
  // 触发tab导航栏
  activeTab(e) {
    var index = e.currentTarget.dataset.index
    let id = e.currentTarget.dataset.id
    let state = e.currentTarget.dataset.state
    let secretKey = e.currentTarget.dataset.secretkey
    let secretKeyArray = secretKey.split(""); // 将字符串分割成字符数组
    this.setData({
      select: index,
      id,
      state,
      secretKey,
      secretKeyArray
    })
  },

  /**  我的区块*/
  async getMyBlock() {

    const myBlock = await getMyBlockApi(this.data.blockPrizeId);
    // 根据状态进行排序
    myBlock.sort((a, b) => {
      if (a.state === 1) {
        return -1; // 待开奖的排在前面
      }
      if (b.state === 1) {
        return 1;
      }
      if (a.state === 2) {
        return -1; // 未中奖的排在前面
      }
      if (b.state === 2) {
        return 1;
      }
      return 0; // 中奖的保持不变
    });
    // if (myBlock.length == 1) {
    let state = myBlock[0].state
    this.setData({
      state
    })
    // }
    const id = myBlock[0].id
    const secretKey = myBlock[0].secretKey
    let secretKeyArray = secretKey.split(""); // 将字符串分割成字符数组
    this.setData({
      myBlock,
      id,
      secretKey,
      secretKeyArray
    })
  },
  throttle(func, delay) {
    let lastCallTime = 0;
    let timeoutId;

    return function (...args) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastCallTime;

      if (!lastCallTime || elapsedTime >= delay) {
        lastCallTime = currentTime;
        func.apply(this, args);
      } else if (!timeoutId) {
        timeoutId = setTimeout(() => {
          lastCallTime = currentTime;
          func.apply(this, args);
          clearTimeout(timeoutId);
          timeoutId = null;
        }, delay - elapsedTime);
      }
    };
  },
  /**  解密区块*/
  async blockPrizeDecrypt() {
    if (this.data.state == '1') {
      let blockPrizeDecrypt = await blockPrizeDecryptApi({
        id: this.data.id
      });
      let nowin = !blockPrizeDecrypt.isWinning
      let win = blockPrizeDecrypt.isWinning
      let prizePic = blockPrizeDecrypt.prizePic

      this.setData({
        state: 1,
        prizePic
      });
      this.startRandom(nowin, win)
    }
  },

  hideisWin: function () {
    this.setData({
      nowin: false,
    });
  },

  hideWin: function () {
    this.setData({
      win: false,
    });
  },
  // 滚动
  startRandom: function (nowin, win) {
    this.setData({
      start: true
    });
    let currentIndex = 0;
    let randomInterval = setInterval(() => {
      let mysecretKeyArray = [...Array(8)].map(() => Math.random().toString(36).substring(2, 3)); // 随机生成 a-z 的字符
      this.setData({
        mysecretKeyArray,
        currentIndex
      });
      currentIndex++;
      if (currentIndex >= this.data.displayTime / 100) { // 持续两秒后停止
        clearInterval(randomInterval);
        // 加载中，显示加载提示
        wx.showLoading({
          title: '开奖中...',
          mask: true // 是否显示透明蒙层，防止触摸穿透
        });
        mysecretKeyArray = this.data.secretKeyArray
        this.setData({
          mysecretKeyArray
        });
        setTimeout(() => {
          this.setData({
            nowin,
            start: false,
            win
          });
          wx.hideLoading();
          this.getMyBlock()
          if (win) {
            this.getWxacode()
          }
        }, 1200); // 1秒后停止滚动并显示 secretKeyArray 的内容
      }
    }, 100); // 每100毫秒更新一次
    this.setData({
      randomInterval
    });
  },

  goTask() {
    wx.navigateTo({
      url: '/pages/task/task',
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
  // onShareTimeline: function () {
  //   return {
  //     title: 'K星矿元 ，K分兑大奖！', // 分享标题
  //     path: '/pages/home/home', // 分享的页面路径
  //     // imageUrl: '../../static/share_logo.png', // 分享图片路径
  //     imageUrl: 'https://image.kmeta.world/applet/images/share_logo.png', // 分享图片路径
  //     // query: 'key=value',  // 分享参数，可选
  //   }
  // },
})