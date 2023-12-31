// pages/responsive/responsive.js
const QRCode = require('../../utils/weapp-qrcode.js')
import rpx2px from '../../utils/rpx2px.js'
let qrcode;

// 300rpx 在6s上为 150px
const qrcodeWidth = rpx2px(300)

Page({
  data: {
    text: '',
    image: '',
    // 用于设置wxml里canvas的width和height样式
    qrcodeWidth: qrcodeWidth,
    imgsrc: ''
  },
  onLoad: function(options) {},
  onReady() {
    const z = this
    qrcode = new QRCode('canvas', {
      usingIn: this, // usingIn 如果放到组件里使用需要加这个参数
      // text: "https://github.com/tomfriwel/weapp-qrcode",
      image: '/images/bg.jpg',
      width: qrcodeWidth,
      height: qrcodeWidth,
      colorDark: "black",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });

    // 生成图片，绘制完成后调用回调
    qrcode.makeCode(z.data.text, () => {
      // 回调
      setTimeout(() => {
        qrcode.exportImage(function(path) {
          z.setData({
            imgsrc: path
          })
        })
      }, 200)
    })
  },
  confirmHandler: function(e) {
    let {
      value
    } = e.detail
    this.renderQRCode(value)
  },
  renderQRCode(value) {
    const z = this
    console.log('make handler')
    qrcode.makeCode(value, () => {
      console.log('make')
      qrcode.exportImage(function(path) {
        console.log(path)
        z.setData({
          imgsrc: path
        })
      })
    })
  },
  inputHandler: function(e) {
    var value = e.detail.value
    this.setData({
      text: value
    })
  },
  convertTapHandler: function() {
    this.renderQRCode(this.data.text)
  },
  clearTapHandler: function() {
    this.setData({text: ''})
  },
  // 长按保存
  save: function() {
    console.log('save')
    wx.showActionSheet({
      itemList: ['保存图片', '转发'],
      success: function(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          qrcode.exportImage(function(path) {
            wx.saveImageToPhotosAlbum({
              filePath: path,
            })
          })
        } else if (res.tapIndex == 1) {
          qrcode.exportImage(function(path) {
            wx.showShareImageMenu({
              path: path,
              // needShowEntrance: 'true',
              success() {
                wx.showToast({
                  title: '分享成功',
                  icon: 'success',
                  duration: 2000,
                });
              },
              fail(e) {
                console.log(e, '分享失败');
              },
            })
          })
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  }
})