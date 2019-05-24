//logs.js
// const util = require('../../utils/util.js')
const {
  $Message
} = require('../../disti/index');


//获取应用实例
const app = getApp()
Page({
  data: {
    // logs: []
    name: '',
    list: [],
    visible: false,
    refundAll: 0,
    orderPerson: [],
    refundPerson: [],
    refundmoney: 0,
    refundid: '',
    noworder: '',
    nodata: true
  },
  onLoad: function(options) {
    this.list();
  },
  onShow: function() {
   // if (app.globalData.order == 'success') {
      this.list();
    //}
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      name: ""
    })
    if(app.globalData.login==1){
      this.list('0')
    }else{
      wx.navigateTo({
        url: '../login/login'
      })
      app.globalData.login = 0
    }
  },
  send:function(e){
    var _this=this;
    console.log("发送合同签署");
      wx.request({
        url: app.globalData.interfaceUrl + '/wx/signEContract.do?id=' + e.currentTarget.dataset.info,
        header: {
          'content-type': "application/json"
        },
        data:{
          id: e.currentTarget.dataset.info
        },
        method: 'post',
        success: function (res) {
          if (res.data.result == true) {
            $Message({
              content: '发送成功！',
              type: 'success',
              duration: 2
            });
            _this.list();
          } else {
            $Message({
              content: '发送失败！',
              type: 'error',
              duration: 2
            });
          }
        },
        fail: function (res) {

        }
      })
  },
  ressend:function(e){
      wx.request({
        url: app.globalData.interfaceUrl + '/wx/resendSms.do?id='+e.currentTarget.dataset.info,
        header: {
          'content-type': "application/json"
        },
        method: 'post',
        data: {
          id: e.currentTarget.dataset.info
        },
        success:function(res){
            if(res.data.result == true){
              $Message({
                content: '发送成功！',
                type: 'success',
                duration: 2
              });
            }else{
              $Message({
                content: '发送失败！',
                type: 'error',
                duration: 2
              });
            }
        },
        fail:function(res){

        }
      })
  },
  supplyressend:function(e) {
    wx.request({
      url: app.globalData.interfaceUrl + '/wx/resendSupplySms.do?id=' + e.currentTarget.dataset.info,
      header: {
        'content-type': "application/json"
      },
      method: 'post',
      data: {
        id: e.currentTarget.dataset.info
      },
      success: function (res) {
        if (res.data.result == true) {
          $Message({
            content: '发送成功！',
            type: 'success',
            duration: 2
          });
        } else {
          $Message({
            content: '发送失败！',
            type: 'error',
            duration: 2
          });
        }
      },
      fail: function (res) {

      }
    })
  },
  ressendsms: function (e) {
    wx.request({
      url: app.globalData.interfaceUrl + '/wx/resendInvalidSms.do?id=' + e.currentTarget.dataset.info,
      header: {
        'content-type': "application/json"
      },
      method: 'post',
      data: {
        id: e.currentTarget.dataset.info
      },
      success: function (res) {
        if (res.data.result == true) {
          $Message({
            content: '发送成功！',
            type: 'success',
            duration: 2
          });
        } else {
          $Message({
            content: '发送失败！',
            type: 'error',
            duration: 2
          });
        }
      },
      fail: function (res) {

      }
    })
  },
  handlePerson: function({
    detail = {}
  }) {
    console.log(detail)
    const index = this.data.refundPerson.indexOf(detail.value);
    index === -1 ? this.data.refundPerson.push(detail.value) : this.data.refundPerson.splice(index, 1);
    this.setData({
      refundPerson: this.data.refundPerson
    });
    var refundid = ''
    var refundmoney = ''
    for (var m = 0; m < this.data.orderPerson.length; m++) {
      for (var i = 0; i < this.data.refundPerson.length; i++) {
        if (this.data.orderPerson[m].name == this.data.refundPerson[i]) {
          refundid += "cid=" + this.data.orderPerson[m].id + "&"
          refundmoney += "ids=" + this.data.orderPerson[m].id + "&"
        }
      }
    }
    refundid += "oid=" + this.data.noworder
    refundmoney += "oid=" + this.data.noworder
    this.setData({
      refundid: refundid
    })
    if (this.data.refundPerson.length != 0) {
      this.cutmoney(refundmoney)
    } else {
      this.setData({
        refundmoney: 0
      })
    }

  },
  queryReason: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../orderdetail/detail?status=已驳回&id=' + id
    })
  },
  refundDetail: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../orderdetail/detail?status=待退款&id=' + id
    })
  },
  list: function(pull) {
    console.log(this.data.name);
    console.log(app.globalData.openid);
    var _this = this;
    wx.request({
     // url: app.globalData.interfaceUrl + '/wx/orderList.do?name=' + this.data.name + '&openid=' + app.globalData.openid+'&rows=100&page=1',

      url: app.globalData.interfaceUrl + '/wx/orderList.do?name=' + this.data.name + '&tel=' + app.globalData.tel + '&rows=100&page=1',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'get',
      success(res) {
        console.log(res)
        if (res.data.total== 0) {
          _this.setData({
            nodata: true
          })
        } else {
          _this.setData({
            nodata: false
          })
        }
        _this.setData({
          list: res.data.travelOrders
        })
        if (pull != undefined) {
          wx.stopPullDownRefresh();
          wx.showToast({
            title: '刷新成功',
            duration: 1500
          })
        }
      }
    })
  },
  cancle: function(e) { //取消订单
    var ids = e.currentTarget.dataset.id
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '确认取消订单',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.interfaceUrl + 'order/api/cancel',
            data: {
              id: ids
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              if (res.data.code == 0) {
                wx.showToast({
                  title: '成功',
                  icon: 'succes',
                  duration: 2000,
                  mask: true
                })
                _this.list()
              } else {
                $Message({
                  content: res.data.msg,
                  type: 'error',
                  duration: 2
                });
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  refund: function() {
    var _this = this
    if (this.data.refundPerson.length ==0){
      $Message({
        content: '至少选择一个客户！',
        type: 'error',
        duration: 2
      });
    }else if (this.data.refundPerson.length == this.data.orderPerson.length) {
      wx.request({
        url: app.globalData.interfaceUrl + 'order/api/refund',
        method: 'POST',
        data: {
          id: this.data.noworder
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
              mask: true
            })
            _this.list();
            _this.setData({
              visible: false
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
    } else {
      wx.request({
        url: app.globalData.interfaceUrl + 'order/api/partialrefund?' + this.data.refundid,
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: '成功',
              icon: 'succes',
              duration: 2000,
              mask: true
            })
            _this.list();
            _this.setData({
              visible: false
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
    }
  },
  cutmoney: function(datas) {
    var _this = this
    wx.request({
      url: app.globalData.interfaceUrl + 'order/api/calmoney?' + datas,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        _this.setData({
          refundmoney: res.data.toFixed(1)
        })
      }
    })
  },
  getname: function(e) {
    // console.log(e)
    this.setData({
      name: e.detail.value
    })
    console.log(this.data.name)
    this.list()
  },
  cancelname: function() {
    this.setData({
      name: ""
    })
    this.list()
    console.log(243)
  },
  clearname: function() {
    this.setData({
      name: ""
    })
    this.list()
    console.log(23)
  },
  onClose(key) {
    // console.log('onClose')
    this.setData({
      [key]: false,
    })
  },
  open(e) {
    var _this = this;
    this.setData({
      orderPerson: [],
      refundPerson: []
    })
    var ids = e.currentTarget.dataset.id
    wx.request({
      url: app.globalData.interfaceUrl + 'order/api/customers?id=' + ids,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var cur = []
        for (var i = 0; i < res.data.length; i++) {
          cur.push(res.data[i].name)
        }
        _this.setData({
          orderPerson: res.data,
          refundPerson: cur,
          noworder: ids
        })
        var da = ''
        for (var i = 0; i < res.data.length; i++) {
          da += "ids=" + res.data[i].id + '&'
        }
        da += "oid=" + ids;
        _this.cutmoney(da)
      }
    })
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
  }
})