// pages/orderdetail/detail.js
//获取应用实例
const {
  $Message
} = require('../../disti/index');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '',
    detail: {},
    rejectinfor: {},
    modifyinfor: {},
    modifyinfors: {},
    comment: '',
    refunddetail:{},
    percentMoneys:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      status: options.status,
      id: options.id
    })
    console.log(this.data.id)
    if (this.data.status == 0) {
      this.detail()
    } else if (this.data.status == '已驳回') {
      this.queryReason()
      this.modify()
    } else if (this.data.status == '待退款'){
      this.refunddetailFuc()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  queryReason: function() {
    var _this = this
    wx.request({
      url: app.globalData.interfaceUrl + 'order/api/rejectinfo?id=' + this.data.id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        _this.setData({
          rejectinfor: res.data
        })
      }
    })
  },
  //查询修改订单需要的信息
  modify: function() {
    var _this = this;
    wx.request({
      url: app.globalData.interfaceUrl + 'order/api/apichginfo',
      data: {
        id: this.data.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        _this.setData({
          modifyinfors: res.data
        })
        if (res.data.comment!=undefined){
          _this.setData({
            comment: res.data.comment
          })
        }
        var info = res.data
        for (var i = 0; i < info.customers.length; i++) {
          console.log()
          info.customers[i].ages = _this.jsGetAge(info.customers[i].age, info.regiment.startTime)
        }
        _this.setData({
          modifyinfor: info
        })

      }
    })
  },

  detail: function() {
    var _this = this
    wx.request({
      url: app.globalData.interfaceUrl + 'order/api/showapidetail?id=' + this.data.id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        _this.setData({
          detail: res.data
        })
      }
    })
  },
  refunddetailFuc: function () {
    var _this = this
    wx.request({
      url: app.globalData.interfaceUrl + 'order/api/apprefundinfo?id=' + this.data.id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(re) {
        _this.setData({
          refunddetail: re.data
        })
        var percentMoney=0;
        var res = re.data
        if (res.refund != undefined && res.ticketRefund == undefined) {
          if (res.refund.money < 0) {
            percentMoney = res.money - res.refundMoney + res.refund.money;
          } else {
            percentMoney = res.money - res.refundMoney - res.refund.money;
          }
        } else if (res.refund == undefined && res.ticketRefund != undefined) {
          percentMoney = res.money - res.refundMoney + res.ticketRefund.money;
        } else if (res.refund != undefined && res.ticketRefund != undefined) {
          if (res.refund.money < 0) {
            percentMoney = res.money - res.refundMoney + res.ticketRefund.money + res.refund.money;
          } else {
            percentMoney = res.money - res.refundMoney + res.ticketRefund.money - res.refund.money;
          }
        } else {
          percentMoney = res.money - res.refundMoney;
        }
        console.log(percentMoney)
        _this.setData({
          percentMoneys: percentMoney
        })
      }
    })
  },
  getcomment: function(e) {
    this.setData({
      comment: e.detail.value
    })
  },
  modifySub: function() {
    var customerArray = []
    for (var i = 0; i < this.data.modifyinfor.customers.length; i++) {
      customerArray.push({
        id: this.data.modifyinfor.customers[i].id,
        age: this.data.modifyinfor.customers[i].age,
      })
    }
    var _this = this
    wx.request({
      url: app.globalData.interfaceUrl + 'order/api/apichgorder?',
      method: 'POST',
      data: {
        customers: customerArray,
        order: {
          id: this.data.modifyinfor.id,
          regimentId: this.data.modifyinfor.regimentId,
          comment: this.data.comment
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 0) {
          wx.navigateTo({
            url: '../success/success', //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
            success: function() {}, //成功后的回调；
            fail: function() {}, //失败后的回调；
            complete: function() {}, //结束后的回调(成功，失败都会执行)
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
  //参数strBirthday已经是正确格式的2017-12-12这样的日期字符串  
  jsGetAge: function(strBirthday,regimentData) {
    var returnAge;
    var strBirthdayArr = strBirthday.split("/");
    var birthYear = strBirthdayArr[0];
    var birthMonth = strBirthdayArr[1];
    var birthDay = strBirthdayArr[2];

    var d = regimentData.split("-");
    var nowYear = d[0];
    var nowMonth = d[1];
    var nowDay = d[2];
    if (nowYear == birthYear) {
      returnAge = 0; //同年 则为0岁  
    } else {
      var ageDiff = nowYear - birthYear; //年之差  
      if (ageDiff > 0) {
        if (nowMonth == birthMonth) {
          var dayDiff = nowDay - birthDay; //日之差  
          if (dayDiff < 0) {
            returnAge = ageDiff - 1;
          } else {
            returnAge = ageDiff;
          }
        } else {
          var monthDiff = nowMonth - birthMonth; //月之差  
          if (monthDiff < 0) {
            returnAge = ageDiff - 1;
          } else {
            returnAge = ageDiff;
          }
        }
      } else {
        returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天  
      }
    }
    // console.log(returnAge)
    return returnAge; //返回周岁年龄  
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log(1);
    this.onLoad();
    if (this.data.status == 0) {
      this.detail()
    } else if (this.data.status == '已驳回') {
      this.queryReason()
      this.modify()
    } else {}
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