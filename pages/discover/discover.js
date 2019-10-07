// pages/discover/discover.js
const api = require("../../utils/api.js");
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
  onItemClick2(e){
    var { datasource, index } = e.currentTarget.dataset;
    var item = this.data[datasource][index];

    wx.navigateTo({
      url: '/pages/detail/detail',
    })
  },
  onItemClick(e) {
    var index = e.currentTarget.dataset.index
    var id = parseInt(e.currentTarget.dataset.id);
  
    var imageUrls = this.imageUrls;
    
    wx.previewImage({
      current: imageUrls[id-1],
      urls: imageUrls
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    api.GET(getApp().globalData.connectUrl + "api/getDiscovery").then(res => {
      var that = this;
      var data=res.data.items;
      var dataSource1 = [], dataSource2 = [];
      dataSource1.push(data[0], data[1], data[2])
      dataSource2.push(data[3], data[4], data[5], data[6])
      that.setData({
        dataSource1,
        dataSource2
      })
      var imageUrls = [];
      var imageDataSource = [...dataSource1, ...dataSource2];
      for (var i in imageDataSource) {
        var imgUrl = imageDataSource[i].imgUrl;
      /*  var index = imgUrl.indexOf('&');

        var url = imgUrl.substr(0, index);
        var srcIndex = imgUrl.indexOf("src=");
        url= imgUrl.substr(srcIndex+4)*/
        imageUrls.push(imgUrl);
      }
      this.imageUrls = imageUrls;
    
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