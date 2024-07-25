// pages/rank/rank.js
import {
  getTreasuryListApi,
  getTaskListApi,
  appletShareFriendApi,
  blockPrizeRecordApi,
  digitalCollectiblesRecordApi,
  promotionRecordApi,
  virtuallyRecordApi,
  usedAvatarApi,
  getUsedDetailsApi
}
from '../../api/task';
import {

  getDefaultAddressApi
}
from '../../api/blockPrize';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    treasury: {}, // 财富信息
    usableScore: '',
    usableScoreAmount: '',
    taskList: [], // 任务列表
    taskClassify: '',
    showModal: false,

    /**
     * K宝
     */
    select: 0,
    height: 0,
    sortList: [{
        name: '区块大奖'
      },
      {
        name: '数字藏品'
      },
      {
        name: '促销兑换'
      },
      {
        name: '虚拟商品'
      },
    ],
    placeList: [1, 2, 3, 4],

    // 区块大奖！！！！！！！！！！
    blockPrize_prizeName: '',
    blockPrize_state: '',
    // blockPrize_id: "",
    blockPrize_order_id: "",
    blockPrizeList: [],
    show_coffee_info: false,
    blockId: '',
    tutorials: [],
    everyCode: "",


    // 数字藏品！！！！！！！！！！
    digitalCollectiblesList: [],
    bigCardImage: 'https://image.kmeta.world/admin/0/market/digitalCollectibles/20240109/f8b6e68fb05244d08fe384ff73df4137.webp',

    collectiblesName: '',
    collectors: '',
    createTime: '',
    salesPlatform: '',
    collectiblesCode: '',
    nft_tags: [],
    nft_id: '',
    nft_cardImage: '',
    show_nftcard: true,
    show_bigNFTImg: false,
    isHidden: true,
    
    selectedItemIndex: 0, // 选中的项的索引，默认为-1表示未选中任何项
    show_bigNFTImg: false,
    show_certificate: false,
    // 促销兑换！！！！！！！！！！
    promotionGoodsList: [],
    promotionGoodsId: '',
    show_goodscard_map: {}, // 记录每个商品是否显示详细信息的对象
    address: '', //详细地址
    addressId: '',


    // 虚拟商品！！！！！！！！！
    virtuallyGoodsList: [],
    virtually_id: '',
    virtually_inventory: '',
    virtually_goodsScore: '',
    virtuallyPicture: '',
    virtually_goodsName: '',
    allVirtuallyGoodsList: [],
    show_virtually_info: false,
    virtuallyGoodsState: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const accountInfo = wx.getAccountInfoSync(); // develop  	开发版 
    if(accountInfo.miniProgram.envVersion=='release'){
     let  sortList=[{
        name: '区块大奖'
      },
      {
        name: '数字藏品'
      },
      {
        name: '促销兑换'
      },
      {
        name: '虚拟商品'
      },
    ]
    this.setData({
      sortList
    })
    }else{
      let  sortList=[{
        name: '区块大奖'
      },
      {
        name: ''
      },
      {
        name: '促销兑换'
      },
      {
        name: '虚拟商品'
      },
    ]
    this.setData({
      sortList
    })
    }
    this.getTreasuryList();
    this.getTaskList();

    /**
     * K宝
     */
    this.getBlockPrize()
    this.getDigitalCollectiblesList()
    this.getPromotionGoodsList()
    this.getVirtuallyGoodsList()
    this.getDefaultAddress()
  },
  showKira(options) {
    this.setData({
      showModal: true
    })
    const inviteId = app.globalData.customerId
    // const scene = options.target.dataset.scene
    const scene = 'appletShareCircleOfFriends'


    const data = {
      scene,
      resourceId: inviteId
    }
    this.appletShareFriend(data)
  },
  closeKira() {
    this.setData({
      showModal: false
    })
  },
  goApp() {
    wx.navigateTo({
      url: '/pages/goApp/goApp',
    })
  },
  goSharePost() {
    wx.navigateTo({
      url: '/pages/sharePost/sharePost',
    })
  },
  goLogistics(event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/logistics/logistics?id=' + id,
    })
  },
  goDecrypt(event) {
    const id = event.currentTarget.dataset.id;
    const state = event.currentTarget.dataset.state;
    wx.redirectTo({

      url: '/pages/decrypt/decrypt?id=' + id + '&state=' + state,
    })
  },
  /**分享朋友圈 */
  // onShareTimeline: function () {
  //   return {
  //     title: 'K星矿元 ，K分兑大奖！', // 分享标题
  //     path: '/pages/home/home', // 分享的页面路径
  //     imageUrl: 'https://image.kmeta.world/applet/images/share_logo.png', // 分享图片路径
  //     // query: 'key=value',  // 分享参数，可选
  //   }
  // },


  onShareAppMessage(options) {
    let scene
    if (options.target != undefined) {
      scene = options.target.dataset.scene
    } else {
      scene = 'appletShareFriend'
    }
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


  /**财富信息 */
  // 发送请求，获取财富信息
  async getTreasuryList() {
    const res = await getTreasuryListApi();

    const treasury = res
    const usableScore = treasury.usableScore
    const usableScoreAmount = treasury.usableScoreAmount
    if (usableScore > 99999999) {
      treasury.usableScore = Math.floor(treasury.usableScore / 10000)
    }
    if (usableScoreAmount > 99999999) {
      treasury.usableScoreAmount = Math.floor(treasury.usableScoreAmount / 10000)
    }
    // "usableScore": 0,
    // "usableScoreAmount": 0,
    this.setData({
      treasury,
      usableScore,
      usableScoreAmount
    })
  },
  // 任务
  async getTaskList() {
    const res = await getTaskListApi();
    const taskList = res[0].taskList
    const taskClassify = res[0].taskClassify
    this.setData({
      taskList,
      taskClassify
    })
  },
  navigateToPage: function () {
    wx.navigateTo({
      url: '/pages/invite/invite', // 替换为你要跳转的页面路径
    });
  },

  async appletShareFriend(data) {
    await appletShareFriendApi(data);
  },

  /**
   * K宝
   */

  // 触发tab导航栏
  activeTab(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      select: index
    })
    this.generalEv()
    this.watchHeight()
  },

  // 滑动swiper
  activeSw(e) {
    var index = e.detail.current
    this.setData({
      select: index
    })
    this.generalEv()
    this.watchHeight()
  },

  // 监听swiper高度
  watchHeight() {
    var query = wx.createSelectorQuery()
    query.select('.box').boundingClientRect((res) => {
      this.setData({
        height: parseInt(res.height) + 50
      })
    }).exec()
  },

  // 初始化值
  generalEv() {
    this.setData({
      placeList: [1, 2, 3, 4]
    })
    // 回到顶部
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  onReachBottom: function () {
    if (this.data.select == 0 && this.data.blockPrizeList.length != 0) {
      // 触底加载下一页
      let blockPrize_order_id = this.data.blockPrizeList[this.data.blockPrizeList.length - 1].id
      this.setData({
        blockPrize_order_id
      })
      this.getBlockPrize();
    }
    if (this.data.select == 1 && this.data.digitalCollectiblesList.length != 0) {
      // 触底加载下一页
      let nft_id = this.data.digitalCollectiblesList[this.data.digitalCollectiblesList.length - 1].id
      this.setData({
        nft_id
      })
      this.getDigitalCollectiblesList();
    }
    if (this.data.select == 2 && this.data.promotionGoodsList.length != 0) {
      // 触底加载下一页
      let promotionGoodsId = this.data.promotionGoodsList[this.data.promotionGoodsList.length - 1].id
      this.setData({
        promotionGoodsId
      })
      this.getPromotionGoodsList()
    }
    if (this.data.select == 3 && this.data.virtuallyGoodsList.length != 0) {
      // 触底加载下一页

      let virtually_id = this.data.virtuallyGoodsList[this.data.virtuallyGoodsList.length - 1].id
      this.setData({
        virtually_id
      })
      this.getVirtuallyGoodsList()
    }
  },
  /**  区块大奖 */
  // 区块核销教程
  async getUsedDetails() {
    const res = await getUsedDetailsApi(
      this.data.blockId
    );
    let {
      tutorials,
      usedCode
    } = res
    // const everyCode = usedCode.split("");
    this.setData({
      tutorials,
      everyCode: usedCode
    });
  },
  showCoffeeInfo: function (e) {
    var blockId = e.currentTarget.dataset.id
    this.setData({
      show_coffee_info: true,
      blockId
    });
    this.getUsedDetails()
  },
  hideCoffeeInfo: function () {
    this.setData({
      show_coffee_info: false,
    });
  },
  previewImage: function (event) {
    console.log(event,'event');
    const url = event.currentTarget.dataset.previewimage;
    wx.previewImage({
      current: url,
      urls: [url]
    })
  },
  async getBlockPrize() {
    // 加载中，显示加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true // 是否显示透明蒙层，防止触摸穿透
    });

    let blockPrize_order_id = this.data.blockPrize_order_id
    let blockPrizeList = this.data.blockPrizeList

    const res = await blockPrizeRecordApi(blockPrize_order_id, 8);
    blockPrizeList = [...blockPrizeList, ...res]
    this.setData({
      blockPrizeList
    })
    this.watchHeight()
  },

  isShowPrizeCard: function (e) {
    const {
      index
    } = e.currentTarget.dataset;
    const show_goodscard_map = {
      ...this.data.show_goodscard_map
    }; // 克隆一份对象，避免直接修改原对象
    show_goodscard_map[index] = !show_goodscard_map[index]; // 设置对应商品项的 show_goodscard 为 true
    this.setData({
      show_goodscard_map: show_goodscard_map,
    });
  },
  hide_goodscard: function () {
    this.setData({
      show_goodscard_map: {}, // 清空所有商品的显示状态
    });
  },
  /**
   * 数字藏品！！！！！！！！！！！！！
   */

  async getDigitalCollectiblesList() {
    // 加载中，显示加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true // 是否显示透明蒙层，防止触摸穿透
    });

    let nft_id = this.data.nft_id
    let digitalCollectiblesList = this.data.digitalCollectiblesList


    const res = await digitalCollectiblesRecordApi(nft_id, 8);
    digitalCollectiblesList = [...digitalCollectiblesList, ...res]
    this.setData({
      digitalCollectiblesList,
    })

    // 请求成功，隐藏 loading
    wx.hideLoading();
    this.watchHeight()
  },

  hideNftCard: function () {
    this.setData({
      show_nftcard: false,
    });
  },
  showNftCard: function (e) {

    const {
      id,
      cardimage,
      collectiblesname,
      collectors,
      createtime,
      salesplatform,
      collectiblescode
    } = e.currentTarget.dataset;
    this.setData({
      nft_id: id,
      nft_cardImage: cardimage,
      show_bigNFTImg: true,
      collectiblesName: collectiblesname,
      collectors,
      createTime: createtime,
      salesPlatform: salesplatform,
      collectiblesCode: collectiblescode
    })

  },
  hidebigNFTImg: function () {

    this.setData({
      show_bigNFTImg: false,
    });
  },

  seeNft() {
    this.setData({
      show_certificate: true,
      show_bigNFTImg: false,

    });
  },
  onShareNft() {
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
    
        console.log(res, 'res');
        const canvas = res[0].node
        console.log(canvas, 'canvas');
        const ctx = canvas.getContext('2d')
        // 设置背景为黑色
        
        const dpr = wx.getSystemInfoSync().pixelRatio
        console.log(dpr, 'dpr');
        canvas.width = res[0].width * dpr // 获取宽
        canvas.height = res[0].height * dpr // 获取高
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // canvas.x = res[0].left * dpr // 获取宽
        // canvas.y = res[0].top * dpr // 获取高
        ctx.scale(dpr, dpr)
        wx.showLoading({
          title: '图片生成中...',
          mask: true // 是否显示透明蒙层，防止触摸穿透
        });
         // 加载完成后，延迟两秒后隐藏元素
   
        let image = canvas.createImage(); //创建iamge实例
        image.src = this.data.nft_cardImage; // 引入本地图片
        image.onload = function () {
          ctx.drawImage(image, 0, 0, canvas.width / dpr, canvas.height / dpr); // 背景图
        }
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
            fileType: 'png', //图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
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
              wx.showShareImageMenu({
                path: res.tempFilePath,
                success: (res) => {
                  console.log(res, 'res');
                  wx.showToast({
                    title: '保存成功',
                  })
                  that.setData({
                    isHidden: true
                  });
                }
              })
            }
          })
        }, 4000);

      })
  },
  hidecertificateImg() {
    this.setData({
      show_certificate: false,
    });
  },
  /**
   * 促销兑换！！！！！！！！！！！！！
   */
  /**  获取地址*/
  async getDefaultAddress() {
    let defaultAddress = await getDefaultAddressApi();
    if (defaultAddress != null) {
      let address = defaultAddress.address
      let addressId = defaultAddress.id
      this.setData({
        address,
        addressId
      })
    }
  },
  /**  跳转到地址页面*/
  goToAddressPage() {
    wx.navigateTo({
      url: '/pages/address/address',
    });
  },
  async getPromotionGoodsList() {
    let promotionGoodsId = this.data.promotionGoodsId
    let promotionGoodsList = this.data.promotionGoodsList
    const res = await promotionRecordApi(promotionGoodsId, 8);
    promotionGoodsList = [...promotionGoodsList, ...res]
    this.setData({
      promotionGoodsList
    })
    this.watchHeight()
  },
  show_goodscard: function (e) {
    const {
      index
    } = e.currentTarget.dataset;
    const show_goodscard_map = {
      ...this.data.show_goodscard_map
    }; // 克隆一份对象，避免直接修改原对象
    show_goodscard_map[index] = !show_goodscard_map[index]; // 设置对应商品项的 show_goodscard 为 true
    this.setData({
      show_goodscard_map: show_goodscard_map,
    });
  },
  hide_goodscard: function () {
    this.setData({
      show_goodscard_map: {}, // 清空所有商品的显示状态
    });
  },
  /**
   * 虚拟商品！！！！！！！！！！！！！
   */
  async getVirtuallyGoodsList() {
    // 加载中，显示加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true // 是否显示透明蒙层，防止触摸穿透
    });

    let virtually_id = this.data.virtually_id
    let virtuallyGoodsList = this.data.virtuallyGoodsList

    const res = await virtuallyRecordApi(virtually_id, 8);

    virtuallyGoodsList = [...virtuallyGoodsList, ...res]

    this.setData({
      virtuallyGoodsList
    })

    // 请求成功，隐藏 loading
    wx.hideLoading();
    this.watchHeight()

  },
  showVirtuallyInfo: function (e) {
    var virtuallyPicture = e.currentTarget.dataset.virtuallypicture


    this.setData({
      show_virtually_info: true,
      virtuallyPicture
    });
  },
  hideVirtuallyInfo: function () {
    this.setData({
      show_virtually_info: false,
    });
  },
  // 换头像
  async usedAvatar() {
    await usedAvatarApi({
      avatarLink: this.data.virtuallyPicture
    });
    wx.showToast({
      title: '头像更换成功',
      icon: 'success',
      duration: 2000 // 提示消息持续时间为2秒
    });
    this.hideVirtuallyInfo()
  },


})