// pages/search/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
   q:""
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  var q=options.q;
  if(!q)
  q="滑板";
  this.setData({
    q
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
  onPageScroll: function (e) {
    e.scrollTop > this.data.clientY*2 ? this.scrollToTop.show() : this.scrollToTop.hide();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})