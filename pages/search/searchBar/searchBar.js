// pages/search/searchBar/searchBar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: "",
    relatedSearchData: ["滑板", "长板", "滑板鞋", "滑板场", "滑板新手"],
    suggestData: []
  },

  clearInput: function() {
    this.setData({
      inputVal: ""
    });
    this.setData({
      suggestData: []
    })

  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
    this.getSuggestData(e.detail.value);
  },
  relatedClick(e) {
    var value = e.currentTarget.dataset.value;
    this.setData({
      inputVal: value
    })
    this.search(value);
  },
  getSuggestData(value) {
    var limit = 20;
    var searchUrl = `https://www.zhihu.com/api/v4/search_v3?t=general&q=${value}&correction=1&offset=0&limit=${limit}&lc_idx=0&show_all_topics=0`;
    var suggestUrl = "https://www.zhihu.com/api/v4/search/suggest?q=" + value;
    wx.request({
      url: suggestUrl,
      method: "GET",
      success: (res) => {
        this.setData({
          suggestData: res.data.suggest
        })

      }
    })
  },
  suggestClick(e) {
    var value = e.currentTarget.dataset.value;
    debugger
    this.search(value);
  },
  /**搜索 */
  search(q) {
    wx.navigateTo({
      url: '/pages/search/index/index?q=' + q,
    })
  },
  cancel() {
    wx.navigateBack({})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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