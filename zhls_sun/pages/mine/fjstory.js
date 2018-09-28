var app = getApp();

Page({
  data: {
    mentData:[]
  },
  onLoad: function (t) {
    var n = this;
    wx.setNavigationBarColor({
      frontColor: wx.getStorageSync("fontcolor"),
      backgroundColor: wx.getStorageSync("color"),
      animation: {
        duration: 0,
        timingFunc: "easeIn"
      }
    }), wx.getStorage({
      key: "openid",
      success: function (t) {
        app.util.request({
          url: "entry/wxapp/Getuserfujian",
          cachetime: "0",
          data: {
            openid: t.data
          },
          success: function (t) {
            console.log(t.data.result), n.setData({
              mentData: t.data.result
            });
          }
        });
      }
    });
  },
  onShow: function (t) {
    
  },
  openfj:function(e){
    wx.showLoading({
      title: '加载中...',
    })
    let pjpath = e.currentTarget.dataset.path;
    console.log('点击得到' + pjpath);
    wx.openDocument({
      filePath: pjpath,
      success: function (res) {
        wx.hideLoading();
        console.log('打开文档成功')
      },
      fail: function (e) {
        console.log(e);
      }
    })
  },
  copeurl:function(e){
    let downloadpath = e.currentTarget.dataset.downurl;
    wx.setClipboardData({
      data: downloadpath,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  onReady: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { }
});