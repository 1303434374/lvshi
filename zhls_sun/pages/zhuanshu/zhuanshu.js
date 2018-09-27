var app = getApp();

Page({
    data: {
        num: 0,
        light: "",
        kong: "",
        detail: [],
        nav: 0
    },
    onLoad: function(t) {
        wx.setStorageSync("id", 0), this.url();
        var a = this
        app.util.request({
            url: "entry/wxapp/Getzhuanshu",
            cachetime: "0",
            success: function(t) {
                console.log(t.data), a.setData({
                    detail: t.data.result,
                    content1: a.escape2Html(t.data.result.desc),
                    content2: a.escape2Html(t.data.result.linyu)
                });
            }
        });
    },
    escape2Html: function (str) {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
  },
    url: function(t) {
        var a = this;
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
                wx.setStorageSync("url", t.data), a.setData({
                    url: t.data
                });
            }
        });
    },
    gozixun: function(t) {
        wx.navigateTo({
            url: "../consult/fufei?id=" + t.currentTarget.dataset.id
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},

    tap_tel: function (event) {
        wx.makePhoneCall({
            phoneNumber: event.currentTarget.dataset.tel
        })
    },

    tap_code: function (event) {
        wx.previewImage({
            urls: [event.currentTarget.dataset.url]
        })
    },

    tap_nav: function (event) {
      let id = event.currentTarget.dataset.id
        this.setData({
            nav: id
        })
   }
});