import {
  blockPrizeExchangeApi,
  getDefaultAddressApi,
  saveAddressApi
}
from '../../api/blockPrize';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '', //详细地址
    addressId: '', //地址id
    receiverName: '', //收货人  
    receiverPhone: '', //收货人手机号
    defaultAddress: {}, //默认地址
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad(options) {
    this.getDefaultAddress()
  },

  /**  保存地址 ？？？？*/
  async saveAddress() {
    let value = this.data.receiverPhone;
    let reg = /^1[3456789]\d{9}$/;
    if (!reg.test(value)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
    }
    if (this.data.address == '') {
      wx.showToast({
        title: '收货地址不能为空',
        icon: 'none'
      });
    }
    if (this.data.receiverPhone == '') {
      wx.showToast({
        title: '收货手机号不能为空',
        icon: 'none'
      });
    }
    if (this.data.receiverName == '') {
      wx.showToast({
        title: '收货姓名不能为空',
        icon: 'none'
      });
    }
    if (reg.test(value) && this.data.address != '' && this.data.receiverName != '' && this.data.receiverPhone != '') {
      try {
        // wx.setStorageSync('address', address);
        
        await saveAddressApi({
          address: this.data.address,
          receiverName: this.data.receiverName,
          receiverPhone: this.data.receiverPhone,
          id: this.data.addressId,
        });
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
        app.globalData.address = this.data.address;
        app.globalData.addressId = this.data.addressId;
        wx.setStorageSync('address', this.data.address); // 优点：持久 缺点：读写速度慢
        wx.setStorageSync('addressId', this.data.addressId); // 优点：持久 缺点：读写速度慢
      } catch (error) {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    }

    // address	//详细地址
    //  receiverName	//收货人  
    //  receiverPhone	//收货人手机号

  },
  /**  获取地址 ？？？？*/
  async getDefaultAddress() {
    let defaultAddress = await getDefaultAddressApi();
    if (defaultAddress != null) {
      let {
        address,
        id,
        receiverName,
        receiverPhone
      } =
      defaultAddress


      this.setData({
        defaultAddress,
        address, //详细地址
        receiverName, //收货人  
        receiverPhone, //收货人手机号
        addressId: id
      })
    }



  },
  name(event) {
    this.setData({
      receiverName: event.detail.value // 更新 inputValue 的值为用户输入的内容
    });
  },
  phone(event) {
    let value = event.detail.value;
    let reg = /^1[3456789]\d{9}$/;
    if (reg.test(value)) {
      this.setData({
        receiverPhone: value // 更新 inputValue 的值为用户输入的内容
      });
    } else {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
    }

  },
  address(event) {
    this.setData({
      address: event.detail.value // 更新 inputValue 的值为用户输入的内容
    });
  },

})