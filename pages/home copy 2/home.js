// index.js

import {
  getStarListApi,
  getExcavateOreApi,
  getAccountIfoApi,
  getAccessResourceApi,
  getvirtualCalendarApi,
  getStarDetailsApi,
  errorGenerateOreApi,
  appletRecommendApi,
  wechatAppletPhoneApi,
  wechatAppletagreePrivacyApi,
  cosmosTrendsApi,
  propInfoApi,
  usePropApi,
  propPackageApi,
  usePropV2Api
}
from '../../api/home';

import {
  loginApi,
  customerInfoApi
}
from '../../api/user';
const app = getApp();

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  /**轮播图样式 */
  indicatorDots: true, //面板指示点
  vertical: true, //是否纵向
  autoplay: false, //是否自动切换
  interval: 2000, //切换时间间隔
  duration: 500, //滑动动画时长


  /**
   * 页面的初始数据
   */
  data: {
    x:0,
    x1:0,
    y:0,
    z:0,
    finalDistance:0,
    /** 新手引导*/
    // firstpic: true,
    firstpic: false,
    secondpic: false,
    thirdpic: false,
    fourpic: false,
    // newpeople: true,
    newpeople: false,
    // oldpeople: false,

    bindPhone: false,
    /** 昵称和隐私*/
    agreePrivacy: false,
    showfootCard: false,
    showPrivacy: false,
    avatarUrl: defaultAvatarUrl,
    avatar: '',
    inputValue: '',
    privacyContractName: '',

    maxInputLength: 32,
    calendarDate: '', // 	日历日期(第一行)	
    currentTime: '', // 	当前时间(时间戳)	
    nextRefreshTime: '',
    screenWidth: '',
    countdown: '', // 用于展示倒计时的字符串
    timer: null, // 定时器
    timeDifference: -1, // 当前时间和下一次刷新时间的时间差（秒）
    showBigScore: false,
    privacyContractName: '',
    showModal: false,
    showModal1: false,
    showModal2: false,
    showfinish: false,
    showTimeData: false,
    showTime: false,
    canClick: true,
    // lastCurrentIndex: 0,
    score: '',
    bigScore: '',
    sumScore: 0,
    oreEmpty: '',
    targetTop: '',
    targetLeft: '',
    accountIfo: {},
    accountScore: {},
    accountMoney: {},
    points: [],
    allpoints: [],
    areatop: '', // 99% 的屏幕宽度
    areafoot: '',
    gap: 10, // 间距
    orePic: '',
    animationData: {},
    currentId: 0, // 假设当前的 ID 为 1，可根据实际情况初始化
    starId: '',
    currentStarItem: '',
    // 搜索选项
    searchOptions: {
      pageSize: 5, //每页条数
      lastId: '', //最后一条id
    },
    // 请求星球的数据
    currentStarId: '', //当前星球id
    excludeStarIds: [], //排除的星球id
    pageSize: 10, //每次获取记录数
    starList: [], // 星球列表
    res: '',
    starListObj: {}, // 星球列表

    lastTwoItems: [],
    lastItems: [],
    totalPages: 0, // 总条数
    isRefreshing: false,
    timestamp: '', //当前时间戳
    indexArr: [],
    scene: '',
    dynamicStyle: '', // 用于动态设置样式的变量
    wid: 0,
    hei: 0,
    randomSize: 40, // 添加这个属性


    /**兑换弹窗 */
    showexchange: false,
    exchangeList: [],
    exchange: {},
    next: 1000,
    flag: true,
    flag1: true,


    /**动态 */
    noticeId: '',
    noticeList: [],
    noticeBac: '',
    cosmosTrendsInterval: null,
    stopAutoPlay: false,


    /**道具 */
    oreSpeed: false,
    propList: [],
    propSwitch: false,
    progress: 0,
    propId: '',
    lightUp: 0, //	点亮数
    propAgeing: '', //		时效 (轮/秒)		
    propAttribute: '', //		道具属性值		
    propDesc: '', //		道具描述	
    propIcon: '', //		道具图片	
    propName: '', //		道具名	
    propType: '', //		道具类型 1-K爆球 2-大爆率魔盒 3-K分吸附镜 4-爆K倒计时 5-共振爆K器
    totalUsable: '', //	可用总量		
    useResidue: '', //	剩余使用	
    // useResidueTime: '', //	剩余使用（2、4）	
    firstUseResidue: 0, //	剩余使用（2、4）
    prop_bigImg: false,
    prop_bigImg_use: false,
    showProp: true,
    useProp: false,
  },



  onLoad(query) {
    this.demo()
    wx.showLoading({
      title: '加载中',
      mask: true // 是否显示透明蒙层，防止触摸穿透
    });
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        // res.screenWidth 即为屏幕宽度
        const screenWidth = res.screenWidth
        that.setData({
          screenWidth
        })
      }
    });
    wx.login({
      async success(res) {
        if (that.data.starId) {
          return
        }
        const wechatCode = res.code;
        // 2. 微信小程序发送请求，携带code，发送开发者服务器
        // 3. 开发者服务器响应token
        if (query != undefined && query.scene) {
          let scene = decodeURIComponent(query.scene);
          that.setData({
            scene
          });
          wx.setStorageSync('scene', scene);
          app.globalData.scene = scene;
        }
        const inviteId = app.globalData.scene;
        const {
          customerId,
          token,
          bindPhone,
          newCustomer
        } = await loginApi({
          wechatCode,
          inviteId
        });
        that.setData({
          bindPhone
        })
        // const newCustomer = true
        if (newCustomer) {
          that.setData({
            newpeople: true,
            firstpic: true,
          })
          wx.getPrivacySetting({
            async success(res) {
              // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
              if (res.needAuthorization) {
                const privacyContractName = res.privacyContractName
                // 需要弹出隐私协议
                that.setData({
                  showPrivacy: true,
                  privacyContractName
                })
              } else {
                // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用隐私接口
                that.setData({
                  showPrivacy: false
                })
              }
            },
          })
        }

        // 4. 微信小程序接受token，将其持久化存储起来，发送请求作为请求头参数携带上即可
        wx.setStorageSync('customerId', customerId); // 优点：持久 缺点：读写速度慢
        wx.setStorageSync('accessToken', token); // 优点：持久 缺点：读写速度慢
        app.globalData.customerId = customerId; // 存在内存中 优点：读写速度快 缺点：不够持久
        app.globalData.accessToken = token; // 存在内存中 优点：读写速度快 缺点：不够持久
 
        that.getTime();
        that.startCountdown();
        that.cosmosTrends();
        that.getpropInfo()
        that.propPackage()
        that.cosmosTrendsInterval = setInterval(() => {
          that.cosmosTrends();
        }, 20000);
        if (that.data.starList.length == 0) {
          that.getStarList(that.data.starId);
        }
        // 获取道具区域位置
        // setTimeout(()=>{
        //   wx.createSelectorQuery().select('#myCanvas').boundingClientRect(function(rect){

        //     console.log(rect);
        //   }).exec();
        // },2000)


        that.appletRecommend();


        // 获取屏幕宽度，以便后续计算
        const screenWidth = wx.getSystemInfoSync().screenWidth;

        // 设置元素的最小和最大距离范围
        const minDistance = 25; // 25rpx
        const maxDistance = 30; // 30rpx

        // 计算最终距离，确保在指定范围内
        const finalDistance = Math.min(maxDistance, Math.max(minDistance, screenWidth * 0.05)); // 5% 屏幕宽度
        // const x= that.data.x
        that.setData({
          finalDistance
        })
        // 将最终距离转化为动态样式
        // const dynamicStyle = `
        // position: absolute;
       
        // left: ${finalDistance}rpx;
        // right: ${finalDistance}rpx;
        // top: ${240 + finalDistance}rpx;
        // bottom: ${218 + finalDistance}rpx;
        // transform: rotate3d(0, 1, 0, ${x}deg);
        // z-index: 999;`;

//  background: white;

        // background-color:blue
        // 更新 data 中的 dynamicStyle
        // that.setData({
        //   dynamicStyle
        // });

      }
    })

  },
  demo(){
    let self = this;
    // 陀螺仪
    // wx.startGyroscope({
    //   interval: 'interval',
    //   success(data){
    //     console.log(data)
    //   },
    //   fail(err){
    //     console.log(err)
    //   }
    // });
    // wx.onGyroscopeChange((result) => {
    //   console.log('陀螺仪：',-(result.y * 100).toFixed(2))// 测转动的速度值。而不是角度值。速度越大，值越大。速度为0，值为0；
    //   var xVal = -(result.y * 100).toFixed(2);
    //   var yVal = (result.x * 100).toFixed(2);
    //   self.setData({
    //     x: xVal > 40 ? 40 : (xVal < -40 ? -40 : xVal),
    //     y: yVal > 40 ? 40 : (yVal < -40 ? -40 : yVal),
    //   })
    // })

    // 设备方向
    wx.startDeviceMotionListening({
      interval: 'ui',
    });
    wx.onDeviceMotionChange((result) => {
      console.log('设备方向：',result);//alpha,beta,gamma
      // var xVal = -(result.gamma).toFixed(2)/5;
      // var yVal = -(result.beta - 30).toFixed(2)/5;
      // self.setData({
      //   x: xVal > 20 ? 35 : (xVal < -20 ? -35 : 1.5*xVal),
      //   x1: xVal > 20 ? -35 : (xVal < -20 ? 35 : -1.5*xVal),
      //   y: yVal > 10 ? 10 : (yVal < -10 ? -10 : yVal),
      // })
      var xVal = -(result.gamma).toFixed(2) / 2.5;
      var yVal = -(result.beta - 30).toFixed(2) / 2.5;
      var zVal = -(result.alpha).toFixed(2) / 2.5;
      self.setData({
        x: xVal > 10 ? 10 : (xVal < -10 ? -10 : xVal),
        y: yVal > 10 ? 10 : (yVal < -10 ? -10 : yVal),
        z: zVal > 10 ? 10 : (zVal < -10 ? -10 : zVal),
      });
    })
  },
  goTo3DPage() {

    wx.navigateTo({
      url: '/pages/test1/test1'
    });
  },
  /**动态*/
  async cosmosTrends() {
    wx.hideLoading();
    let noticeId = this.data.noticeId
    let noticeList = this.data.noticeList
    const res = await cosmosTrendsApi(noticeId, 10);
    wx.hideLoading();
    if (res.length != 0) {
      this.setData({
        stopAutoPlay: false
      })

    }
    noticeList = [...noticeList, ...res]
    this.setData({
      noticeList,
    })
    noticeList = this.data.noticeList
    noticeId = noticeList[noticeList.length - 1].id
    this.setData({
      noticeId,
    })
    if (this.data.noticeList.length != 0) {}

    // 请求成功，隐藏 loading
    wx.hideLoading();

  },
  swiperAnimationFinish: function (e) {
    if (e.detail.current == this.data.noticeList.length - 1) {
      this.setData({
        stopAutoPlay: true
      });
    }
  },
  /**道具 */
  // 一键点击功能
  getOre(event) {
    console.log('???');

    let id = event.currentTarget.dataset.item.starId
    console.log(event, 'event');

    let points = event.currentTarget.dataset.item.points
    let oreQuantity = event.currentTarget.dataset.item.oreQuantity


    let oreNum = points.length
    console.log(oreQuantity, 'oreQuantity');
    let index = 0
    if (oreQuantity == 0) {
      wx.showToast({
        title: '请在有矿石星球使用',
        icon: 'none',
        duration: 3000 // 设置显示持续时间为 5000 毫秒（5 秒）
      })
      return
    }

    clearInterval(intervalId)

    var intervalId = setInterval(() => {
      if (index >= oreQuantity) {
        clearInterval(intervalId);
        this.setData({
          oreSpeed: false
        }) // 停止定时器
        return;
      }
      let dataset = {
        id: event.currentTarget.dataset.item.starId,
        index: index
      };

      let newEvent = {
        currentTarget: {
          dataset
        }
      };
      this.setData({
        oreSpeed: true
      })

      this.clickOre(newEvent);
      if (index == oreQuantity - 2) {
        this.setData({
          starId: id
        })
        // this.useProp()
      }
      index++;
    }, 350);

  },


  async getpropInfo() {
    let res = await propInfoApi();
    let {
      lightUp,
      propName,
      propDesc,
      propIcon,
      propSwitch,
      propType,
      totalUsable,
      useResidue,
    } = res

    let newLightUp
    if (lightUp == 3) {
      newLightUp = 3
    }
    if (this.data.lightUp === 2 && newLightUp === 3) {
      this.setData({
        prop_bigImg: true,
        showProp: true
      });
    }
    this.setData({

      lightUp,
      propSwitch,

      totalUsable,
      useResidue,

    })
    if (this.data.useResidue == 0) {
      this.setData({
        useProp: false
      })
    }
    if (propDesc &&
      propIcon && propName && propType) {
      this.setData({
        propDesc,
        propIcon,
        propType,
        propName,


      })
    }

    clearTimeout(timer);
    var timer = setTimeout(() => {


      if (this.data.firstUseResidue !== undefined && this.data.firstUseResidue === 0 && (this.data.propType == 2 || this.data.propType == 4) && useResidue !== 0) {

        this.setData({
          firstUseResidue: useResidue
        });

        this.updateProgress()
      }
    }, 1000)


  },
  async propPackage() {
    let res = await propPackageApi();

    this.setData({
      propList: res
    })



  },
  hide_prop_bigImg() {
    this.setData({
      prop_bigImg: false,
      lightUp: 0,
      propIcon: '',
      propName: '',
      propDesc: ''
    });
    this.propPackage()
  },
  hide_prop_bigImgUse() {
    this.setData({
      prop_bigImg_use: false,
      propIcon: '',
      propName: '',
      propDesc: ''
    });
  },
  onAnimationEnd: function () {
    // this.getpropInfo()
    // console.log("进度条已经达到100%");

  },
  showPropUse(e) {

    console.log(e, 'e');
    let {
      id,
      icon,
      name,
      desc,
      type
    } = e.currentTarget.dataset
    this.setData({
      propType: type,
      propIcon: icon,
      propName: name,
      propDesc: desc,
      propId: id,
      prop_bigImg_use: true
    })

  },
  async useProp(e) {

    let event = e
    console.log(event, 'event');
    let oreQuantity = event.currentTarget.dataset.item.oreQuantity

    console.log(oreQuantity, 'oreQuantity');

    if (oreQuantity == 0) {
      wx.showToast({
        title: '请在有矿石星球使用',
        icon: 'none',
        duration: 4000 // 设置显示持续时间为 5000 毫秒（5 秒）
      })
      this.setData({
        prop_bigImg_use: false,

      });
      return
    }
    this.setData({
      prop_bigImg_use: false,
      firstUseResidue: 0,
      progress: 0
    });


    let data = {
      propId: this.data.propId,
      starId: this.data.starId
    }
    try {
      let res = await usePropV2Api(data);

      if (this.data.propType == 2 || this.data.propType == 3 || this.data.propType == 4 || this.data.propType == 5) {
        this.setData({
          useProp: true

        });
      }
    } catch (error) {

    }
    this.getpropInfo()

    if (this.data.propType == 1) {
      this.getOre(event)
      console.log('??');
    }
    this.propPackage()
    // setTimeout(() => {
    //   this.getpropInfo();
    // }, 30000); // 30秒后执行

  },

  updateProgress: function () {

    console.log('更新时间');
    const totalIncrements = 100; // 总增量为100
    let firstUseResidue

    if (this.data.propType == 2) {
      firstUseResidue = this.data.firstUseResidue // 使用剩余时间
    }
    if (this.data.propType == 4) {
      firstUseResidue = 15; // 使用剩余时间
    }

    const increment = totalIncrements / firstUseResidue; // 每10毫秒增加的进度
    clearInterval(interval);
    var interval = setInterval(() => {

      if (this.data.progress < 100) {
        this.setData({
          progress: this.data.progress + increment
        });

      } else {
        clearInterval(interval);
        this.getpropInfo()

        this.setData({
          useProp: false,

        });
        this.propPackage()

      }
    }, 1000); // 每10毫秒更新一次进度
  },


  /**新手引导 */
  firstOre() {
    this.setData({
      firstpic: false,
      secondpic: true
    })
  },
  secondpic() {
    this.setData({
      secondpic: false,
      thirdpic: true,
      fourpic: true
    })
  },
  startCountdown() {
    clearInterval(this.data.timer);
    console.log('结束计时器1');

    this.data.timer = setInterval(() => {
      this.updateCountdown();
    }, 1000);
    // 初始化倒计时
    this.updateCountdown();
  },

  updateCountdown() {

    if (this.data.timeDifference > 0) {
      const hours = Math.floor(this.data.timeDifference / 3600);
      const minutes = Math.floor((this.data.timeDifference % 3600) / 60);
      const seconds = Math.floor(this.data.timeDifference % 60);
      // 格式化成时分秒的字符串
      const countdown = `${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`;

      // 更新数据
      this.setData({
        countdown,
        timeDifference: this.data.timeDifference < 1 ? 0 : this.data.timeDifference - 1,
      });
    } else if (this.data.timeDifference != -1 && this.data.timeDifference != undefined) {


      this.setData({
        timeDifference: -1,
        showfinish: false,
        useProp: false,
        // propType:null

      });
      this.setData({
        starList: [],
        starListObj: {},
        currentId: 0,
        excludeStarIds: []
      })

      this.getStarList(this.data.starId)
      this.propPackage()
      this.getpropInfo()
      // 清除定时器
      // clearInterval(this.data.timer);
      this.getTime()

      // 倒计时结束后的逻辑，可以根据需要进行处理
    }
  },

  /**隐私政策、昵称 */
  // 打开隐私协议页面
  openPrivacyContract() {
    wx.openPrivacyContract()
  },

  disagree(e) {
    // 直接退出小程序
    wx.exitMiniProgram()
  },
  handleAgreePrivacyAuthorization() {
    this.setData({
      showPrivacy: false,
      showfootCard: true,
      agreePrivacy: true
    })
    this.wechatAppletagreePrivacy()
  },
  handledisAgreePrivacyAuthorization() {

    this.setData({
      agreePrivacy: false
    })
    this.wechatAppletagreePrivacy()


  },
  goUserDoc(e) {
    let doc = e.currentTarget.dataset.doc;
    wx.navigateTo({
      url: "/pages/webview/webview?url=https://image.kmeta.world/agreement/customer.html&&title=用户使用许可及服务协议" // 解码
    })
  },
  goPrivacyDoc(e) {
    let doc = e.currentTarget.dataset.doc;
    wx.navigateTo({
      url: "/pages/webview/webview?url=https://image.kmeta.world/agreement/privacy.html&&title=隐私政策" // 解码
    })
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    this.setData({
      avatarUrl,
    })
    const urlParts = this.data.avatarUrl.split('.'); // 使用 . 分割字符串
    const type = urlParts[urlParts.length - 1]; // 获取最后一部分即为文件扩展名
    // 执行图片转base64方法
    this.base64(avatarUrl, type).then(res => {
      this.setData({
        avatar: res
      })
    })
  },
  handleInput(e) {
    // 将输入的值更新到 data 中
    this.setData({
      inputValue: e.detail.value
    });
  },
  calculateUtf16ByteLength(str) {
    if (typeof str !== 'string') {
      return 0;
    }
    let totalLength = 0;
    for (let i = 0; i < str.length; i++) {
      const codeUnit = str.charCodeAt(i);
      if (codeUnit <= 0x7F) {
        // ASCII字符（0x00到0x7F）占用1个字节 
        totalLength += 1;
      } else if (0xD800 <= codeUnit && codeUnit <= 0xDBFF) {
        // 代理对高位，占用4个字节（这里假设每个代理对总是有效的）
        totalLength += 4;
        i++;
        // 跳过代理对的低位部分
      } else {
        // 其他字符（包括大多数汉字）占用2个字节 
        totalLength += 2;
      }
    }
    return totalLength;
  },
  allow() {
    let trimmedNickname = this.data.inputValue
    const length = this.calculateUtf16ByteLength(trimmedNickname)
    console.log("Total character length in bytes:", this.calculateUtf16ByteLength(trimmedNickname));
    if (this.data.avatarUrl == '' || this.data.avatarUrl == defaultAvatarUrl) {
      wx.showToast({
        title: '头像不能为空',
        icon: 'none', // 显示无图标
        duration: 2000, // 提示持续时间，单位毫秒
      });
      return;
    }
    if (trimmedNickname.trim() == '') {
      wx.showToast({
        title: '昵称不能为空',
        icon: 'none', // 显示无图标
        duration: 2000, // 提示持续时间，单位毫秒
      });
      return;
    }

    const {
      maxInputLength
    } = this.data;
    if (length > maxInputLength) {
      // 如果输入长度超过最大长度，截取前 maxInputLength 个字符
      const truncatedText = trimmedNickname.slice(0, maxInputLength);
      this.setData({
        nickname: truncatedText,
      });
      wx.showToast({
        title: '昵称不能超过32个字符',
        icon: 'none',
      });

    } else {
      this.setData({
        nickname: trimmedNickname,
      });
    }


    if (trimmedNickname.length > 32) {
      wx.showToast({
        title: '昵称不能超过32个字符',
        icon: 'none', // 显示无图标
        duration: 2000, // 提示持续时间，单位毫秒
      });
      return;
    }

    this.getcustomerInfo()
  },
  notallow() {
    this.setData({
      showfootCard: false
    })
  },
  // 用户信息
  async getcustomerInfo() {
    const inputValue = this.data.inputValue
    const avatar = this.data.avatar
    const data = {
      nickname: inputValue,
      avatar
    }
    await customerInfoApi(data);
    this.setData({
      showfootCard: false
    })
  },
  // 是否同意隐私
  async wechatAppletagreePrivacy() {
    const agreePrivacy = this.data.agreePrivacy
    const data = {
      agreePrivacy
    }
    await wechatAppletagreePrivacyApi(data);
    if (agreePrivacy == false) {
      this.disagree()
    }
  },
  // 图片转64
  base64(url, type) {
    return new Promise((resolve, reject) => {
      wx.getFileSystemManager().readFile({
        filePath: url, //选择图片返回的相对路径
        encoding: 'base64', //编码格式
        success: res => {
          resolve('data:image/' + type.toLocaleLowerCase() + ';base64,' + res.data)
          // resolve(res.data)
        },
        fail: res => reject(res.errMsg)
      })
    })
  },

  async getPhoneNumber(e) {
    console.log(e, 'e');
    console.log(e.detail.code) // 动态令牌
    console.log(e.detail.errMsg) // 回调信息（成功失败都会返回）
    console.log(e.detail.errno) // 错误码（失败时返回）

    if (e.detail.code) {
      let wechatCode = e.detail.code
      await wechatAppletPhoneApi({
        wechatCode
      })
      this.setData({
        bindPhone: true
      })
    }
    this.navigateToTask()
  },
  /**倒计时 */
  // 格式化时间，保证时、分、秒都是两位数
  formatTime(value) {
    return value < 10 ? `0${value}` : `${value}`;
  },

  showTime() {
    const showTime = !this.data.showTime
    this.setData({
      showTime
    });
  },

  showCard() {
    this.setData({
      showModal: true,
      showModal2: true
    });
  },

  showCard1() {
    this.setData({
      showModal: true,
      showModal1: true
    });

  },

  closeCard() {
    this.setData({
      showModal: false,
      showModal1: false,
      showModal2: false
    });
  },
  closeBigScorecard() {
    this.setData({
      showBigScore: false,
      BigScorecard_overlay: false,
    });
  },
  generatePoints: function (oreQuantity, generateStarId) {

    const screenWidth = wx.getSystemInfoSync().screenWidth;
    const screenHeight = wx.getSystemInfoSync().screenHeight;
    // console.log(screenWidth,screenHeight,'???');
    // const areaWidth = this.data.wid ; // 99% 的屏幕宽度
    // const areaHeight = this.data.hei; // 73% 的屏幕高度
    const areaWidth = screenWidth * 1.68; // 99% 的屏幕宽度
    const areaHeight = screenHeight * 1.045; // 73% 的屏幕高度
    //   const areaWidth = this.data.areaWidth; // 99% 的屏幕宽度
    // const areaHeight = this.data.areaHeight; // 73% 的屏幕高度

    // console.log(areaWidth,areaHeight,'kuangao');
    const blockWidth = 100;
    const blockHeight = 100;
    const numRectangles = oreQuantity;
    const points = this.generateNonOverlappingRectangles(areaWidth, areaHeight, blockWidth, blockHeight, numRectangles, generateStarId);
    this.setData({
      points: points,
    });
  },

  generateNonOverlappingRectangles: function (areaWidth, areaHeight, blockWidth, blockHeight, numRectangles, generateStarId) {
    const rectangles = [];
    const screenWidth = wx.getSystemInfoSync().screenWidth;

    for (let i = 0; i < numRectangles; i++) {

      const newRect = {
        // x: Math.floor(Math.random() * (750 - blockWidth - 30 - 30  + 1)) + 30,
        // x: 620,
        x: Math.floor(Math.random() * (750 - blockWidth - 30 - blockWidth - 30 + 1)) + 30,
        // x: Math.floor(Math.random() * (areaWidth - blockWidth)),
        y: Math.floor(Math.random() * (areaHeight - blockHeight)),
        // y: Math.floor(Math.random() * 726+126),

        // y: Math.floor(Math.random() * (this.data.areafoot - this.data.areatop) + this.data.areatop),
        width: blockWidth,
        height: blockHeight,
        rotation: Math.floor(Math.random() * 360), // 添加旋转角度属性
        isHidden: false,
        isscoreHidden: false,
        randomSize: Math.floor(Math.random() * 30) + 50 // 生成40-70之间的随机数

      };
      // console.log(newRect,'newRect');
      let count = 0;

      // 检查重叠并调整位置

      while (count < 300 && (this.isOverlap(rectangles, newRect))) {

        newRect.x = Math.floor(Math.random() * (750 - blockWidth - 30 - 30 - 30 + 1)) + 30,

          newRect.y = Math.floor(Math.random() * (areaHeight - blockHeight));

        count++;
      }

      if (count < 300) {
        rectangles.push(newRect);
      } else {
        this.errorGenerateOre({
          oreQuantity: rectangles.length,
          starId: generateStarId
        })
      }

    }

    return rectangles;
  },


  isOverlap: function (rectangles, newRect) {
    for (const existingRect of rectangles) {
      if (!(newRect.x + newRect.width <= existingRect.x ||
          existingRect.x + existingRect.width <= newRect.x ||
          newRect.y + newRect.height <= existingRect.y ||
          existingRect.y + existingRect.height <= newRect.y)) {
        return true; // 重叠
      }
    }
    return false; // 不重叠
  },

  onReady() {

  },

  onShow() {

  },



  swiperChange(e) {

    this.setData({
      showModal: false,
      showModal1: false,
      showModal2: false,
      showfinish: false,
      // showBigScore:false,
      showexchange: false
    })
    this.closeBigScorecard()
    const currentIndex = e.detail.current;
    const resourceId = this.data.starList[currentIndex].starId
    const data = {
      resourceId,
      scene: 'satr'
    }
    this.setData({
      starId: resourceId,
      currentId: currentIndex,
    })
    console.log('starId下滑', this.data.starId);
    console.log('当前 swiper-item 的 索引:', currentIndex);
    const delta = currentIndex - this.data.currentId;
    // 处理往下翻的逻辑
    if (delta > 0) {

    } else if (delta < 0) {
      // 处理往上翻的逻辑
    } else {
      // 处理未变化或切换到当前页的逻辑
    }
    if (this.data.currentId === (this.data.totalPages - 2)) {
      console.log(this.data.totalPages, this.data.currentId, 'this.data.currentId&&this.data.totalPages');
      if (this.data.starList.length != 2) {
        // const excludeStarIds = []
        // const res = this.data.res
        // // 获取 res 数组的最后两条记录
        // const lastItems = res.slice(-2).map(item => item.starId);
        // console.log(lastItems, 'lastItems');
        // this.setData({
        //   lastItems
        // })
        // // 将最后一条记录添加到 excludeStarIds 数组中
        // excludeStarIds.push(...lastItems);
        // if (excludeStarIds.length != 0) {
        //   this.setData({
        //     excludeStarIds
        //   })
        // }
        console.log('倒数第二页重新请求');
        this.getStarList('');
      }
    }
    if (this.data.currentId === this.data.totalPages - 1) {
      const excludeStarIds = []
      // const res = this.data.res
      // 获取 res 数组的最后一条记录
      const lastItems = this.data.starList.slice(-1).map(item => item.starId);
      console.log(lastItems, 'lastItems');
      this.setData({
        lastItems
      })
      // 将最后一条记录添加到 excludeStarIds 数组中
      excludeStarIds.push(...lastItems);
      if (excludeStarIds.length != 0) {
        this.setData({
          excludeStarIds
        })
      }
      console.log('最后一页重新请求');
      this.getStarList(this.data.starId);

    }
    console.log(this.data.starList, 'generatePoints');
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


  onShareAppMessage(options) {
    const inviteId = app.globalData.customerId
    console.log(inviteId, 'inviteId');
    return {
      title: 'K星矿元 ，K分兑大奖！',
      path: '/pages/home/home?scene=' + inviteId,
      imageUrl: 'https://image.kmeta.world/applet/images/coffeeSharePic.png', // 分享图片路径

    }
  },
  /**星球 */
  // 发送请求，获取倒计时
  async getTime() {
    const res = await getvirtualCalendarApi();
    const {
      calendarDate,
      currentTime,
      nextRefreshTime,

    } = res;
    // 计算时间差
    const timeDifference = Math.floor((nextRefreshTime - currentTime) / 1000);

    this.setData({
      timeDifference,
      calendarDate, // 	日历日期(第一行)	
      currentTime, // 	当前时间(时间戳)	
      nextRefreshTime, //下一次刷新时间	

    })
    // 开始倒计时

  },

  /**星球列表 */
  // 发送请求，获取商品列表
  async getStarList(currentId) {
    const res = await getStarListApi(this.data.excludeStarIds, currentId, this.data.pageSize);
    this.propPackage()
    this.getpropInfo()
    this.setData({
      res,
    })
    let oreQuantity = 0
    // 使用 forEach 循环取出 id 并调用 fn 函数
    res.forEach((item, index) => {
      oreQuantity = item.oreQuantity
      const oreId = index;
      if (this.data.starListObj[item.starId]) {
        item.points = this.data.starListObj[item.starId]
        console.log('原来的矿石', item.points);
      } else {
        const generateStarId = item.starId
        this.generatePoints(oreQuantity, generateStarId);
        // console.log('生成矿石', item.starId);
        item.points = (this.data.points);
      }
    });
    console.log(res, 'res');
    if (res.length == 1) {
      console.log(oreQuantity, 'oreQuantity');
    }
    const starList = this.data.currentId === 0 ? res : [...this.data.starList, ...res]
    if (starList.length == 0) {
      starList = [...this.data.starList]
    }


    console.log(starList, 'starList');
    if (res.length == 0 && this.data.currentId == this.data.starList.length - 1) {
      this.setData({
        showfinish: true
      })
    }
    // console.log(this.data.currentId, 'this.data.currentId');
    if (starList.length == 1 && this.data.currentId == 0) {
      this.setData({
        showfinish: true
      })
    }
    // 使用 reduce 方法将 starList 转换为对象
    const starListObj = starList.reduce((obj, item) => {
      obj[item.starId] = item.points;
      return obj;
    }, {});
    this.setData({
      starListObj
    })
    // 获取数组长度
    const arrayLength = res.length;
    const excludeStarIds = []
    // 获取 res 数组的最后两条记录
    const lastTwoItems = starList.slice(-2).map(item => item.starId);
    console.log(lastTwoItems, 'lastTwoItems');
    this.setData({
      lastTwoItems
    })

    // 将最后两条记录添加到 excludeStarIds 数组中
    excludeStarIds.push(...lastTwoItems);
    if (excludeStarIds.length != 0) {
      this.setData({
        excludeStarIds
      })
    }
    const totalPages = starList.length;
    let orePic
    if (res.length != 0) {
      orePic = res[0].orePic;
    }

    this.setData({
      orePic,
      totalPages,

    })
    const allpoints = [];

    this.setData({
      starList
    });
    const resourceId = this.data.starList[0].starId
    const data = {
      resourceId,
      scene: 'satr'
    }
    this.setData({
      starId: resourceId
    })
    this.getAccessResource(data)
  },

  /**  矿石生成错误 */
  async errorGenerateOre(oreQuantity, generateStarId) {
    await errorGenerateOreApi(oreQuantity, generateStarId);
  },
  /**  兑换礼品弹框 */
  async appletRecommend() {
    const exchangeList = await appletRecommendApi();
    this.setData({
      exchangeList
    })
    this.getAccountIfo();
  },
  closeexchange() {
    this.setData({
      showexchange: false
    })
  },
  goApp2() {
    this.setData({
      showexchange: false,
    })
    wx.navigateTo({
      url: '/pages/goApp/goApp', // 替换为你要跳转的页面路径
    });
  },
  goWorld() {

    wx.navigateTo({
      url: '/pages/world/world', // 替换为你要跳转的页面路径
    });
  },
  goAppNewpeople() {
    this.setData({
      newpeople: false,
      fourpic: false,
    })
    wx.navigateTo({
      url: '/pages/goApp/goApp?newpeople=true',
      // 替换为你要跳转的页面路径
    });
  },
  goRank() {
    wx.navigateTo({
      url: '/pages/rank/rank', // 替换为你要跳转的页面路径
    });

  },


  goApp() {
    wx.navigateTo({
      url: '/pages/goApp/goApp', // 替换为你要跳转的页面路径
    });
    this.setData({
      showModal: false,
      showModal1: false,
      showModal2: false,
    })
  },
  async getAccountIfo() {

    let exchangeList = this.data.exchangeList
    // console.log(exchangeList, 'exchangeList');
    const accountIfo = await getAccountIfoApi();
    const accountScore = accountIfo.usableScore
    const accountMoney = accountIfo.usableScoreAmount
    if (accountScore > 99999999) {
      accountIfo.usableScore = Math.floor(accountIfo.usableScore / 10000)
    }
    if (accountMoney > 99999999) {
      accountIfo.usableScoreAmount = Math.floor(accountIfo.usableScoreAmount / 10000)
    }
    // "usableScore": 0,
    // "usableScoreAmount": 0,
    this.setData({
      accountIfo,
      accountScore,
      accountMoney
    })


  },

  async getAccessResource(data) {
    await getAccessResourceApi(data);
  },

  playClickSound() {
    // 创建内部音频上下文
    const innerAudioContext = wx.createInnerAudioContext();
    // 设置音频资源地址
    innerAudioContext.src = 'https://image.kmeta.world/applet/acoustics/clickOre.mp3'; // 替换为你的音频文件地址
    // 监听音频播放结束事件
    innerAudioContext.onEnded(() => {
      // 在音频播放结束时执行销毁操作
      innerAudioContext.destroy();
    });

    // 播放音频
    innerAudioContext.play();
    // innerAudioContext.destroy();
  },
  playZeroSound() {
    // 创建内部音频上下文
    const innerAudioContext = wx.createInnerAudioContext();
    // 设置音频资源地址
    innerAudioContext.src = 'https://image.kmeta.world/applet/acoustics/zeroOre.mp3'; // 替换为你的音频文件地址
    innerAudioContext.onEnded(() => {
      // 在音频播放结束时执行销毁操作
      innerAudioContext.destroy();
    });
    // 播放音频
    innerAudioContext.play();
    // innerAudioContext.destroy();
  },

  async clickOre(event) {
    // console.log('调用了');

    let starList = this.data.starList;

    if (!this.data.canClick) {
      return;
    }
    this.setData({
      score: '',
      canClick: false,
    });
    const {
      id,
      index,
      // isHidden,
      // isscoreHidden
    } = event.currentTarget.dataset;


    // 将对应的 ore 元素的 isHidden 状态设置为 true
    let pointItem = {};

    starList.forEach((item) => {
      if (item.starId === id) {
        // 在这里可以根据你的条件判断来修改
        pointItem = item.points[index]
        item.points[index].isHidden = true
        item.points[index].isscoreHidden = false
        if (item.oreQuantity > 0) {
          item.oreQuantity--
        }
        const starListObj = this.data.starListObj
        starListObj[item.starId] = item.points
      }
    });


    this.setData({
      starList,

    });

    const starIdObj = {
      id
    }

    const res = await getExcavateOreApi(starIdObj)
    // this.propPackage()
    this.getpropInfo()

    /***四个弹窗 */
    this.setData({
      oreEmpty: res.oreEmpty,
      score: res.score
    })
    if (this.data.score > 500) {

      const bigScore = this.data.score
      this.setData({
        bigScore,
        showBigScore: true,
        // showexchange:false,
        BigScorecard_overlay: true
      })
    }
    // 累计挖的分数
    const sumScore = this.data.sumScore + this.data.score

    this.setData({
      sumScore
    })
    if (sumScore >= this.data.next) {
      let next = this.chooseNext(sumScore)
      console.log(next);
      let exchange = this.chooseExchange()
      console.log(exchange);
      if (this.data.showBigScore == false) {
        this.setData({
          exchange,
          showexchange: true,
          next
        })
      }
    }

    /***点击的声音 */
    if (this.data.score == 0) {
      this.playZeroSound()
    } else {
      this.playClickSound()
    }
    var animation
    if (this.data.oreSpeed) { // 创建动画实例
      animation = wx.createAnimation({
        duration: 70,
        timingFunction: 'ease-in-out', // 时间曲线，表示慢到快再到慢
      });
    } else {
      // 创建动画实例
      animation = wx.createAnimation({
        duration: 2000,
        timingFunction: 'ease-in-out', // 时间曲线，表示慢到快再到慢
      });
    }


    // 计算位移距离
    // var translateY = 1012 - pointItem.y; // 在实际应用中可能需要调整这个值
    var translateY = 20; // 在实际应用中可能需要调整这个值
    // var translateX = 113 - pointItem.x; // 在实际应用中可能需要调整这个值
    var translateX = 20; // 在实际应用中可能需要调整这个值
    // 设置位移动画
    //  animation.translateY(translateY).step();
    animation.translate(translateX, translateY).scale(0).opacity(0).step();
    // 更新数据，启动动画
    this.setData({
      animationData: animation.export()
    });
    // 动画结束后，将元素隐藏
    // setTimeout(() => {
    this.setData({
      animationData: null,
      canClick: true,
    });
    starList = this.data.starList
    starList.forEach((item) => {
      if (item.starId === id) {
        // 在这里可以根据你的条件判断来修改
        item.points[index].isscoreHidden = true
      }
    });
    this.getAccountIfo();
    // }, 100);


  },
  setNext(sumScore) {
    let next = this.data.next
    if (sumScore >= 10000) {
      next = (Math.floor(sumScore / 10000)) * 10000;
    } else if (sumScore >= 3000) {
      next = 3000;
    } else if (sumScore >= 2000) {
      next = 2000;
    } else if (sumScore >= 1000) {
      next = 1000;
    } else {
      next = 1000;
    }
    return next
  },
  chooseNext(sumScore) {
    let next = this.setNext(sumScore)
    switch (next) {
      case 1000:
        next = 2000;
        break;
      case 2000:
        next = 3000;
        break;
      case 3000:
        next = 10000;
        break;
      default:
        next += 10000;
        break;
    }
    return next
  },
  chooseExchange() {
    console.log(this.data.sumScore, 'this.data.sumScore');
    let exchange = {}
    if (this.data.sumScore >= 1000 && this.data.sumScore < 2000) {
      exchange = this.data.exchangeList[0];
    } else if (this.data.sumScore >= 2000 && this.data.sumScore < 3000) {
      exchange = this.data.exchangeList[1];
    } else if (this.data.sumScore >= 3000 && this.data.sumScore < 10000) {
      exchange = this.data.exchangeList[2];
    } else if (this.data.sumScore >= 10000) {
      console.log(this.data.sumScore, '10000');
      exchange = this.data.exchangeList[3];
      console.log(this.data.exchangeList[3], 'this.data.exchangeList[3];');
    }
    return exchange
  },
  closefinish() {
    this.setData({
      showfinish: false,
    });
  },

  navigateToTask() {
    wx.navigateTo({
      url: '/pages/task/task', // 替换为你要跳转的页面路径
    });
  },

  // 下拉刷新
  async pullDownRefresh() {


  },

  goHome() {
    // wx.switchTab({
    //   url: '/pages/home/home',
    // })
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
    // 页面卸载时清除定时器
    clearInterval(this.data.timer);
    console.log('结束计时器');
    clearInterval(this.data.cosmosTrendsInterval);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // 只在第一页执行刷新操作
    // if (this.data.starList === 1) {
    //   this.pullDownRefresh();
    // } else {
    //   wx.stopPullDownRefresh(); // 停止下拉刷新动画
    // }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },


})