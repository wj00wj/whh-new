//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    // motto: 'Hello World',
    
    list: [],
    imgurl: app.globalData.interfaceUrl,
    loadenable: true,
    visible1: false,
    nomore: false,
    errors: true,
    login:false,
    visible2: false,
    visible3: false,
    visible4: false,
    dateArray: [],
    styleArray: [],
    tourName:'',
    lineTypeId:'',
    isStyle: "",
    isDate: "",
    isMoney: "",
    isDay: "",
    lowPrice: '',
    upPrice: '',
    year: '',
    month: '',
    originId:'',
    version:true,//提交新版本的时候可以修改为ture，从而重新请求登录接口
  },

  onLoad: function() {
    this.setData({
      imgurl: app.globalData.interfaceUrl
    })
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    //设置往后六个月的数组
    var data = new Date();
    var year = data.getFullYear();
    var mon = data.getMonth() + 1;
    var arry = [year + "年" + mon + "月"];
    if (mon == 12) {
      year = year + 1
    }
    for (var i = 0; i < 4; i++) {
      mon = mon + 1;
      if (mon > 12) {
        mon = mon - 12;
      }
      arry.push(year + "年" + mon + "月");
    }
    this.setData({
      dateArray: arry
    })
    
    
    //this.wxlogin()
  },
  getsort:function(){
    var _this=this
    //获取产品类别
    wx.request({
      url: app.globalData.interfaceUrl + 'prosort/all',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        _this.setData({
          styleArray: res.data
        })
      }
    })
  },
  onShow: function () {

    this.getList()
    //this.wxlogin()
    // if (app.globalData.login == "success") {
      // this.getList('', '', '', '', '', '')
      // this.getsort()
    // }
  },
  wxlogin:function(){
    // console.log(app.globalData.userData)
    // if (app.globalData.userData == null||this.data.version==true) {
      var _this = this
      wx.login({
        //获取临时5分钟的登录code
        success(res) {
          if (res.code) {
            // 根据code得到openid和session_key
            wx.request({
              url: app.globalData.interfaceUrl + '/wx/getopenid.do?code=' + res.code,
              method: 'POST',
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                //用openid登录
                var openid = res.data.openid;
                var session_key = res.data.session_key;
                app.globalData.openid = openid;//存入全局参数
                app.globalData.session_key = session_key
                wx.request({
                  url: app.globalData.interfaceUrl + '/wx/openlogin.do?openid=' + openid,
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  success(res) {
                    console.log(res.data.code)
                    //用openid登录
                    if (res.data.code == 0) {
                      app.globalData.userData = res.data.data
                      app.globalData.login = 1
                      _this.setData({
                        login:false,
                        
                        // orgaId: app.globalData.userData.orgaId
                      })
                      
                      // _this.getsort()
                      //用openid登录成功，存下用户信息
                      
                    } 
                    // else if (res.data.code == 1) {
                    //   wx.navigateTo({
                    //     url: '../login/login'
                    //   })
                    //   _this.setData({
                    //     login:true
                    //   })
                    //   //登录不成功跳转到登录页面
                    // } 
                    else {
                      // wx.showToast({
                      //   title: res.data.msg,
                      //   icon: 'none',
                      //   duration: 2000,
                      //   mask: true
                      // })
                      // _this.setData({
                      //   // login: true,
                      //   orgaId: ""
                      // })
                    }
                  }
                })
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    // } 
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getList('0')
    this.setData({
      isStyle: "",
      isDate: "",
      isMoney: "",
      isDay: "",
      lowPrice: '',
      upPrice: '',
      year: '',
      month: '',
    })
  },
  
  ///获取团期列表
  getList: function(pull) {
    var _this = this
    wx.request({
      url: app.globalData.interfaceUrl + '/wx/tourList.do?name=' + this.data.tourName + '&page=1&rows=100&originId=' + this.data.originId + '&lineTypeId=' + this.data.lineTypeId,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideToast();
        _this.setData({
          errors: true,
          styleArray: res.data.tourTypes,
          tourOrigins: res.data.tourOrigins,
          list: res.data.tours,
        })
        if (res.data.tours.length == 0) {
          _this.setData({
            nomore: true
          })
        }else{
          _this.setData({
            nomore: false
          })
        }
        if(pull!=undefined){
          wx.stopPullDownRefresh();
          wx.showToast({
            title: '刷新成功',
            duration: 1500
          })
        }
      },
      fail(){
        _this.setData({
          errors:false
        })
      }
    })
  },
  getname: function (e) {
    console.log(e.detail.value)
    this.setData({
      tourName: e.detail.value
    })
    this.getList()
  },
  cancelname: function () {
    this.setData({
      tourName: ""
    })
    this.getList()
  },
  clearname: function () {
    this.setData({
      tourName: ""
    })
    this.getList()
  },
  styleOn(e) {
    this.setData({
      lineTypeId: e.currentTarget.dataset.info,
    })
    this.getList()
    this.setData({
      visible1: false
    })
  },
  dateOn(e) {
    // var datas = e.currentTarget.dataset.info;
    // if (datas!=""){
    //   var arrays = datas.split('年');
    //   this.setData({
    //     year: arrays[0],
    //     month: parseInt(arrays[1])
    //   })
    // }else{
    //   this.setData({
    //     year: "",
    //     month: ""
    //   })
    // }
    this.setData({
      originId: e.currentTarget.dataset.info
    })
    this.getList()
    this.setData({
      visible2: false
    })
  },
  moneyOn(e) {
    var datas = e.currentTarget.dataset.info;
    this.setData({
      isMoney: e.currentTarget.dataset.info
    })
    if(datas!=''){
      var arrays = datas.split('~');
      this.setData({
        upPrice: arrays[1],
        lowPrice: arrays[0]
      })
    }else{
      this.setData({
        upPrice: "",
        lowPrice: ""
      })
    }
    this.getList(this.data.isStyle, this.data.lowPrice, this.data.upPrice, this.data.isDay, this.data.year, this.data.month)
    this.setData({
      visible3: false
    })
  },
  dayOn(e) {
    this.setData({
      isDay: e.currentTarget.dataset.info,
    })
    this.getList(this.data.isStyle, this.data.lowPrice, this.data.upPrice, this.data.isDay, this.data.year, this.data.month)
    this.setData({
      visible4: false
    })
  },
  onClose(key) {
    this.setData({
      [key]: false,
    })
  },
  open1() {
    this.setData({
      visible1: true,
      visible2: false,
      visible3: false,
      visible4: false,
    })
  },
  close1() {
    this.setData({
      visible1: false,
    })
  },
  onClose1() {
    this.onClose('visible1')
  },
  open2() {
    this.setData({
      visible1: false,
      visible2: true,
      visible3: false,
      visible4: false,
    })
  },
  close2() {
    this.setData({
      visible2: false,
    })
  },
  onClose2() {
    this.onClose('visible2')
  },
  open3() {
    this.setData({
      visible1: false,
      visible2: false,
      visible3: true,
      visible4: false,
    })
  },
  close3() {
    this.setData({
      visible3: false,
    })
  },
  onClose3() {
    this.onClose('visible3')
  },
  open4() {
    this.setData({
      visible1: false,
      visible2: false,
      visible3: false,
      visible4: true,
    })
  },
  close4() {
    this.setData({
      visible4: false,
    })
  },
  onClose4() {
    this.onClose('visible4')
  }
})