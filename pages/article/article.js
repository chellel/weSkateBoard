// pages/article/article.js
const api = require("../../utils/api.js");
var WxParse = require("../../utils/wxParse/wxParse.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
article:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
    api.POST(getApp().globalData.connectUrl +"api/getArticlebyId",{id:options.id}).then(res => {
      var that = this;
      wx.hideLoading()
      this.setData({
        article: res.data
      })
      var content = res.data.content;
      WxParse.wxParse('content', 'html', content, that);
    })
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