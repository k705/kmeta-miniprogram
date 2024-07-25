// pages/webview/index.js
Page({
  data: {
    url: "",
    dynamicTitle: '初始标题'
  },
  onLoad(options) {
    if(options.url){
      this.setData({
        // url: decodeURIComponent(options.url)  // 如果url后面还有参数需要转码一下否则会丢失
        url: options.url  // 如果url后面还有参数需要转码一下否则会丢失
      })
    }
    if(options.title){
       // 可以在这里获取动态数据，然后设置导航栏标题
    // 假设 dynamicTitle 是动态获取的标题
    const dynamicTitle = options.title;

    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: dynamicTitle
    });

    // 同时更新页面中的数据
    this.setData({
      dynamicTitle: dynamicTitle
    });
    }
  }

  
})
