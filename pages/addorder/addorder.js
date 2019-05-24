// pages/addorder/addorder.js
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
    noneAdjust:1,//按钮点击次数,
    noneT:true,
    isadjust: true,
    formlist: [],
    lineTypeId: '',
    remainSeat: '',
    comment: '',
    forbide: false,
    customerList: [],
    currentPerson: 100,
    currentIndex:[],
    visible: false,
    nowPersonIndex:100,   //当前选择第几个出行人的索引值
    imgurl: app.globalData.interfaceUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      ids: options.id,
      remainSeat: options.remainSeat,
      lineTypeId: options.lineTypeId
    })
    if (options.lineTypeId == 'fe16c3e9-0885-422a-8657-bd27b01b8c91') {
      this.data.formlist.push({
        id: '',
        name: '',
        personType: '',
        identity: '',
        phone: '',
        passport: '',
        isSign: 0,
        disabled: false
      })
      this.setData({
        formlist: this.data.formlist
      })
    } else {
      this.data.formlist.push({
        id: '',
        name: '',
        personType: '',
        identity: '',
        phone: '',
        isSign: 0,
        disabled: false
      })
      this.setData({
        formlist: this.data.formlist
      })
    }
    this.getpersons()
  },
  addPerson: function() {
    var _this=this;
    if (this.data.formlist.length == this.data.remainSeat) {
      $Message({
        content: '余位不足！',
        type: 'error',
        duration: 2
      });
    } else {
      var isAlg = false;
      var i = _this.data.noneAdjust;
      i++;
      _this.data.noneAdjust=i;
      if (_this.data.noneAdjust%2==0){
        _this.setData({
          noneT:false,
          isadjust:true
        })
      }else{
        _this.setData({
          noneT: true
        })
      }
      for (var m = 0; m < this.data.formlist.length; m++) {
        if (this.data.formlist[m].isSign == 1) {
          isAlg = true;
        }
      }
      if (this.data.lineTypeId == 'fe16c3e9-0885-422a-8657-bd27b01b8c91') {
        if(!isAlg){
          this.data.formlist.push({
            id: '',
            name: '',
            personType: '',
            identity: '',
            phone: '',
            passport: '',
            isSign: 0,
            disabled: false
          })

        }else{
          this.data.formlist.push({
            id: '',
            name: '',
            personType: '',
            identity: '',
            phone: '',
            passport: '',
            isSign: 0,
            disabled: true
          })
        }
        
        this.setData({
          formlist: this.data.formlist
        })
      } else {
        if(!isAlg){
          this.data.formlist.push({
            id: '',
            name: '',
            personType: '',
            identity: '',
            phone: '',
            isSign: 0,
            disabled: false
          })
        }else{
          this.data.formlist.push({
            id: '',
            name: '',
            personType: '',
            identity: '',
            phone: '',
            isSign: 0,
            disabled: true
          })
        }
        this.setData({
          formlist: this.data.formlist
        })
      }
    }

  },
  delPerson: function(e) {
    if (this.data.formlist.length > 1) {
      var i = e.currentTarget.dataset.info;
      this.data.formlist.splice(i, 1);
      this.setData({
        formlist: this.data.formlist
      });
      var _this = this;
      var i = _this.data.noneAdjust;
      i++;
      _this.data.noneAdjust = i;
      if (_this.data.noneAdjust % 2 == 0) {
        _this.setData({
          noneT: false,
          isadjust:true
        })
      } else {
        _this.setData({
          noneT: true
        })
      }
    }
  },
  adjustChange({
    detail = {}
  }) {
    this.setData({
      isadjust: detail.current
    });
  },
  signChange: function (e) {//签署代表 0:不签署 1：签署
      var i = e.currentTarget.dataset.info
      var flag = e.detail.current;
      if (flag) {
        this.data.formlist[i].isSign = 1;
        for (var k = 0; k < this.data.formlist.length; k++) {
          if (i != k) {
            this.data.formlist[k].disabled = true
          }
        }
      } else {
        this.data.formlist[i].isSign = 0;
        for (var k = 0; k < this.data.formlist.length; k++) {
          this.data.formlist[k].disabled = false
        }
      }
      this.setData({
        formlist: this.data.formlist
      })
  },
  getcomment: function(e) {
    this.setData({
      comment: e.detail.value
    })
  },
  radioChange: function(e) {
    var i = e.currentTarget.dataset.info;
    this.data.formlist[i].personType = e.detail.value
    this.setData({
      formlist: this.data.formlist
    })
  },
  getidnum: function(e) {
    var i = e.currentTarget.dataset.info;
    this.data.formlist[i].identity = e.detail.value
    this.setData({
      formlist: this.data.formlist
    })
  },
  getname: function(e) {
    var i = e.currentTarget.dataset.info;
    this.data.formlist[i].name = e.detail.value
    this.setData({
      formlist: this.data.formlist
    })
  },
  getphone: function(e) {
    var i = e.currentTarget.dataset.info;
    this.data.formlist[i].phone = e.detail.value
    this.setData({
      formlist: this.data.formlist
    })
  },
  getpassport: function(e) {
    var i = e.currentTarget.dataset.info;
    this.data.formlist[i].passport = e.detail.value
    this.setData({
      formlist: this.data.formlist
    })
  },
  setOrder(e) {
    var reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/; //身份证
    var regPhone = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/ //手机号
    var regName = /^(([\u4e00-\u9fa5]+)|([a-zA-Z· ]+))$/ //姓名
    var regpassport = /^([a-zA-z]|[0-9]){5,17}$/ //护照
    var _this = this;
    var sta = false;
    var len = this.data.formlist.length
    var isSingFlag = false;
    for (var i = 0; i < this.data.formlist.length; i++) {
      var iscard = this.checkCard(this.data.formlist[i].identity)
      if (this.data.formlist[i].isSign == 1) {
        isSingFlag = true;
      }
      if (this.data.formlist[i].name == '' || regName.test(this.data.formlist[i].name) == false) {
        $Message({
          content: '出行人' + (i + 1) + '姓名不合规则！',
          type: 'error',
          duration: 2
        });
        return false;
      } else if (this.data.formlist[i].personType == '') {
        $Message({
          content: '出行人' + (i + 1) + '请选择人员类型！',
          type: 'error',
          duration: 2
        });
        return false;
      } else if (this.data.formlist[i].identity == '' || iscard==false) {
        $Message({
          content: '出行人' + (i + 1) + '身份证号不合规则！',
          type: 'error',
          duration: 2
        });
        return false;
      } else if (this.data.formlist[i].phone == '' || regPhone.test(this.data.formlist[i].phone) == false) {
        $Message({
          content: '出行人' + (i + 1) + '手机号不合规则！',
          type: 'error',
          duration: 2
        });
        return false;
      } else if (this.data.formlist[i].passport != undefined && regpassport.test(this.data.formlist[i].passport) == false) {
        $Message({
          content: '出行人' + (i + 1) + '护照号不合规则！',
          type: 'error',
          duration: 2
        });
        return false;
      } else {
        if (i == len - 1) {
          sta = true
          console.log(sta)
        }
      }
    }
    if (!isSingFlag) {
      $Message({
        content: '签署代表人必须选择一人!',
        type: 'error',
        duration: 2
      });
      return false;
    }
    var isad = 1;
    if (this.data.isadjust) {
      isad = 1
    } else {
      isad = 2
    }
    if (sta) {
      this.setData({
        forbide: true
      })
      wx.showLoading({
        title: '拼命提交中...',
      })
      var orderObj = new Object();
      orderObj.id = ''
      orderObj.gid = this.data.ids
      orderObj.adjust = isad
      orderObj.applyRemark = this.data.comment
      console.log(orderObj);
      wx.request({
        url: app.globalData.interfaceUrl + '/wx/reserveApply.do',
        data: {
          openid: app.globalData.openid,
          tel:app.globalData.tel,
          visitInfo: JSON.stringify(this.data.formlist),
          orderInfo: JSON.stringify(orderObj)
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'get',
        success(res) {
          _this.setData({
            forbide: false
          })
          wx.hideLoading()
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
    }
  },
  chosePer(e) {
    this.onChange('currentPerson', e)
    var nowindex = this.data.nowPersonIndex
    var curIndex = this.data.currentPerson
    if (this.data.lineTypeId == 'fe16c3e9-0885-422a-8657-bd27b01b8c91'){
      this.data.formlist[nowindex].id = this.data.customerList[curIndex].id
      this.data.formlist[nowindex].name = this.data.customerList[curIndex].name
      this.data.formlist[nowindex].identity = this.data.customerList[curIndex].identity
      this.data.formlist[nowindex].personType = ''
      this.data.formlist[nowindex].phone = this.data.customerList[curIndex].phone
      this.data.formlist[nowindex].passport = this.data.customerList[curIndex].passport
      // this.data.formlist[nowindex].attachments = this.data.customerList[curIndex].attachments
    }else{
      this.data.formlist[nowindex].id = this.data.customerList[curIndex].id
      this.data.formlist[nowindex].name = this.data.customerList[curIndex].name
      this.data.formlist[nowindex].identity = this.data.customerList[curIndex].identity
      this.data.formlist[nowindex].personType = ''
      this.data.formlist[nowindex].phone = this.data.customerList[curIndex].phone
      // this.data.formlist[nowindex].attachments = this.data.customerList[curIndex].attachments
    }
    this.setData({
      formlist:this.data.formlist
    })
  },
  onChange(field, e) {
    this.setData({
      [field]: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  goAddData: function (e) {
    var id = e.currentTarget.dataset.info
    var imgs = JSON.stringify(e.currentTarget.dataset.img)
    wx.navigateTo({
      url: '../adddata/data?id=' + id + '&img=' + imgs + '&list=1'
    })
  },
  // chosePer: function ({
  //   detail = {}
  // }) {
  //   const index = this.data.currentPerson.indexOf(detail.value);
  //   const indexNum = this.data.currentIndex.indexOf(detail.index);
  //   if (this.data.currentIndex.length < this.data.remainSeat || index !== -1) {
  //     index === -1 ? this.data.currentPerson.push(detail.value) : this.data.currentPerson.splice(index, 1);
  //     indexNum === -1 ? this.data.currentIndex.push(detail.index) : this.data.currentIndex.splice(indexNum, 1);
  //   } else {
  //     $Message({
  //       content: '余位不足',
  //       type: 'error',
  //       duration: 2
  //     });
  //   }

  //   this.setData({
  //     currentPerson: this.data.currentPerson,
  //     currentIndex: this.data.currentIndex
  //   });
  // },
  getpersons: function() {
    var _this = this;
    //获取客户列表
    wx.request({
      url: app.globalData.interfaceUrl + '/wx/selectCustomerListBySale.do?tel=' + app.globalData.tel,
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 0) {
          _this.setData({
            customerList: res.data.customers
          })
        }
      }
    })
  },
  opens(e) {
    this.setData({
      nowPersonIndex: e.currentTarget.dataset.info
    })
    // console.log(this.data.customerList.length)
    if (this.data.customerList.length != 0) {
      this.setData({
        visible: true,
      })
    } else {
      wx.showToast({
        title: '您还未添加过任何客户！',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    }
  },
  closes() {
    this.setData({
      visible: false,
    })
  },

  onClose(key) {
    this.setData({
      [key]: false,
    })
  },
  onCloses() {
    this.onClose('visible')
  },
  checkCard: function(card) {
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