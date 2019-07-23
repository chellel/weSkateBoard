// pages/topic/answer/answer.js
const utils = require("../../../utils/util.js");
const WxParse = require("../../../utils/wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource: {},
    isVoteUp: false,
    isStar:false

  },
  VoteUp() {
    var currVoteUp = this.data.isVoteUp;
    currVoteUp ? this.data.dataSource.voteup_count-- : this.data.dataSource.voteup_count++;
    this.setData({
      isVoteUp: !currVoteUp,
      dataSource: this.data.dataSource
    })
  },
  Star(){
    this.setData({
      isStar:!this.data.isStar
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var aid = options.id;
   // aid = "215782465"; //test
   
    utils.getAnswer(aid, (data) => {
      console.log(data)
      this.setData({
        dataSource: data
      })
      var that = this;
      var content = this.data.dataSource.content;
      debugger
      WxParse.wxParse('content', 'html', content, that, 5);

    });

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