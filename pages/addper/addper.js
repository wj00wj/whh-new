// pages/addper/addper.js
const {
$Message
} = require('../../disti/index');
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    identity: '',
    phone: '',
    passport: '',
    forbide: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  getidnum: function(e) {
    var i = e.currentTarget.dataset.info;
    // this.data.identity = e.detail.value
    this.setData({
      identity: e.detail.value
    })
  },
  getname: function(e) {
    var i = e.currentTarget.dataset.info;
    this.setData({
      name: e.detail.value
    })
  },
  getphone: function(e) {
    var i = e.currentTarget.dataset.info;
    this.setData({
      phone: e.detail.value
    })
  },
  getpassport: function(e) {
    var i = e.currentTarget.dataset.info;
    this.setData({
      passport: e.detail.value
    })
  },
  addPerson(e) {
    var reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/; //身份证
    var regPhone = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/ //手机号
    var regName = /^(([\u4e00-\u9fa5]+)|([a-zA-Z· ]+))$/ //姓名
    var regpassport = /^([a-zA-z]|[0-9]){5,17}$/ //护照
    var _this = this;
    var sta = false;
    var iscard = this.checkCard(this.data.identity)
    if (this.data.name == '' || regName.test(this.data.name) == false) {
      $Message({
        content: '出行人姓名不合规则！',
        type: 'error',
        duration: 2
      });
      return false;
    } else if (this.data.identity == '' || iscard==false ) {
      $Message({
        content: '出行人身份证号不合规则！',
        type: 'error',
        duration: 2
      });
      return false;
    } else if (this.data.phone == '' || regPhone.test(this.data.phone) == false) {
      $Message({
        content: '出行人手机号不合规则！',
        type: 'error',
        duration: 2
      });
      return false;
    } else if (this.data.passport != '') {
      if (regpassport.test(this.data.passport) == false){
        $Message({
          content: '出行人护照号不合规则！',
          type: 'error',
          duration: 2
        });
        return false;
      }else{
        this.sub()
      }
    } else{
      this.sub()
    }
  },
  sub:function(){
    var _this=this
    this.setData({
      forbide: true
    })
    wx.showLoading({
      title: '拼命提交中...',
    })

    wx.request({
      url: app.globalData.interfaceUrl + '/wx/addCustomerBySale.do?tel=' + app.globalData.tel + '&name=' + this.data.name + '&identity=' + this.data.identity + '&phone=' + this.data.phone + '&passport=' + this.data.passport,
      method:'post',
      // data: {
      //   openid: app.globalData.openid,
      //   name: this.data.name,
      //   identity: this.data.identity,
      //   phone: this.data.phone,
      //   passport: this.data.passport,
      // },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        _this.setData({
          forbide: false
        })
        wx.hideLoading();
        if (res.data.code == 0) {
          wx.navigateTo({
            url: '../personlist/list', //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
            success: function () { }, //成功后的回调；
            fail: function () { }, //失败后的回调；
            complete: function () { }, //结束后的回调(成功，失败都会执行)
          })
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
  checkCard: function (card) {
    card = card.toLowerCase();
    var vcity = {
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆",
      71: "台湾",
      81: "香港",
      82: "澳门",
      91: "国外"
    };
    var arrint = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    var arrch = new Array('1', '0', 'x', '9', '8', '7', '6', '5', '4', '3', '2');
    var reg = /(^\d{15}$)|(^\d{17}(\d|x)$)/;
    if (!reg.test(card)) return false;
    if (vcity[card.substr(0, 2)] == undefined) return false;
    var len = card.length;
    if (len == 15)
      reg = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
    else
      reg = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|x)$/;
    var d, a = card.match(new RegExp(reg));
    if (!a) return false;
    if (len == 15) {
      d = new Date("19" + a[2] + "/" + a[3] + "/" + a[4]);
    } else {
      d = new Date(a[2] + "/" + a[3] + "/" + a[4]);
    }
    if (!(d.getFullYear() == a[2] && (d.getMonth() + 1) == a[3] && d.getDate() == a[4])) return false;
    if (len = 18) {
      len = 0;
      for (var i = 0; i < 17; i++) len += card.substr(i, 1) * arrint[i];
      return arrch[len % 11] == card.substr(17, 1);
    }
    return true;
    console.log(56)
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