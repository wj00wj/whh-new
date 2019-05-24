// pages/addperson/add.js
// import {
//   $wuxToptips
// } from '../../dist/index'
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
    cardUrl: '',
    name: "",
    sex: '',
    tel: '',
    identifyNo: '',
    birthday: '',
    idcardurl: [],
    otherurl: [],
    otherImg: '',
    controlled: false,
    forbide: false,
    regcardid: '',
    isIdentifyNo:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    this.setData({
      ids: options.id,
      // controlled: true
    })
    if (options.id != "" ) {
      wx.request({
        url: app.globalData.interfaceUrl + 'realcustomer/api/chginfo?id=' + options.id,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          var idcards = [];
          idcards.push({
            uid: 0,
            status: 'done',
            url: res.data.identifyImgPath,
          })
          
          _this.setData({
            styleArray: res.data,
            cardUrl: res.data.identifyImgPath,
            age: res.data.age,
            name: res.data.name,
            sex: res.data.sex,
            tel: res.data.tel,
            identifyNo: res.data.identifyNo,
            idcardurl: idcards
          });
          // console.log(res.data.otherImg)
          if (res.data.otherImg != undefined && res.data.otherImg != '') {
            var others = [];
            others.push({
              uid: 0,
              status: 'uploading',
              url: res.data.otherImg,
            })
            _this.setData({
              otherurl: others,
              otherImg: res.data.otherImg,
            });
          }
        }
      })
    }
  },
  radioChange: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },
  getname: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  getphone: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  getidnum: function (e) {
    var str = e.detail.value;
    if (str.length == 18) {
      var year = str.substring(6, 10);
      var month = str.substring(10, 12);
      var day = str.substring(12, 14);
      var _this=this;
      wx.request({
        url: app.globalData.interfaceUrl + '/realcustomer/api/submitable?ino='+e.detail.value,
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'get',
        success(res) {
          if (res.data.msg =='身份证号已经存在'){
            _this.setData({isIdentifyNo:false})
            $Message({
              content: res.data.msg,
              type: 'error',
              duration: 2
            });
          }else{
            _this.setData({ isIdentifyNo: true })
          }
        }
      })
      this.setData({
        identifyNo: e.detail.value,
        birthday: year + '/' + month + '/' + day
      })
    }
    // console.log(this.data.birthday)
  },
  subform(e) {
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
    } else if (this.data.tel == '' || this.data.tel.length != 11) {
      $Message({
        content: '手机号不正确！',
        type: 'error',
        duration: 2
      });
    } else if (this.data.identifyNo == '' || this.data.identifyNo.length != 18 || reg.test(this.data.identifyNo)==false) {
      $Message({
        content: '身份证号不正确！',
        type: 'error',
        duration: 2
      });
    } else if (this.data.isIdentifyNo == false) {
      $Message({
        content: '该用户已被其他业务经理服务！',
        type: 'error',
        duration: 2
      });
    } else if (this.data.cardUrl == '') {
      $Message({
        content: '身份证正面照不能为空！',
        type: 'error',
        duration: 2
      });
    } else {
      this.setData({
        forbide: true
      })
      
      wx.request({
        url: app.globalData.interfaceUrl + 'realcustomer/api/add', 
        data: {
          customer: {
            name: this.data.name,
            sex: this.data.sex,
            age: this.data.birthday,
            tel: this.data.tel,
            identifyNo: this.data.identifyNo,
            identifyImgPath: this.data.cardUrl,
            employId: app.globalData.userData.id,
            otherImg: this.data.otherImg
          }
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'post',
        success(res) {
          if (res.data.code == 0) {
            _this.setData({
              forbide: false
            })
            if (sta == 0) {
              wx.showToast({
                title: '成功',
                icon: 'succes',
                duration: 2000,
                mask: true,
                success: function () {
                  // if (getCurrentPages().length != 0) {
                  //   getCurrentPages()[getCurrentPages().length - 1].onShow()
                  // }
                  _this.setData({
                    tel: '',
                    sex: '',
                    name: '',
                    identifyNo:'',
                    cardUrl:'',
                    identifyImgPath: '',
                    idcardurl: [],
                    otherurl: [],
                    otherImg: ''
                  })
                }
              })
            } else {
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
  edit: function () {
    var reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    var _this = this
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
    } else if (this.data.tel == '' || this.data.tel.length != 11) {
      $Message({
        content: '手机号不能为空！',
        type: 'error',
        duration: 2
      });
    } else if (this.data.identifyNo == '' || this.data.identifyNo.length != 18 || reg.test(this.data.identifyNo) == false) {
      $Message({
        content: '身份证号不能为空！',
        type: 'error',
        duration: 2
      });
    } else if (this.data.isIdentifyNo == false) {
      $Message({
        content: '该用户已被其他业务经理服务！',
        type: 'error',
        duration: 2
      });
    }  else if (this.data.cardUrl == '') {
      $Message({
        content: '身份证正面照不能为空！',
        type: 'error',
        duration: 2
      });
    } else {
      this.setData({
        forbide: true
      })
      var ages=''
      if (this.data.birthday==''){
        ages=this.data.age
      }else{
        ages = this.data.birthday
      }
      wx.request({
        url: app.globalData.interfaceUrl + 'realcustomer/api/chginfo', 
        data: {
          customer: {
            id: this.data.ids,
            name: this.data.name,
            sex: this.data.sex,
            age: ages,
            tel: this.data.tel,
            identifyNo: this.data.identifyNo,
            identifyImgPath: this.data.cardUrl,
            employId: app.globalData.userData.id,
            otherImg: this.data.otherImg
          }
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'post',
        success(res) {
          if (res.data.code == 0) {
            _this.setData({
              forbide: false
            })
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
    }
  },
  onRemove(e) {
    const {
      file,
      fileList
    } = e.detail
    var which = e.currentTarget.dataset.info;
    wx.showModal({
      content: '确定删除？',
      success: (res) => {
        if (res.confirm) {
          if (which == 'idcard') {
            this.setData({
              idcardurl: fileList.filter((n) => n.uid !== file.uid),
              cardUrl:''
            })
          } else {
            this.setData({
              otherurl: fileList.filter((n) => n.uid !== file.uid),
              otherImg:""
            })
          }
          // this.setData({
          //   controlled: false
          // })
        } else {
          console.log(23)
        }
      },
    })
  },
  onChange(e) {
    // console.log('onChange', e)
    var which = e.currentTarget.dataset.info;
    const {
      file
    } = e.detail
    if (file.status === 'uploading') {
      wx.showLoading()
      var files=[]
      files.push(file)
      if (which =='idcard'){
        this.setData({
          idcardurl: files,
        })
      }else{
        this.setData({
          otherurl: files,
        })
      } 
    }
    // console.log(typeof(file))
  },
  onComplete(e) {
    // console.log('onComplete', e)
    var datas = e.detail.data;
    var jsons = JSON.parse(datas)
    var which = e.currentTarget.dataset.info;
    if (which == 'idcard') {
      this.setData({
        cardUrl: jsons.url
      })
    } else {
      this.setData({
        otherImg: jsons.url
      })
    }
    // this.setData({
    //   controlled: true
    // })
    wx.hideLoading()
    // console.log(this.data.cardUrl)
  },
  onSuccess(e) {
    // console.log('onSuccess', e)
  },
  onPreview(e) {
    // console.log('onPreview', e)
    const {
      file,
      fileList
    } = e.detail
    wx.previewImage({
      current: file.url,
      urls: fileList.map((n) => n.url),
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