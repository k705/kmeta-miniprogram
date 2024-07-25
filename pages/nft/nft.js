const app = getApp()

import {
  getDigitalCollectiblesListApi,
  getDigitalCollectiblesExchangeApi,
}
from '../../api/digitalCollectibles';

Page({
  data: {

    // 数字藏品！！！！！！！！！！
    digitalCollectiblesList: [],
    bigCardImage: 'https://image.kmeta.world/admin/0/market/digitalCollectibles/20240109/f8b6e68fb05244d08fe384ff73df4137.webp',

    nft_name: '',
    nft_synopsis: 'Kmeta元宇宙首发',
    nft_score: '',
    nft_state: '',
    nft_tags: [],
    nft_labels: null,
    nft_id: '',
    nftSeriesId: '',
    nft_cardImage: 'https://image.kmeta.world/admin/0/virtualAvatar/20231228/3920f540f40f4f078522bfe45b616c19.webp',
    show_nftcard: true,
    show_bigNFTImg: false,
    selectedItemIndex: 0, // 选中的项的索引，默认为-1表示未选中任何项
  },
  onLoad(options) {
    console.log(options, 'options');

    // 获取参数

    const nftseriesid = options.nftseriesid;
    console.log(nftseriesid, 'nftseriesid');

    this.setData({
      nftSeriesId:nftseriesid
    })

    this.getDigitalCollectiblesList()

  },
 
    // 滚动到底部时触发加载更多数据
    loadMoreData: function () {

      // 触底加载下一页
      let nft_id = this.data.digitalCollectiblesList[this.data.digitalCollectiblesList.length - 1].id
      this.setData({
        nft_id
      })
      this.getDigitalCollectiblesList();

    },
    async getDigitalCollectiblesList() {
      // 加载中，显示加载提示
      wx.showLoading({
        title: '加载中...',
        mask: true // 是否显示透明蒙层，防止触摸穿透
      });

      let nft_id = this.data.nft_id
      let nftSeriesId = this.data.nftSeriesId

      let digitalCollectiblesList = this.data.digitalCollectiblesList
      const res = await getDigitalCollectiblesListApi(nft_id, 30, nftSeriesId);
      // if(res.length==0){
      //   wx.showToast({
      //     title: '已加载完毕',
      //     icon: 'success',
      //     duration: 1000
      //   });
      // }
      digitalCollectiblesList = [...digitalCollectiblesList, ...res]
      this.setData({
        digitalCollectiblesList,

      })
      // if (this.data.digitalCollectiblesList.length != 0 && res.length != 0&&!this.data.exchangeOk) {
        if (this.data.nft_name=='') {

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

      if (this.data.promotionGoodsList.length != 0) {
        // 触底加载下一页
        let promotionGoodsId = this.data.promotionGoodsList[this.data.promotionGoodsList.length - 1].id
        this.setData({
          promotionGoodsId
        })
        this.getPromotionGoodsList()
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
    }
  
});