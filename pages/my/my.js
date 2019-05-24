//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userData: {},
    islogin: 2   //改成全局参数
  },
  loginOut: function() {
    app.globalData.userData = null;
    app.globalData.login = 0;
    
    this.onLoad();
  },
  goLogin: function() {
    wx.navigateTo({
      url: '../login/login'
    })
  }, 
  goAdd: function () {
    wx.navigateTo({
      url: '../personlist/list'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      userData: app.globalData.userData,
      islogin: app.globalData.login
    })
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
    this.onLoad();
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