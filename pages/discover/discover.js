// pages/discover/discover.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
dataSource1:[
  { id: 1, imgUrl: "https://chellel.github.io/myblog/skateboard/image%20(1).jpg" },
  { id: 2, imgUrl: "https://chellel.github.io/myblog/skateboard/image%20(2).jpg" },
  { id: 3, imgUrl: "https://chellel.github.io/myblog/skateboard/image%20(3).jpg" }
  
],
    dataSource2:[
      { id: 1, imgUrl: "https://chellel.github.io/myblog/skateboard/image%20(1).jpg" },
      { id: 2, imgUrl: "https://chellel.github.io/myblog/skateboard/image%20(2).jpg" },
      { id: 3, imgUrl: "https://chellel.github.io/myblog/skateboard/image%20(3).jpg" },
      { id: 4, imgUrl: "https://chellel.github.io/myblog/skateboard/image%20(4).jpg" }
    ]
  },
  onItemClick(e){
    var { datasource, index } = e.currentTarget.dataset;
    var item = this.data[datasource][index];
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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