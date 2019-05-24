// pages/detailOrder/detail.js
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
    id: '',
    detail: {},
    show: false,
    visible: false,
    reason: '',
    imgurl: app.globalData.interfaceUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      id: options.id
    })
    this.detail();
  },
  refund:function(){
    if(this.data.reason!=''){
      var _this=this
      var options={};
      options.id = this.data.id;
      wx.request({
        url: app.globalData.interfaceUrl + '/wx/unsubscribe.do?id=' + this.data.id +'&remark='+this.data.reason,
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'post',
        success(res) {
          if(res.data.code==0){
            wx.showToast({
              title: res.data.msg,
              icon: 'succes',
              duration: 2000,
              mask: true,
            })
            _this.setData({
              visible: false,
            });
            _this.onLoad(options);
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
              mask: true,
            })
          }
        },
        fail(res) {
          _this.setData({
            show: false
          })
        }
      })
    }else{
      $Message({
        content: '退单理由不能为空！',
        type: 'error',
        duration: 2
      });
    }
  },
  getreason: function(e) {
    this.setData({
      reason: e.detail.value
    })
  },
  opens(e) {
    this.setData({
      visible: true,
    })

  },
  // closes() {
    
  // },

  onClose(key) {
    this.setData({
      [key]: false,
    })
  },
  onCloses() {
    this.onClose('visible')
  },
  detail: function() {
    var _this = this
    console.log(this.data.id);
    wx.request({
      url: app.globalData.interfaceUrl + '/wx/orderDetail.do?id=' + this.data.id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'post',
      success(res) {
        console.log(res.data.travelOrder.travelVisitors[0].attachments);
        _this.setData({
          show: true,
          detail: res.data.travelOrder
        })
      },
      fail(res) {
        _this.setData({
          show: false
        })
      }
    })
  },
  goAdd: function(e) {
    var id = e.currentTarget.dataset.info
    var imgs = JSON.stringify(e.currentTarget.dataset.img)
    wx.navigateTo({
      url: '../adddata/data?id=' + id + '&img=' + imgs + '&detail=' + this.data.id
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
    this.detail();
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
    this.detail()
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