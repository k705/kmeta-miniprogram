Component({
  /**
   * 组件的属性列表
   */
  properties: {//传入的数据
    imagePath: {
      type: String
    },
    second: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    gifUrl:'https://wimg.588ku.com/gif620/21/09/23/e14212e58c7e5da94ef8fca48ecd202e.gif',
    timer: null
  },

  lifetimes: {
    created: function () {
     
    },
    attached: function () {
      //在JavaScript中，this关键字的指向是动态的，取决于函数的调用方式。
      //比如普通调用方式里面的this则是这个函数，箭头函数则指的是外面的
      //如果里面不需要调用该函数这个this对象而只是需要访问外面的this对象则可以使用箭头函数
      //在某些情况下，为了在回调函数或异步操作中能够访问到外部的this对象并且访问这个函数的this对象，
      //可以将外部的this对象赋值给一个变量，通常命名为that或self
      let that = this;

      //timer是一个表示定时器的变量，其类型是number
      //在JavaScript中，setInterval函数会返回一个唯一的定时器标识符，
      //可以通过这个标识符来清除定时器，即使用clearInterval(timer)来停止定时器的执行
      const timer = setInterval(function () {//因为这个地方相当于嵌套了一层
        let nowSecond = --(that.data.second);//时间自减1
        console.log(nowSecond);

        if (nowSecond <= 0) {//计时到0则关闭开屏控件
          clearInterval(timer);//关闭计时器
          that.hideOpenPage();//隐藏开屏页面
        }
       
        that.setData({//赋值当前秒数（触发视图更新）
          second: nowSecond,//将计时器变量赋值给页面变量timer，方便在其他函数内关闭该计时器
          timer: timer
        });
      }, 1000);//延时1s

    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏开屏控件
    hideOpenPage: function () {
      //触发hide的事件，在`index.wxml`内容里面设置了bind:hide="onMyEvent",
      //则调用`index.js`里面的onMyEvent方法
      this.triggerEvent("hide");
    },
    //跳过开屏页面
    skipOpenPage: function () {
      this.hideOpenPage();//先隐藏开屏控件
      let timer = this.data.timer;//获取计时器变量
      if (timer) {//避免计时器还没初始化但用户已经点击跳过的情况（感觉只有yyds的李跳跳才能做到了）
        clearInterval(timer);//关闭计时器
      }
    }
  }
})
