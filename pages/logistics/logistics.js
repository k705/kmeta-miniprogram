// pages/logistics/logistics.js
import {
  getLogisticsApi,
}
from '../../api/logistics';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logisticsCompany: '', //	物流公司	string	
    routes: [], //	物流信息	array	SfWaybillRoutesHelper
    waybillNo: '', //	物流单号
    blockId: '',
    address: '', // 
    receiverName: '', //
    receiverPhone: '', //
    // "routes": [
    // 	{
    // 		"acceptAddress": "",
    // 		"acceptTime": "",
    // 		"remark": ""
    // 	}
    // ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    let blockId = options.id
    this.setData({
      blockId
    })
    this.getLogistics()
  },
  /**物流信息*/
  async getLogistics() {
    const res = await getLogisticsApi(this.data.blockId);
    let {
      logisticsCompany,
      waybillNo,
      address,
      receiverName,
      receiverPhone
    } = res



    let routes = this.data.routes
    routes = [...routes, ...res.routes]
    this.setData({
      routes,
      logisticsCompany,
      waybillNo,
      address, // 
      receiverName, //
      receiverPhone, //
    })
    console.log(routes, 'routes');
  },
})