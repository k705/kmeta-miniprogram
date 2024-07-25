// index.js
import {
  loginApi,
  customerInfoApi
}
from '../../api/user';
const app = getApp();
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cb: 0,
    userInfo: null,
    scene: '',
    inviteId: '',
    showfootCard: false,
    showPrivacy: false,
    avatarUrl: defaultAvatarUrl,
    avatar: '',
    inputValue: '',
    privacyContractName:''
  },

  onLoad() {
    let that = this;
    // if (query != undefined && query.scene) {
    //   // let scene = decodeURIComponent(query.scene);
    //   let scene = query.scene;
    //   that.setData({
    //     scene
    //   });
    //   wx.setStorageSync('scene', scene);
    //   app.globalData.scene = scene;
    // }
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
          console.log(that.data.privacyContractName);
        } else {
          // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用隐私接口
          that.setData({
            showPrivacy: false
          })
        }
      },
    })
  },
  
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
    })
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
    console.log(avatarUrl, "avatarUrl");

    const urlParts = this.data.avatarUrl.split('.'); // 使用 . 分割字符串
    const type = urlParts[urlParts.length - 1]; // 获取最后一部分即为文件扩展名
    // 执行图片转base64方法
    this.base64(avatarUrl, type).then(res => {
      console.log(res, 'base64路径') //res是base64路径
      this.setData({
        avatar: res
      })
    })
    // console.log(avatar, '1');
  },
  handleInput(e) {
    console.log(e, '昵称');
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
    wx.redirectTo({
      url: '/pages/home/home' // 替换为你的首页路径
    });
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
   this.goHome()
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

  getPhoneNumber(e) {

    console.log(e.detail.code) // 动态令牌
    console.log(e.detail.errMsg) // 回调信息（成功失败都会返回）
    console.log(e.detail.errno) // 错误码（失败时返回）
    if (!e.detail.code) {
      this.disagree()
    } else {
      let phoneCode = e.detail.code
      let that =this
      wx.login({
        async success(res) {
          const wechatCode = res.code;
          // 2. 微信小程序发送请求，携带code，发送开发者服务器
          // 3. 开发者服务器响应token
          const inviteId = app.globalData.scene;
          const {
            customerId,
            token,
            newCustomer
          } = await loginApi({
            wechatCode,
            inviteId,phoneCode
          });
          console.log('登录');
          // 4. 微信小程序接受token，将其持久化存储起来，发送请求作为请求头参数携带上即可
          wx.setStorageSync('customerId', customerId); // 持久 读写速度慢
          wx.setStorageSync('accessToken', token);
          app.globalData.customerId = customerId; // 存在内存中 读写速度快 不够持久
          app.globalData.accessToken = token;
          that.setData({
            showfootCard:true
          })
        }
      })
    }
  },
  goHome() {
    // 在成功提示关闭后，你可以进行一些额外的操作，比如页面跳转等
    wx.redirectTo({
      url: '/pages/home/home' // 替换为你的首页路径
    });
  },
})