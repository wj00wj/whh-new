// pages/product/product.js
let WxParse = require('../../wxParse/wxParse.js');
// var WxParses = require('../../wxParse/html2json.js');
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
    ids: '',
    tour:{},
    imgurl: app.globalData.interfaceUrl,
    pro: {},
    companyRule: [],
    customerRule: [],
    groupOne: {},
    dayList: [],
    dayArrays: [],
    regimentTimes: [],
    isMore: false,
    visible: false,
    isData: '0',
    sortName: '',
    lowPrice: '',
    upPrice: '',
    year: '',
    month: '',
    day: '',
    nobtn: true,
    orgaId: ''
  },
  onShareAppMessage: function() {
    var ids = this.data.ids
    var orgaId = this.data.orgaId
    return {
      title: this.data.pro.roadName,
      path: 'pages/product/product?ids=' + ids + '&orgaId=' + orgaId + '&btn=false',
      success: function(res) {
        wx.showToast({
          title: '万户候国旅',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function() {}
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    this.setData({
      ids: options.id,

      imgurl: app.globalData.interfaceUrl
      // sortName: options.sortName,
      // lowPrice: options.lowPrice,
      // upPrice: options.upPrice,
      // year: options.year,
      // month: options.month,
      // day: options.day,
      // orgaId: options.orgaId
    })
    //分享团期时，判断按钮是否存在
    // console.log(app.globalData.userData)
    // if (app.globalData.userData == undefined || app.globalData.userData == '') {
    //   this.setData({
    //     nobtn:false
    //   })
    // }

    var _this = this
    wx.request({
      url: app.globalData.interfaceUrl + '/wx/tourDetail.do?id=' + this.data.ids ,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        // 公司毁约条款

        wx.hideToast();
        _this.setData({
          tour:res.data.tour,
          groupOne: res.data.tour.tourGroups[0]
        })
        // let rulesC = res.data.violateRule.companyRule;
        // rulesC = rulesC.slice(0, rulesC.length - 1);
        // let cArray = rulesC.split(';')
        // let companyR = [];
        // for (let i = 0; i < cArray.length; i++) {
        //   let items = cArray[i].split('@!')
        //   companyR.push({
        //     days: items[0],
        //     percent: items[1]
        //   })
        // }
        // //个人毁约条款
        // let rulesU = res.data.violateRule.customerRule;
        // rulesU = rulesU.slice(0, rulesU.length - 1);
        // let UArray = rulesU.split(';')
        // let userR = [];
        // for (let i = 0; i < UArray.length; i++) {
        //   let ite = UArray[i].split('@!')
        //   userR.push({
        //     days: ite[0],
        //     percent: ite[1]
        //   })
        // }

        //团期array
        let pricelist = res.data.tour.tourGroups;
        // for (var m = 0; m < pricelist.length; m++) {
        //   pricelist[m].startTimes = pricelist[m].startTime.substring(5)
        //   // console.log(pricelist[m].startTime.substring(5))
        // }
        // //判断是否显示更多按钮
        if (pricelist.length > 4) {
          _this.setData({
            isMore: true
          })
        } else {
          _this.setData({
            isMore: false
          })
        }
        // var priceOrgin = res.data.regimentTimes[0]
        // priceOrgin.priceArray = priceOrgin.price.split('-');
        // var resJson = res.data;
        // resJson.beginCity = JSON.parse(resJson.beginCity)
        // _this.setData({
        //   pro: resJson,
        //   // companyRule: companyR,
        //   // customerRule: userR,
        //   priceOne: priceOrgin,
        //   regimentTimes: pricelist,

        // })
        // //判断是自定义
        // if (res.data.isCustomer == 0) {
        //   var content = res.data.roadCustomer.content;
        //   WxParse.wxParse('content', 'html', content, _this, 5);
        // } else {
        //   var days = res.data.roadStrokeInfos
        //   for (var i = 0; i < days.length; i++) {
        //     var ss = days[i].strokeContent.replace(/'/g, "").replace(/宋体/g, '"Microsoft YaHei"').replace(/<img/g, '<img style="max-width:100%;height:auto;margin-bottom:15rpx;" ').replace(/14.0pt/g, '50rpx').replace(/12.0pt/g, '50rpx').replace(/16.0pt/g, '50rpx').replace(/18.0pt/g, '50rpx').replace(/margin-right/g, 'rgin-right').replace(/u>/g, 'span>').replace(/<u/g, '<span')
        //     days[i].strokeContents = ss
        //   }
        //   _this.setData({
        //     dayList: days
        //   })
        // }
        // var advanceIntro = res.data.advanceIntro;
        // var costIntro = res.data.costIntro;
        // var roadFeature = res.data.roadFeature;
        // var roadIntro = res.data.roadIntro;

        // WxParse.wxParse('advanceIntro', 'html', advanceIntro, _this, 5);
        // WxParse.wxParse('costIntro', 'html', costIntro, _this, 5);
        // WxParse.wxParse('roadFeature', 'html', roadFeature, _this, 5);
        // WxParse.wxParse('roadIntro', 'html', roadIntro, _this, 5);
      }
    })
  },
  getDataBtn: function(e) {
    var i = e.currentTarget.dataset.info;
    var groups = this.data.tour.tourGroups[i]
    // prices.priceArray = prices.price.split('-')
    this.setData({
      groupOne: groups,
      isData: i
    })
  },
  goOrder: function() {
    // if (app.globalData.userData != undefined && app.globalData.userData != '') {
    var remainSeat = this.data.groupOne.outNumber - this.data.groupOne.applynum 
    if (remainSeat != 0 && app.globalData.login==1) {
        wx.navigateTo({
          url: '../addorder/addorder?id=' + this.data.groupOne.id + '&remainSeat=' + remainSeat + '&lineTypeId=' + this.data.tour.lineTypeId, //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
          success: function () { }, //成功后的回调；
          fail: function () { }, //失败后的回调；
          complete: function () { }, //结束后的回调(成功，失败都会执行)
        })
    } else if (app.globalData.login!=1){
      wx.navigateTo({
        url: '../login/login?product=1'
      })
      app.globalData.login=0
    } else {
        $Message({
          content: '余位不足！',
          type: 'error',
          duration: 2
        });
      }
    // } else {
    //   $Message({
    //     content: '请联系您的业务经理进行报名！',
    //     type: 'error',
    //     duration: 2
    //   });
    // }
  },
  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.groupOne.tourGroupPersons[0].phone 
    })
  },
  onClose(key) {
    // console.log('onClose')
    this.setData({
      [key]: false,
    })
  },
  open() {
    this.setData({
      visible: true,
    })
  },
  close() {
    this.setData({
      visible: false,
    })
  },
  onClosea() {
    this.onClose('visible')
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