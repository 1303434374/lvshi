var app = getApp();

Page({
    data: {
        curIndex: 0,
        city_id: 0,
        num: 0,
        light: "",
        kong: "",
        array: [ "美国", "中国", "巴西", "日本" ],
        fujian: []
    },
    bindPickerChange: function(e) {
        var a = this;
        console.log("picker发送选择改变，携带值为", e.detail.value);
        var n = a.data.city[e.detail.value].id, t = wx.getStorageSync("lat"), i = wx.getStorageSync("lng");
        app.util.request({
            url: "entry/wxapp/CityLawyers",
            cachetime: "0",
            data: {
                latitude: t,
                longitude: i,
                city_id: n
            },
            success: function(t) {
                a.setData({
                    index: e.detail.value,
                    city_id: n,
                    lawyers: t.data,
                    curIndex: 0
                });
            }
        });
    },
    goTap: function(t) {
        console.log(t);
        var e = this;
        e.setData({
            current: t.currentTarget.dataset.index
        }), 1 == e.data.current && wx.redirectTo({
            url: "../article/index?currentIndex=1"
        }), 0 == e.data.current && wx.redirectTo({
            url: "../shouye/index?currentIndex=0"
        }), 3 == e.data.current && wx.redirectTo({
            url: "../mine/index?currentIndex=3"
        });
    },
    onLoad: function(e) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/Getfjtype",
            cachetime: "0",
            success: function(t) {
                console.log(t.data);
                3 < t.data.length && a.setData({
                    limit: "min-width"
                }), a.setData({
                    category: t.data.result
                });
            }
        }), app.util.request({
            url: "entry/wxapp/tab",
            cachetime: "10",
            success: function(t) {
                a.setData({
                    tab: t.data,
                    current: e.currentIndex
                });
            }
        }), a.url();
        a.getfujian(0)
    },
    tabClick: function(t) {
        var e = this, a = t.currentTarget.dataset.id, n = e.data.city_id;
        // if (console.log(a), console.log(n), 0 == a && 0 == n) e.onShow(); else {
            // var i = wx.getStorageSync("lat"), r = wx.getStorageSync("lng");
            // app.util.request({
            //     url: "entry/wxapp/TypeIdData",
            //     cachetime: "0",
            //     data: {
            //         id: a,
            //         latitude: i,
            //         longitude: r,
            //         city_id: n
            //     },
            //     success: function(t) {
            //         console.log(t.data), e.setData({
            //             lawyers: t.data
            //         });
            //     }
            // });
        // }
        e.getfujian(a)
        e.setData({
            curIndex: t.currentTarget.dataset.index
        });
    },
    getfujian: function (id) {
        var e = this
        wx.getStorage({
            key: "openid",
            success: function (t) {
                console.log('openid='+t.data)
                app.util.request({
                    url: "entry/wxapp/Getfjid",
                    cachetime: "0",
                    data: {
                        openid: t.data
                    },
                    success: function (t) {
                        console.log(t.data)
                        let mine = t.data.result
                        app.util.request({
                            url: "entry/wxapp/getfujian",
                            cachetime: "0",
                            data: {
                                id: id
                            },
                            success: function(t) {
                                let list = t.data.result
                                list.forEach((value, index, array) => {
                                    var upFileName = value.downurl
                                    var index1=upFileName.lastIndexOf(".");
                                    var index2=upFileName.length;
                                    var suffix=upFileName.substring(index1+1,index2);
                                    value.format = suffix.toUpperCase()
                                    if (mine.length == 0) {
                                        value.state = 0
                                    } else {
                                        if (e.contains(mine,value.fid)) {
                                            value.state = 1
                                        } else {
                                            value.state = -1
                                        }
                                    }
                                })
                                console.log(t.data), e.setData({
                                    fujian: list
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    contains: function(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
            return true;
            }
        }
        return false;
    },
    url: function(t) {
        var e = this;
        app.util.request({
            url: "entry/wxapp/Url2",
            cachetime: "0",
            success: function(t) {
                wx.setStorageSync("url2", t.data);
            }
        }), app.util.request({
            url: "entry/wxapp/Url",
            cachetime: "0",
            success: function(t) {
                wx.setStorageSync("url", t.data), e.setData({
                    url: t.data
                });
            }
        });
    },
    freeConsult: function(t) {
        wx.navigateTo({
            url: "../consult/free"
        });
    },
    watchClassic: function(t) {
        0 == t.currentTarget.dataset.index && wx.navigateTo({
            url: "../yuyue/online"
        }), 1 == t.currentTarget.dataset.index && wx.navigateTo({
            url: "../consult/free"
        }), 2 == t.currentTarget.dataset.index && wx.navigateTo({
            url: "../consult/fufei"
        }), 3 == t.currentTarget.dataset.index && wx.makePhoneCall({
            phoneNumber: this.data.shopData.tel,
            success: function(t) {
                console.log("-----拨打电话成功-----");
            },
            fail: function(t) {
                console.log("-----拨打电话失败-----");
            }
        });
    },
    goDownload: function (event) {
        let that = this
        let id = event.currentTarget.dataset.id
        let url = event.currentTarget.dataset.url  
        let state = event.currentTarget.dataset.state  
        switch (state) {
            case 0:
                //免费下载
                wx.showModal({
                    tilte: '提示',
                    content: '您仅有一次免费下载的机会，是否确定下载此附件？',
                    showCancel: true,
                    success: (res) => {
                        if (res.confirm) {
                            this.downs(id,url)
                        } 
                    }
                })
                break
            case -1:
                //付费下载
                wx.showModal({
                    tilte: '提示',
                    content: '您是否确定支付所需费用下载此附件？',
                    showCancel: true,
                    success: (res) => {
                        if (res.confirm) {
                            let price = event.currentTarget.dataset.price
                            app.util.request({
                                url: "entry/wxapp/Orderarr",
                                cachetime: "30",
                                data: {
                                    openid: wx.getStorageSync('openid'),
                                    price: price
                                },
                                success: function(e) {
                                     wx.requestPayment({
                                        timeStamp: e.data.timeStamp,
                                        nonceStr: e.data.nonceStr,
                                        package: e.data.package,
                                        signType: "MD5",
                                        paySign: e.data.paySign,
                                        success: function(e) {
                                            // wx.getStorage({
                                            //     key: "openid",
                                            //     success: function(e) {
                                                    app.util.request({
                                                        url: "entry/wxapp/addmoney",
                                                        cachetime: "0",
                                                        data: {
                                                            price: price
                                                        },
                                                        success: function(e) {
                                                            console.log(e.data);
                                                            that.downs(id,url)
                                                            // var a = e.data.fid;
                                                            // console.log(a), app.util.request({
                                                            //     url: "entry/wxapp/Paysuccess",
                                                            //     cachetime: "0",
                                                            //     data: {
                                                            //         openid: t,
                                                            //         fid: a,
                                                            //         prepay_id: n
                                                            //     },
                                                            //     success: function(e) {
                                                            //         console.log(e.data), wx.navigateBack({});
                                                            //     }
                                                            // });
                                                        }
                                                    });
                                            //     }
                                            // });
                                        },
                                        fail: function(e) {}
                                    });
                                }
                            });
                        } 
                    }
                })
                break
            case 1:
                //直接打开
                app.util.request({
                    url: "entry/wxapp/Getfjdetail",
                    data: {
                        fjid: id,
                        openid: wx.getStorageSync('openid')
                    },
                    success: (t) => {
                        console.log(t)
                        this.showit(t.data.result.saveurl)
                    }
                });
                break
            default:
                break
        }
    }, 
  downs:function(id,url){
    let that=this;
    const downloadTask = wx.downloadFile({
      url: url, 
      success:(res) => {
          if (res.tempFilePath) {
              wx.hideLoading()
              console.log('临时地址=' + res.tempFilePath)
                wx.saveFile({
                    tempFilePath: res.tempFilePath,
                    success: (res) => {
                        console.log('本地地址='+res.savedFilePath);
                        let path = res.savedFilePath
                         app.util.request({
                            url: "entry/wxapp/Postfujian",
                            data: {
                                fjid: id,
                                openid: wx.getStorageSync('openid'),
                                saveurl: path
                            },
                            success: function(t) {
                                console.log(t)
                                let list = that.data.fujian
                                list.forEach((value, index, array) => {
                                    if (value.fid == id) {
                                        value.state = 1
                                    } else {
                                        if (value.state != 1) {
                                            value.state = -1
                                        }
                                    }
                                })
                                that.setData({
                                    fujian: list 
                                })
                                wx.showModal({
                                    tilte: '提示',
                                    content: '下载成功，可在我的附件中查看',
                                    showCancel: true,
                                    confirmText: '直接打开',
                                    success: (res) => {
                                        if (res.confirm) {
                                            that.showit(path)
                                        } 
                                    }
                                })
                            }
                        });
                    },
                    fail: (err) => {
                        console.log(err)
                    }
                }) 
            //   this.showit(res.tempFilePath)
          }
        // wx.saveFile({
        //   tempFilePath: res.tempFilePath,
        //   success: (res) => {
        //     console.log('保存地址='+savedFilePath);
        //     wx.setStorageSync('path', savedFilePath);
        //     that.setData({
        //       savapaths:savedFilePath
        //     });
        //     if (res) {
        //         console.log(res);
        //         wx.hideLoading()
        //         var savedFilePath = res.savedFilePath;
        //         this.showit(savedFilePath) 
        //     }
        //   }
        // })
      }
    })

    downloadTask.onProgressUpdate((res) => {
    //   console.log('下载进度', res.progress)
    //   console.log('已经下载的数据长度', res.totalBytesWritten)
    //   console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
        wx.showLoading({
            title: '已下载'+ res.progress + '%',
            mask: true
        })
    })
  },
  showit:function(e){
    // let getpath=e.currentTarget.dataset.d;
    // let getp=wx.getStorageSync('path');
    // if(getpath==''){
    //     getpath=getp;
    // }
    wx.openDocument({
      filePath: e,
      success: function (res) {
        console.log('打开文档成功')
      },
      fail: function (e) {
        console.log(e);
      }
    })
    
  }, 
    joinNow: function() {
        wx.navigateTo({
            url: "../active-list/details"
        });
    },
    goHongBao: function(t) {
        wx.navigateTo({
            url: "../hongbao/index"
        });
    },
    goQuestion: function(t) {
        wx.navigateTo({
            url: "../consult/fufei?id=" + t.currentTarget.dataset.id
        });
    },
    gofreeQues: function(t) {
        wx.navigateTo({
            url: "../consult/free"
        });
    },
    toYewuDetails: function(t) {
        wx.navigateTo({
            url: "../yewuDetails/yewuDetails"
        });
    },
    goLvshiIntro: function(t) {
        wx.navigateTo({
            url: "../lvshi-intro/lvshi-intro?id=" + t.currentTarget.dataset.id
        });
    },
    onReady: function() {},
    onShow: function() {
        // var e = this, t = wx.getStorageSync("lat"), a = wx.getStorageSync("lng");
        // app.util.request({
        //     url: "entry/wxapp/Alllawyers",
        //     cachetime: "0",
        //     data: {
        //         latitude: t,
        //         longitude: a
        //     },
        //     success: function(t) {
        //         console.log(t.data.data), e.setData({
        //             lawyers: t.data.data.hair,
        //             city: t.data.data.city,
        //             index: t.data.data.index,
        //             city_id: t.data.data.city_id
        //         });
        //     }
        // });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});