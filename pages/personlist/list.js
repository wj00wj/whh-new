// pages/personlist/list.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.globalData.interfaceUrl,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    //获取客户列表
    wx.request({
      url: app.globalData.interfaceUrl + '/wx/selectCustomerListBySale.do?tel=' + app.globalData.tel,
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
        if (res.data.code == 0) {
          _this.setData({
            list: res.data.customers
          })
        }
      }
    })
  },
  goadd:function() {
    wx.navigateTo({
      url: '../addper/addper'
    })
  },
  goAddData:function(e){
    var id = e.currentTarget.dataset.info
    var imgs = JSON.stringify(e.currentTarget.dataset.img);
    console.log(id);
    wx.navigateTo({
      url: '../adddata/data?id=' + id + '&img=' + imgs + '&list=1'
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
    this.onLoad();
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