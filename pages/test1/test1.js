
Page({
/**
   * 页面的初始数据
   */
  data: {
    x:0,
    y:0
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
      var xVal = -(result.gamma).toFixed(2)/2.5;
      var yVal = -(result.beta - 30).toFixed(2)/2.5;
      self.setData({
        x: xVal > 10 ? 30 : (xVal < -10 ? -30 : xVal),
        y: yVal > 10 ? 10 : (yVal < -10 ? -10 : yVal),
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.demo()
  },

})

// Page({
//   data: {
//     rotateX: 0,
//     rotateY: 0
//   },
//   onLoad() {
//     wx.onGyroscopeChange((res) => {
//       const { beta, gamma } = res;
//       // 设置最大旋转角度范围
//       const maxAngle = 30;
      
//       // 将 beta 和 gamma 转换为适当的旋转角度
//       // beta 代表前后倾斜，控制 rotateX
//       // gamma 代表左右倾斜，控制 rotateY
//       const rotateX = this.limitAngle(beta, maxAngle);
//       const rotateY = this.limitAngle(gamma, maxAngle);

//       this.setData({
//         rotateX: rotateX,
//         rotateY: rotateY
//       });
//     });

//     // 开启陀螺仪监听
//     wx.startGyroscope({
//       interval: 'normal'
//     });
//   },
//   onUnload() {
//     // 页面卸载时停止陀螺仪监听
//     wx.stopGyroscope();
//   },
//   limitAngle(value, maxAngle) {
//     // 将角度限制在 -maxAngle 到 maxAngle 之间
//     return Math.max(-maxAngle, Math.min(value, maxAngle));
//   }
// });
