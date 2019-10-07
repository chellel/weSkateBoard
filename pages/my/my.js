// pages/my/my.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    isauth: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userdata: [{
      name: "我的关注",
      value: 0
    }, {
      name: "我的收藏",
      value: 0
    }, {
      name: "我的评论",
      value: 0
    }, {
      name: "我的点赞",
      value: 0
    }]
  },

  getUserInfo: function(e) {
    if (e.detail.errMsg && e.detail.errMsg === 'getUserInfo:fail auth deny') {
      this.setData({
        isauth: false
      })
    }
    if (JSON.stringify(this.data.userInfo) === '{}') {
      if (!e.detail.userInfo)
        return
      if (app.globalData.userInfo == null || JSON.stringify(app.globalData.userInfo) === '{}') {
        app.globalData.userInfo = e.detail.userInfo
        var userdata = this.data.userdata;
        userdata.map(item => {
          item.value = Math.floor(Math.random() * 200 + 1)
        })
        wx.setStorage({
          key: 'userdata',
          data: userdata,
        })
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true,
          userdata
        })
      }

    } else {
      wx.navigateTo({
        url: 'user/user',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
    var userdata = wx.getStorageSync("userdata")
    if (userdata) {
      this.setData({
        userdata: userdata
      })
    }
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
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }
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