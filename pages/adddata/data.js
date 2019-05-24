const {
  $Message
} = require('../../disti/index');
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadedImages1: '',
    uploadedImages2: '',
    uploadedImages3: '',
    uploadedImages4: '',
    uploadedImages5: '',
    imgBoolean1: true,
    imgBoolean2: true,
    imgBoolean3: true,
    imgBoolean4: true,
    imgBoolean5: true,
    ispersonlist : 0,//跳转方向
    id:'',//出游人id
    detail:'', //订单id
    imgs:[] //图片集合
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      imgurl: app.globalData.interfaceUrl,
      imgs: JSON.parse(options.img)
    })
    this.getImg(this.data.imgs);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getImg: function (imgsrc) {
    console.log(imgsrc);
    var chat = this;
    for (var i = 0; i < imgsrc.length;i++){
          if (imgsrc[i].type==1){
            chat.setData({
              item1: app.globalData.interfaceUrl +'/m_showImg.do?path='+imgsrc[i].path,
              uploadedImages1: imgsrc[i].id,
              imgBoolean1 :false
            })
          } else if (imgsrc[i].type == 2) {
            chat.setData({
              item2: app.globalData.interfaceUrl + '/m_showImg.do?path=' +imgsrc[i].path,
              uploadedImages2: imgsrc[i].id,
              imgBoolean2: false
            })
          } else if (imgsrc[i].type == 3) {
            chat.setData({
              item3: app.globalData.interfaceUrl + '/m_showImg.do?path=' +imgsrc[i].path,
              uploadedImages3: imgsrc[i].id,
              imgBoolean3: false
            })
          } else if (imgsrc[i].type == 4) {
            chat.setData({
              item4: app.globalData.interfaceUrl + '/m_showImg.do?path=' +imgsrc[i].path,
              uploadedImages4: imgsrc[i].id,
              imgBoolean4: false
            })
          } else if (imgsrc[i].type == 5) {
            chat.setData({
              item5: app.globalData.interfaceUrl + '/m_showImg.do?path=' +imgsrc[i].path,
              uploadedImages5: imgsrc[i].id,
              imgBoolean5: false
            })
          }
        }
  },
  chooseImage1: function () {
    var that = this;
    console.log(that.data.id);
    // 选择图片
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.interfaceUrl + '/uploadWX.aspx', // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            sid: that.data.id,
            type: 1
          },
          success(res) {
            // do something
            var obj = JSON.parse(res.data);
            if(res.statusCode == 200){
              that.setData({
                item1: tempFilePaths[0],
                imgBoolean1: false,
                uploadedImages1 : obj.id
              });
              app.globalData.order= 'success';
            }
          }
        })
      }
    })
  },
  // 图片预览
  previewImage1: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
  //删除图片
  deleteImg1: function (e) {
    var that = this;
    var images = that.data.uploadedImages1;
    wx.showModal({
      content: '确定删除？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.interfaceUrl + '/deletePicture.do?id=' + images,
            method: 'post',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              if (res.data == true) {
                console.log(res.data)
                that.setData({
                  uploadedImages1: '',
                  imgBoolean1: true
                });
              }
            }
          })
        } else {
          // console.log(23)
        }
      }
    })
  },
  chooseImage2: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          item2: tempFilePaths[0],
          imgBoolean2: false
        });
        wx.uploadFile({
          url: app.globalData.interfaceUrl + '/uploadWX.aspx', // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            sid: that.data.id,
            type: 2
          },
          success(res) {
            // do something
            var obj = JSON.parse(res.data);
            if (res.statusCode == 200) {
              that.setData({
                item2: tempFilePaths[0],
                imgBoolean2: false,
                uploadedImages2: obj.id
              });
            }
          }
        })
      }
    })
  },
  // 图片预览
  previewImage2: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
  //删除图片
  deleteImg2: function (e) {
    var that = this;
    var images = that.data.uploadedImages2;
    wx.showModal({
      content: '确定删除？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.interfaceUrl + '/deletePicture.do?id=' + images,
            method: 'post',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              if (res.data == true) {
                console.log(res.data)
                that.setData({
                  uploadedImages2: '',
                  imgBoolean2: true
                });
              }
            }
          })
        } else {
          // console.log(23)
        }
      }
    })
  },
  chooseImage3: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          item3: tempFilePaths[0],
          imgBoolean3: false
        });
        wx.uploadFile({
          url: app.globalData.interfaceUrl + '/uploadWX.aspx', // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            sid: that.data.id,
            type: 3
          },
          success(res) {
            // do something
            var obj = JSON.parse(res.data);
            if (res.statusCode == 200) {
              that.setData({
                item3: tempFilePaths[0],
                imgBoolean3: false,
                uploadedImages3: obj.id
              });
            }
          }
        })
      }
    })
  },
  // 图片预览
  previewImage3: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
  //删除图片
  deleteImg3: function (e) {
    var that = this;
    var images = that.data.uploadedImages3;
    wx.showModal({
      content: '确定删除？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.interfaceUrl + '/deletePicture.do?id=' + images,
            method: 'post',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              if (res.data == true) {
                console.log(res.data)
                that.setData({
                  uploadedImages3: '',
                  imgBoolean3: true
                });
              }
            }
          })
        } else {
          // console.log(23)
        }
      }
    })
  },
  chooseImage4: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          item4: tempFilePaths[0],
          imgBoolean4: false
        });
        wx.uploadFile({
          url: app.globalData.interfaceUrl + '/uploadWX.aspx', // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            sid: that.data.id,
            type: 4
          },
          success(res) {
            // do something
            var obj = JSON.parse(res.data);
            if (res.statusCode == 200) {
              that.setData({
                item4: tempFilePaths[0],
                imgBoolean4: false,
                uploadedImages4: obj.id
              });
            }
          }
        })
      }
    })
  },
  // 图片预览
  previewImage4: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
  //删除图片
  deleteImg4: function (e) {
    var that = this;
    var images = that.data.uploadedImages4;
    wx.showModal({
      content: '确定删除？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.interfaceUrl + '/deletePicture.do?id=' + images,
            method: 'post',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              if (res.data == true) {
                console.log(res.data)
                that.setData({
                  uploadedImages4: '',
                  imgBoolean4: true
                });
              }
            }
          })
        } else {
          // console.log(23)
        }
      }
    })
  },
  chooseImage5: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          item5: tempFilePaths[0],
          imgBoolean5: false
        });
        wx.uploadFile({
          url: app.globalData.interfaceUrl + '/uploadWX.aspx', // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            sid: that.data.id,
            type: 5
          },
          success(res) {
            // do something
            var obj = JSON.parse(res.data);
            if (res.statusCode == 200) {
              that.setData({
                item5: tempFilePaths[0],
                imgBoolean5: false,
                uploadedImages5: obj.id
              });
            }
          }
        })
      }
    })
  },
  // 图片预览
  previewImage5: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
  //删除图片
  deleteImg5: function (e) {
    var that = this;
    var images = that.data.uploadedImages5;
    wx.showModal({
      content: '确定删除？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.interfaceUrl + '/deletePicture.do?id=' + images,
            method: 'post',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              if (res.data == true) {
                console.log(res.data)
                that.setData({
                  uploadedImages5: '',
                  imgBoolean5: true
                });
              }
            }
          })
        } else {
          // console.log(23)
        }
      }
    })
  }
})