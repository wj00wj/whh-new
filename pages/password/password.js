// pages/password/password.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password:'',
    pass:'',
    visible:'0',
    focuss:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  gets: function (e) {
    var val = e.detail.value;
    this.setData({
      password: val,
      pass:val
    });
  },
  seeno:function(){
    this.setData({
      focuss: false,
      visible: '1'
    });
  },
  see: function () {
    this.setData({
      focuss: false,
      visible: '0'
    });
  },

  password: function () {
    wx.request({
      url: app.globalData.interfaceUrl + '/wx/modifyPsw.do',
      method:'POST',
      data: {
        password: this.data.password,
        id: app.globalData.userData.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '成功',
            icon: 'succes',
            duration: 2000,
            mask: true,
            success: function () {
              wx.navigateBack({
                changed: true
              }); //返回上一页
            }
          })
        }
      }
    })
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

  }
})