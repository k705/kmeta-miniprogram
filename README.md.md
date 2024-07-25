# 想法
## 加震动效果
## 加订阅提醒
## 加K界
## 加一键点击



# 2024.2.28

## 1. 完成内容

### K集-区块大奖
### 二级页面-区块大奖抢兑
### 二级页面-区块大奖解密

## 2. use
### 高斯模糊：CSS 的 backdrop-filter 属性
```css
Copy code
.blur-container {
  width: 200rpx;
  height: 200rpx;
  background-image: url('path/to/your/image.jpg');
  backdrop-filter: blur(10rpx);
  /* 备用方案：半透明背景色 */
  background-color: rgba(255, 255, 255, 0.5);
}
```


### 置灰效果：CSS 的 filter 属性中的 grayscale 值来实现

```css
.button {
  width: 200rpx;
  height: 80rpx;
  background-color: #007AFF;
  color: #FFFFFF;
  font-size: 32rpx;
  border-radius: 10rpx;
  text-align: center;
  line-height: 80rpx;
}

.disabled {
  filter: grayscale(1);
}

```





<!-- 2. 路由跳转两种方式：

- 声明式
  - navigator
- 编程式
  - wx.navigateTo (push)
  - wx.redirectTo (replace)
  - wx.navigateBack (back)

> 注意：小程序历史记录最多 10 层 -->


