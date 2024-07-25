const app = getApp()
import {
  virtuallyRecordApi
}
from '../../api/task';
import {
  getBlockPrizeApi
}
from '../../api/app';
import {

  getDefaultAddressApi
}
from '../../api/blockPrize';
import {
  getDigitalCollectiblesListApi,
  getDigitalCollectiblesExchangeApi,
  getDigitalSeriesListApi,
  getNftBannerApi
}
from '../../api/digitalCollectibles';
import {
  getPromotionGoodsListAPi,
  getPromotionGoodsExchangeApi
}
from '../../api/promotionGoods';
import {
  getVirtuallyGoodsListApi,
  virtuallyGoodsExchangeApi
}
from '../../api/virtuallyGoods';

import {
  appletShareFriendApi,
}
from '../../api/task';
Page({
  data: {
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
    newpeople: false,
    // 区块大奖！！！！！！！！！！
    show_rule: false,
    blockPrizeList: [],
    activityrule: '',
    ruleImage: '',
    top: '',
    noblockPrizeList: false,



    // 数字藏品！！！！！！！！！！
    autoplay: true, //是否自动切换
    interval: 3500, //切换时间间隔
    duration: 1000, //滑动动画时长
    nftBannerList: [],
    digitalSeriesList: [],
    newArr: [],
    digitalCollectiblesList: [],
    bigCardImage: 'https://image.kmeta.world/admin/0/market/digitalCollectibles/20240109/f8b6e68fb05244d08fe384ff73df4137.webp',

    nft_name: 'KIRA',
    nft_synopsis: 'Kmeta元宇宙首发',
    nft_score: '',
    nft_state: '',
    nft_tags: [],
    nft_labels: null,
    nft_id: '',
    nft_cardImage: 'https://image.kmeta.world/admin/0/virtualAvatar/20231228/3920f540f40f4f078522bfe45b616c19.webp',
    show_nftcard: true,
    show_bigNFTImg: false,
    selectedItemIndex: 0, // 选中的项的索引，默认为-1表示未选中任何项

    // 促销兑换！！！！！！！！！！
    promotionGoodsList: [],
    promotionGoodsId: '',
    show_goodscard_map: {}, // 记录每个商品是否显示详细信息的对象
    address: '', //详细地址
    addressId: '',
    goodSate: '',
    exchangeOk: false,

    // 虚拟商品！！！！！！！！！
    virtuallyGoodsList: [],
    virtually_id: '',
    ownVirtuallyId: '',
    virtually_inventory: '',
    virtually_goodsScore: '',
    virtually_goodsPicture: '',
    virtually_goodsName: '',
    allVirtuallyGoodsList: [],
    show_virtually_info: false,
    virtuallyGoodsState: '',
    novirtuallyGoodsList: false
  },

  onLoad(options) {
    const accountInfo = wx.getAccountInfoSync(); // develop  	开发版 
    console.log(accountInfo.miniProgram.envVersion,'accountInfo');
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
        name: '11'
      },
      {
        name: ''
      },
      {
        name: '虚拟商品'
      },
    ]
    this.setData({
      sortList
    })
    }

    wx.showLoading({
      title: '加载中',
      mask: true // 是否显示透明蒙层，防止触摸穿透
    });
    setTimeout(() => {
      wx.hideLoading();
      this.watchHeight();
    }, 1000);
    // 获取参数
    const newpeople = options.newpeople;
    const select = options.select;
    console.log(select, 'select');

    if (select == 1) {
      console.log(select, 'select');
      this.setData({
        select: 1
      })
    }
    if (select == 2) {
      console.log(select, 'select');
      this.setData({
        select: 2
      })
    }
    if (select == 3) {
      console.log(select, 'select');
      this.setData({
        select: 3
      })
    }
    this.setData({
      newpeople,
    })

    this.getBlockPrize()
    // this.getDigitalCollectiblesList()
    this.getDigitalSeriesList()
    this.getNftBanner()
    this.getPromotionGoodsList()
    this.getVirtuallyGoodsList()
    // this.getownvirtuallyList()
    this.getDefaultAddress()

  },
  onShow() {
    let ownVirtuallyId = wx.getStorageSync('ownVirtuallyId')
    const address = app.globalData.address;
    this.setData({
      address,
      ownVirtuallyId
    })
    // this.getBlockPrize()
    // this.getDigitalCollectiblesList()
    // this.getPromotionGoodsList()
    // this.getVirtuallyGoodsList()
    // this.getDefaultAddress()
  },
  newpeople_close() {
    this.setData({
      newpeople: false
    })
  },
  goHome() {
    this.setData({
      newpeople: false
    })
    wx.navigateTo({
      url: '/pages/home/home',
    })
  },
  
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
      console.log(res, 'res');
      this.setData({
        height: parseInt(res.height) + 50
      })
      console.log(this.data.height,'height');
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

  // onReachBottom: function () {
  //   var list = this.data.placeList
  //   list.push(1, 2, 3, 4)
  //   this.setData({
  //     placeList: list
  //   })
  //   this.watchHeight()
  // },

  /**
   * 区块大奖！！！！！！！！！！！！！
   */
  goTask() {
    wx.navigateTo({
      url: '/pages/task/task',
    })
  },
  hiderule: function () {
    this.setData({
      show_rule: false,
    });
  },
  showrule: function (e) {
    console.log(e, 'rulr');
    let {
      activityrule,
      ruleimage
    } = e.currentTarget.dataset
    console.log(ruleimage, 'ruleimage');
    // let top = e.detail.y*1.7+30
    this.setData({
      show_rule: true,
      activityRule: activityrule,
      ruleImage: ruleimage
      // top
    });
  },

  /**  区块大奖列表 */
  async getBlockPrize() {

    const blockPrizeList = await getBlockPrizeApi();
    this.setData({
      blockPrizeList
    })
    let noblockPrizeList = blockPrizeList.length == 0 ? 'true' : false
    this.setData({
      blockPrizeList,
      noblockPrizeList
    })
    this.watchHeight()
  },

  // 跳转解密
  goDecrypt(e) {
    let id = e.currentTarget.dataset.id; // 获取携带的id参数
    let state = e.currentTarget.dataset.state; // 获取携带的state参数
    wx.navigateTo({
      url: '/pages/decrypt/decrypt?id=' + id + '&state=' + state // 页面跳转，并携带参数
    });
  },
  // 跳转区块大奖
  goBlockPrize(e) {
    let id = e.currentTarget.dataset.id; // 获取携带的id参数
    let state = e.currentTarget.dataset.state; // 获取携带的state参数
    let bizTime = e.currentTarget.dataset.biztime; // 获取携带的state参数
    wx.navigateTo({
      url: '/pages/blockPrize/blockPrize?id=' + id + '&state=' + state + '&bizTime=' + bizTime // 页面跳转，并携带参数
    });
  },



  /**
   * 数字藏品！！！！！！！！！！！！！
   */

  async getDigitalSeriesList() {
    let digitalSeriesList = await getDigitalSeriesListApi();
    //   // 复制 digitalSeriesList 的内容
    // let copiedDigitalSeriesList = digitalSeriesList.slice();

    // // 合并两个数组
    // let mergedArray = copiedDigitalSeriesList.concat(digitalSeriesList);
    // digitalSeriesList = [...mergedArray]
    // 使用 reduce 方法处理数组
    let newArr = digitalSeriesList.reduce((acc, curr, index) => {
      // 每次循环取出两个对象
      if (index % 2 === 0) {
        acc.push({
          series1: curr
        });
      } else {
        acc[acc.length - 1]['series2'] = curr;
      }
      return acc;
    }, []);

    // 如果最后只有一个对象，则将其作为新对象的一个属性
    if (digitalSeriesList.length % 2 !== 0) {
      newArr[newArr.length - 1] = {
        series2: newArr[newArr.length - 1]['series1']
      };
    }
    console.log(newArr, 'console.log(newArr);');

    this.setData({
      digitalSeriesList,
      newArr
    })
  },
  async getNftBanner() {
    let nftBannerList = await getNftBannerApi();
    this.setData({
      nftBannerList
    })
  },
  navigateToNftPage(event) {
    const nftseriesid = event.currentTarget.dataset.id;
    console.log(nftseriesid,'nftseriesid');
    wx.navigateTo({
      url: '/pages/nft/nft?nftseriesid=' + nftseriesid,
    });
  },


  // 滚动到底部时触发加载更多数据
  loadMoreData: function () {
    if (this.data.select == 1 && this.data.digitalCollectiblesList.length != 0) {
      // 触底加载下一页
      let nft_id = this.data.digitalCollectiblesList[this.data.digitalCollectiblesList.length - 1].id
      this.setData({
        nft_id
      })
      this.getDigitalCollectiblesList();
    }
  },
  async getDigitalCollectiblesList() {
    // 加载中，显示加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true // 是否显示透明蒙层，防止触摸穿透
    });

    let nft_id = this.data.nft_id
    let digitalCollectiblesList = this.data.digitalCollectiblesList
    const res = await getDigitalCollectiblesListApi(nft_id, 30);
    digitalCollectiblesList = [...digitalCollectiblesList, ...res]
    this.setData({
      digitalCollectiblesList,

    })
    if (this.data.digitalCollectiblesList.length != 0 && !this.data.exchangeOk) {

      // 从 digitalCollectiblesList 数组中取出第一个元素
      const {
        collectiblesName,
        synopsis,
        displayImage,
        score,
        state,
        tags,
        id,
        cardImage,
        labels
      } = this.data.digitalCollectiblesList[0];
      this.setData({
        nft_synopsis: synopsis,
        nft_name: collectiblesName,
        bigCardImage: displayImage,
        nft_cardImage: cardImage,
        nft_score: score,
        nft_state: state,
        nft_tags: tags,
        nft_labels: labels,
        nft_id: id,
        // show_nftcard: true
      })
    }

    // 请求成功，隐藏 loading
    wx.hideLoading();
    this.watchHeight()


  },

  async digitalCollectiblesExchange() {
    await getDigitalCollectiblesExchangeApi({
      id: this.data.nft_id
    });
    // 请求成功后提示抢兑成功
    wx.showToast({
      title: '抢兑成功',
      icon: 'success',
      duration: 2000
    });
    let digitalCollectiblesList = this.data.digitalCollectiblesList
    digitalCollectiblesList.forEach(item => {
      // 如果找到了 id 为 this.data.nft_id 的对象
      if (item.id === this.data.nft_id) {
        // 将其 state 属性设置为 3
        item.state = 3;
      }
    })
    this.setData({
      nft_state: 3,
      digitalCollectiblesList
      // exchangeOk:true,
    })


  },
  onReachBottom: function () {

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

      let virtually_id = this.data.allVirtuallyGoodsList[this.data.allVirtuallyGoodsList.length - 1].id
      this.setData({
        virtually_id
      })
      this.getVirtuallyGoodsList()
    }
  },

  hideNftCard: function () {
    this.setData({
      show_nftcard: true,
    });
  },
  showNftCard: function () {
    this.setData({
      show_nftcard: false,
    });
  },
  hidebigNFTImg: function () {

    this.setData({
      show_bigNFTImg: false,
    });
  },
  showbigNFTImg: function () {
    this.setData({
      show_bigNFTImg: true,
    });
  },
  chooseNft(e) {
    const {
      collectiblesname,
      synopsis,
      displayimage,
      cardimage,
      score,
      state,
      tags,
      id,
      index
    } = e.currentTarget.dataset;
    this.setData({
      nft_synopsis: synopsis,
      nft_name: collectiblesname,
      bigCardImage: displayimage,
      nft_cardImage: cardimage,
      nft_score: score,
      nft_state: state,
      nft_tags: tags,
      nft_id: id
    })
    this.hideNftCard()
    if (this.data.selectedItemIndex === index) {
      // 点击已选中的项，取消选中状态
      this.setData({
        selectedItemIndex: -1,
      });
    } else {
      // 点击未选中的项，选中并放大
      this.setData({
        selectedItemIndex: index,
      });
    }
  },



  /**
   * 促销兑换！！！！！！！！！！！！！
   */
  async getPromotionGoodsList() {
    let promotionGoodsId = this.data.promotionGoodsId
    let promotionGoodsList = this.data.promotionGoodsList
    const res = await getPromotionGoodsListAPi(promotionGoodsId, 8);
    promotionGoodsList = [...promotionGoodsList, ...res]
    this.setData({
      promotionGoodsList
    })
    this.watchHeight()
  },

  async promotionGoodsExchange(e) {
    const {
      id
    } = e.currentTarget.dataset;
    await getPromotionGoodsExchangeApi({
      addressId: this.data.addressId,
      goodsId: id
    });
    // this.hide_goodscard()
    // 请求成功后提示抢兑成功
    wx.showToast({
      title: '兑换成功',
      icon: 'success',
      duration: 2000
    });
    let promotionGoodsId = this.data.promotionGoodsList[this.data.promotionGoodsList.length - 1].id
    this.setData({
      promotionGoodsId
    })
    this.getPromotionGoodsList()
  },
  /**  跳转到地址页面*/
  goToAddressPage() {
    wx.navigateTo({
      url: '/pages/address/address',
    });
  },
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
    app.globalData.address = this.data.address;
    app.globalData.addressId = this.data.addressId;
    wx.setStorageSync('address', this.data.address); // 优点：持久 缺点：读写速度慢
    wx.setStorageSync('addressId', this.data.addressId); // 优点：持久 缺点：读写速度慢
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
    console.log(this.data.virtually_id, 'virtually_id');

    let virtuallyGoodsList = this.data.virtuallyGoodsList
    let allVirtuallyGoodsList = this.data.allVirtuallyGoodsList

    const res = await getVirtuallyGoodsListApi(virtually_id, 8);

    if (res.length != 0) {
      allVirtuallyGoodsList = [...allVirtuallyGoodsList, ...res]

      this.setData({
        allVirtuallyGoodsList,
        novirtuallyGoodsList: false
      })
    } else {
      this.setData({
        novirtuallyGoodsList: true
      })
    }
    console.log(this.data.allVirtuallyGoodsList, 'allVirtuallyGoodsList');
    // 假设 goodsArray 是包含所有商品对象的数组
    const virtuallyResList = res
      .filter(item => item.goodsType === 'virtualAvatar') // 过滤出 goodsType 为 virtualAvatar 的对象
      .flatMap(item => item.goodsList); // 提取每个对象的 goodsList 数组并合并成一个数组

    virtuallyGoodsList = [...virtuallyGoodsList, ...virtuallyResList]
    this.setData({
      virtuallyGoodsList
    })
    // 请求成功，隐藏 loading
    wx.hideLoading();
    this.watchHeight()
    console.log(this.data.virtuallyGoodsList, 'virtuallyGoodsList');

  },
  show_virtually_info: function () {
    this.setData({
      show_virtually_info: true,
    });

  },
  hide_virtually_info: function () {

    this.setData({
      show_virtually_info: false,
    });
  },


  async virtuallyGoodsExchange(e) {
    const {
      id
    } = e.currentTarget.dataset;

    await virtuallyGoodsExchangeApi({
      addressId: this.data.addressId,
      goodsId: id,
      ownVirtuallyId: id
    });
    wx.setStorageSync('ownVirtuallyId', id)
    let virtuallyGoodsList = this.data.virtuallyGoodsList
    // 找到id为id1的元素
    virtuallyGoodsList.forEach(item => {
      item.state = 2;
    });;

    // 请求成功后提示抢兑成功
    wx.showToast({
      title: '抢兑成功',
      icon: 'success',
      duration: 2000
    });
    this.setData({
      virtuallyGoodsList
    })
    // this.getVirtuallyGoodsList()
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

  async appletShareFriend(data) {
    await appletShareFriendApi(data);
  },
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

})