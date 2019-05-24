
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
    phone: '',
    password: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isProduct:2 //是否是从产品详情页跳转过来的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.product==1){
      this.setData({
        isProduct: 1
      })
    }
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        // console.log(res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getphone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getpass: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  logins: function() {
    var chat=this;
    wx.request({
      url: app.globalData.interfaceUrl + '/wx/login.do?tel=' + this.data.phone + "&openid=" + app.globalData.openid + "&password=" + this.data.password,
      method: 'POST',
      // data: {
      //   tel: this.data.phone,
      //   openid: app.globalData.openid,
      //   password: this.data.password
      // },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        if (res.data.code == 0) {
          console.log(res.data.data);
          app.globalData.userData = res.data.data
          
          app.globalData.tel = res.data.data.tel

          console.log(app.globalData.tel+"---------------")
          app.globalData.login = 1
          // if(this.data.isProduct==1){
          //   wx.showToast({
          //     title: '成功',
          //     icon: 'succes',
          //     duration: 2000,
          //     mask: true,
          //     success: function () {
          //       wx.navigateBack({ changed: true }) //返回上一页
          //     }
          //   })
          // }else{
            wx.showToast({
              title: '成功',
              icon: 'succes',
              duration: 2000,
              mask: true,
              success: function () {
                if (chat.data.isProduct==1){
                  wx.navigateBack({ changed: true }) //返回上一页
                }else{
                  wx.switchTab({
                    url: '../my/my'
                  })
                }
              }
            })
          // }
          
        } else {
          $Message({
            content: res.data.msg,
            type: 'error',
            duration: 2
          });
        }
      }
    })
  },
  getUserInfo: function(e) {
    // console.log(e.detail.errMsg)
    // console.log(e.detail.userInfo)
    // console.log(e.detail.rawData)
    //如果同意获取则进入登录
    if (e.detail.errMsg == 'getUserInfo:ok') {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})