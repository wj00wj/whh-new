// pages/setorder/setorder.js
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
    regimentId: '',
    startTime: '',
    priceArray: [],
    favourablePrice: '',
    remainSeat: '',
    childPrice: '',
    customerList: [],
    customers: [], //提交订单时的array
    customerCount: 0, //提交订单时的出行人总数
    showlist: [], //页面中已选择列表
    showall: 0,
    customerName: [],
    visible: false,
    visibleadd: false,
    currentPerson: [],
    currentIndex: [],
    comment: '',
    childList: [],
    childrens: [],
    childName: [],
    sex: '',
    name: '',
    identifyNo: '',
    birthday: '',
    forbide: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      regimentId: options.id,
      startTime: options.startTime,
      priceArray: options.price.split('-'),
      remainSeat: options.remainSeat,
    })
    console.log(options.childprice)
    if (options.childprice == undefined || options.childprice == 'undefined') {
      this.setData({
        childPrice: 0
      })
    }else{
      this.setData({
        childPrice: options.childprice
      })
    }
    this.getpersons()
  },

  getpersons: function() {
    var _this = this;
    //获取客户列表
    wx.request({
      url: app.globalData.interfaceUrl + 'realcustomer/api/employcutomers',
      data: {
        id: app.globalData.userData.id,
        name: '',
        rid: this.data.regimentId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        _this.setData({
          customerList: res.data
        })
      }
    })
  },
  chosePer: function({
    detail = {}
  }) {
    const index = this.data.currentPerson.indexOf(detail.value);
    const indexNum = this.data.currentIndex.indexOf(detail.index);
    if (this.data.currentIndex.length < this.data.remainSeat || index !== -1) {
      index === -1 ? this.data.currentPerson.push(detail.value) : this.data.currentPerson.splice(index, 1);
      indexNum === -1 ? this.data.currentIndex.push(detail.index) : this.data.currentIndex.splice(indexNum, 1);
    } else {
      $Message({
        content: '余位不足',
        type: 'error',
        duration: 2
      });
    }

    this.setData({
      currentPerson: this.data.currentPerson,
      currentIndex: this.data.currentIndex
    });
    var resultArray = []
    var allMoney = 0
    var customersArray = []
    var customerNameArray = []
    for (var i = 0; i < this.data.currentIndex.length; i++) {
      var itemi = this.data.customerList[this.data.currentIndex[i]]
      var nowage = this.jsGetAge(itemi.age, this.data.startTime)
      var price = 0
      if (nowage < 60) {
        price = this.data.priceArray[0]
      } else if (nowage < 65 && nowage >= 60) {
        price = this.data.priceArray[1]
      } else if (nowage < 70 && nowage >= 65) {
        price = this.data.priceArray[2]
      } else {
        price = this.data.priceArray[3]
      }
      allMoney += parseInt(price)
      
      resultArray.push({
        name: itemi.name,
        age: nowage,
        price: price,
        id: itemi.id
      })
      customersArray.push({
        realId: itemi.id,
        children: '否'
      })
      customerNameArray.push(itemi.name)
    }
    if (this.data.childList.length != 0) {
      allMoney += parseInt(this.data.childPrice) * this.data.childList.length
    }
    this.setData({
      showlist: resultArray,
      customerCount: this.data.currentIndex.length,
      showall: allMoney,
      customers: customersArray,
      customerName: customerNameArray
    })
  },

  //添加儿童
  addChild(e) {
    var reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

    var _this = this;
    var sta = e.currentTarget.dataset.stas;
    if (this.data.name == '') {
      $Message({
        content: '姓名不能为空！',
        type: 'error',
        duration: 2
      });
    } else if (this.data.sex == '') {
      $Message({
        content: '性别不能为空！',
        type: 'error',
        duration: 2
      });
    } else if (this.data.identifyNo == '' || this.data.identifyNo.length != 18 || reg.test(this.data.identifyNo) == false) {
      $Message({
        content: '身份证号不正确！',
        type: 'error',
        duration: 2
      });
    } else {
      this.setData({
        forbide: true
      })
      wx.showLoading({
        title: '提交中，请稍后',
      })
      wx.request({
        url: app.globalData.interfaceUrl + '/realcustomer/api/insertchild',
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'post',
        data: {
          customer: {
            name: this.data.name,
            sex: this.data.sex,
            age: this.data.birthday,
            identifyNo: this.data.identifyNo
          }
        },
        success(res) {
          _this.setData({
            forbide: false
          })
          wx.hideLoading()
          var nowage = _this.jsGetAge(_this.data.birthday, _this.data.startTime)
          if (res.data.code == 0) {
            _this.data.childList.push({
              name: _this.data.name,
              age: nowage,
              price: _this.data.childPrice,
              id: res.data.msg
            })

            _this.data.childrens.push({
              realId: res.data.msg,
              children: '是'
            })
            _this.data.childName.push(_this.data.name)
            _this.setData({
              childList: _this.data.childList,
              childrens: _this.data.childrens,
              childName: _this.data.childName,
              customerCount: _this.data.customerCount + 1,
              showall: _this.data.showall + parseInt(_this.data.childPrice)
            })
            _this.onCloseadd() //关闭窗口
            //置空表单
            _this.setData({
              name: "",
              sex: "",
              identifyNo: ""
            })
            $Message({
              content: "添加成功",
              type: 'error',
              duration: 2
            });
          } else {
            $Message({
              content: "添加失败，请重试",
              type: 'error',
              duration: 2
            });
          }
        }
      })


    }
  },
  radioChange: function(e) {
    this.setData({
      sex: e.detail.value
    })
  },
  getname: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  getidnum: function(e) {
    var str = e.detail.value;
    if (str.length == 18) {
      var year = str.substring(6, 10);
      var month = str.substring(10, 12);
      var day = str.substring(12, 14);

      this.setData({
        identifyNo: e.detail.value,
        birthday: year + '-' + month + '-' + day
      })
      var childage = this.jsGetAge(this.data.birthday, this.data.startTime)
      if (childage > 14) {
        $Message({
          content: "超过儿童年龄，请核对身份信息!",
          type: 'error',
          duration: 7
        });
        //如果儿童年龄超过14周岁禁用提交按钮
        this.setData({
          forbide: true
        })
      } else {
        this.setData({
          forbide: false
        })
      }
    }
    // console.log(this.data.birthday)
  },

  //移除出行人
  removePerson: function(e) {
    var i = e.currentTarget.dataset.info;
    var prices = this.data.showlist[i].price
    this.data.showlist.splice(i, 1)
    this.data.customers.splice(i, 1)
    this.data.customerName.splice(i, 1)
    this.data.currentIndex.splice(i, 1)
    this.data.currentPerson.splice(i, 1)
    this.setData({
      customerCount: this.data.customerCount - 1,
      showlist: this.data.showlist,
      showall: this.data.showall - parseInt(prices),
      customers: this.data.customers,
      customerName: this.data.customerName,
      currentPerson: this.data.currentPerson,
      currentIndex: this.data.currentIndex
    })
  },
  //移除儿童
  removechild: function(e) {
    var i = e.currentTarget.dataset.info;
    this.data.childList.splice(i, 1)
    this.data.childrens.splice(i, 1)
    this.data.childName.splice(i, 1)
    this.setData({
      customerCount: this.data.customerCount - 1,
      childrens: this.data.childrens,
      childName: this.data.childName,
      showall: this.data.showall - parseInt(this.data.childPrice),
      childList: this.data.childList
    })
  },
  //提交订单
  setOrder: function() {
    if (this.data.customerName.length != 0) {
      if (this.data.childList.length != 0) {
        if (this.data.comment != '') {
          this.subOrder()
        } else {
          $Message({
            content: '请添加儿童监护人信息！',
            type: 'error',
            duration: 7
          });
        }
      } else {
        this.subOrder()
      }
    } else {
      $Message({
        content: '请选择出行人！',
        type: 'error',
        duration: 2
      });
    }
  },
  subOrder: function() {
    wx.showToast({
      title: '拼命提交中...',
      icon: 'loading',
      duration: 8000
    })
    var nameArray=this.data.customerName.concat(this.data.childName)

    console.log(nameArray)
    var customerArray=this.data.customers.concat(this.data.childrens)
    console.log(customerArray)
    // this.setData({
    //   customers:this.data.customers,
    //   customerName: this.data.customerName
    // })
    var customerNames = nameArray.join('/')
    wx.request({
      url: app.globalData.interfaceUrl + 'order/api/add',
      method: 'POST',
      data: {
        customers: customerArray,
        order: {
          regimentId: this.data.regimentId,
          customerCount: this.data.customerCount,
          employId: app.globalData.userData.id,
          customerName: customerNames,
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
  getcomment: function(e) {
    this.setData({
      comment: e.detail.value
    })
  },
  opens() {
    this.setData({
      visible: true,
    })
  },
  openAdd() {
    if (this.customerCount + 1 > this.remainSeat) {
      $Message({
        content: '余位不足，可联系计调处理',
        type: 'error',
        duration: 2
      });
    } else {
      this.setData({
        visibleadd: true
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
  onCloseadd() {
    this.onClose('visibleadd')
  },
  //JS根据出生日期 得到年龄                 
  //参数strBirthday已经是正确格式的2017-12-12这样的日期字符串  
  jsGetAge: function(strBirthday, regimentData) {
    var returnAge;
    var strBirthdayArr = strBirthday.split("-");
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
    return returnAge; //返回周岁年龄  
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
    this.getpersons()
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