import {
  blockPrizeExchangeApi,
  getBlockPrizeDetailsApi,
  saveAddressApi,
  getDefaultAddressApi
}
from '../../api/blockPrize';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    blockPrizeDetails: {},
    inventory: '', //剩余k区块
    address: '', //详细地址
    countdown: "加载中...",
    timer: '',
    bizTime: '',
    count: 0,
    addressId: '',
    array1: [],
    array2: [],
    array3: [],
    array4: [],
    array5: []
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad(options) {
    
    this.getDefaultAddress()
    let blockPrizeId = options.id
    let blockState = options.state
    let bizTime = options.bizTime
    this.setData({
      blockPrizeId,
      blockState,
      bizTime
    })
    this.count()
    this.getBlockPrizeDetails()
  },
  onShow() {
   this.getblockPrizeDetails()
    const address = app.globalData.address?app.globalData.address:wx.getStorageSync('address');
    const addressId = app.globalData.addressId?app.globalData.addressId:wx.getStorageSync('addressId');
    this.setData({
      address,
      addressId
    })
  },
async getblockPrizeDetails(){
  let blockPrizeDetails = await getBlockPrizeDetailsApi(this.data.blockPrizeId);
  this.setData({
    blockPrizeDetails
  })
},
  onUnload: function () {
    clearInterval(this.data.timer); // 清除定时器
  },
  /**  跳转到地址页面*/
  goToAddressPage() {
    wx.navigateTo({
      url: '/pages/address/address',
    });
  },
  /**  跳转到邀请页面*/
  goInvite() {
    wx.navigateTo({
      url: '/pages/invite/invite',
    });
  },
  /**  抢兑区块*/
  async getMyBlock() {
    let blockPrizeId = this.data.blockPrizeId
    let exchangeQuantity = this.data.count
    let addressId = this.data.addressId
    await blockPrizeExchangeApi({
      blockPrizeId,
      exchangeQuantity,
      addressId
    }).then(() => {
      this.setData({
        count: 0,
      })
      // 请求成功后的逻辑，可以弹出提示
      wx.showToast({
        title: '抢兑成功！',
        icon: 'success',
        duration: 2000
      });
    });
  },
  /**  区块大奖详情    // let array = []
    // for (let i = 0; i < 100; i++) {
    //   array.push({
    //     url: i < 100-inventory ?   'greyBlock.png':'redBlock.png',
    //   });
    // }
    // this.setData({
    //   blockPrizeDetails,
    //   inventory,
    //   array
    // })*/
  async getBlockPrizeDetails() {
    let blockPrizeDetails = await getBlockPrizeDetailsApi(this.data.blockPrizeId);
    let inventory = blockPrizeDetails.inventory
    this.setData({
      inventory,
      blockPrizeDetails
    })
    this.generateArrays()
  },
  generateArrays: function () {
    wx.showLoading({
      title: '加载中',
      mask: true // 是否显示透明蒙层，防止触摸穿透
    });
    setTimeout(() => {
      wx.hideLoading();
    }, 700);
    let inventory = this.data.inventory;
    let array1 = [],
      array2 = [],
      array3 = [],
      array4 = [],
      array5 = [];

    for (let i = 0; i < 100; i++) {
      let url = i < 100 - inventory ? 'greyBlock.png' : 'redBlock.png';
      if (i < 20) {
        array1.push({
          url
        });
      } else if (i < 40) {
        array2.push({
          url
        });
      } else if (i < 60) {
        array3.push({
          url
        });
      } else if (i < 80) {
        array4.push({
          url
        });
      } else {
        array5.push({
          url
        });
      }
    }

    this.setData({
      array1,
      array2,
      array3,
      array4,
      array5
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

  },
  /**  倒计时*/
  count() {
    let bizTime = this.data.bizTime; // 单位为秒
    let endTime = bizTime; // 目标时间戳作为结束时间
    // 更新倒计时显示
    let timer = setInterval(() => {
      let currentTime = Date.now();
      let remainingTime = Math.max(0, endTime - currentTime); // 计算剩余时间，确保不小于0
      let hours = Math.floor(remainingTime / 3600000); // 计算小时
      let minutes = Math.floor((remainingTime % 3600000) / 60000); // 计算分钟
      let seconds = Math.floor((remainingTime % 60000) / 1000); // 计算秒数
      let countdown = this.formatTime(hours) + ":" + this.formatTime(minutes) + ":" + this.formatTime(seconds); // 格式化时间显示
      this.setData({
        countdown: countdown
      });
      if (remainingTime <= 0) {
        clearInterval(timer); // 清除定时器
        wx.redirectTo({
         
          url: '/pages/decrypt/decrypt?id=' + this.data.blockPrizeId + '&state=' + 4
        });
      }
    }, 1000);
    this.setData({
      timer
    })
  },
  formatTime: function (time) {
    return time < 10 ? "0" + time : time.toString();
  },
  /**计数器 */
  increment: function () {
    if (this.data.count < 100 && this.data.inventory > 0) { // 判断 count 是否小于 100
      // this.setData({
      //   count: this.data.count + 1, // count 加一
      //   inventory: this.data.inventory - 1, // 剩余区块数量减一
      // })
      // let array = this.data.array
      // array[99 - this.data.inventory].url = 'greyBlock.png'
      // this.setData({
      //   array
      // })
      let inventory = this.data.inventory - 1;
      let count = this.data.count + 1;
      let array = this.data['array' + (Math.floor((99 - inventory) / 20) + 1)];
  
      array[(99 - inventory) % 20].url = 'greyBlock.png';

      this.setData({
        inventory,
        count,
        ['array' + (Math.floor((99 - inventory) / 20) + 1)]: array
      });

    }


  },
  decrement: function () {
    if (this.data.count > 0 && this.data.inventory < 100) { // 判断 count 是否大于 0
      // this.setData({
      //   count: this.data.count - 1, // count 减一
      //   inventory: this.data.inventory + 1, // 剩余区块数量减一
      // });
      // let array = this.data.array
      // array[100 - this.data.inventory].url = 'redBlock.png'
      // this.setData({
      //   array
      // })
      let inventory = this.data.inventory + 1;
      let count = this.data.count - 1;
      let array = this.data['array' + (Math.floor((100-inventory) / 20) + 1)];
  
      array[(100-inventory) % 20].url = 'redBlock.png';

      this.setData({
        inventory,
        count,
        ['array' + (Math.floor((100-inventory) / 20) + 1)]: array
      });

    }
  }
})