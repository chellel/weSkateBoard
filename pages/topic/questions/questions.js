// pages/topic/questions/questions.js
var api = require("../../../utils/api.js");
var util = require("../../../utils/util.js");
const WxParse = require("../../../utils/wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource: []

  },
  onTitleClick(e){
    var index = e.currentTarget.dataset.index;
    var id = this.data.dataSource[index].target.question.id;
    wx.navigateTo({
      url: `../answers/answers?id=${id}`,
    })

  },
  onItemClick(e) {
    var index = e.currentTarget.dataset.index;
    var id = this.data.dataSource[index].target.id;
    var test = "https://www.zhihu.com/api/v4/questions/297730641/answers?include=data%5B*%5D.is_normal%2Cadmin_closed_comment%2Creward_info%2Cis_collapsed%2Cannotation_action%2Cannotation_detail%2Ccollapse_reason%2Cis_sticky%2Ccollapsed_by%2Csuggest_edit%2Ccomment_count%2Ccan_comment%2Ccontent%2Ceditable_content%2Cvoteup_count%2Creshipment_settings%2Ccomment_permission%2Ccreated_time%2Cupdated_time%2Creview_info%2Crelevant_info%2Cquestion%2Cexcerpt%2Crelationship.is_authorized%2Cis_author%2Cvoting%2Cis_thanked%2Cis_nothelp%2Cis_labeled%2Cis_recognized%2Cpaid_info%2Cpaid_info_content%3Bdata%5B*%5D.mark_infos%5B*%5D.url%3Bdata%5B*%5D.author.follower_count%2Cbadge%5B*%5D.topics&offset=&limit=3&sort_by=default&platform=desktop";
    debugger
    api.GET(test).then((res) => {
      debugger
    })
    return
    wx.navigateTo({
      url: `../answer/answer?id=${id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var tid = options.id;
    if(!tid)//test
   tid = "19629946";
    var topicUrl = `https://www.zhihu.com/api/v4/topics/${tid}`;
    var topicsUrl = `https://www.zhihu.com/api/v4/topics/${tid}/feeds/essence`;
    var test4 = "https://www.zhihu.com/api/v4/topics/19629946/feeds/top_activity?include=data[*]&limit=20";
    api.GET(test4).then((res) => {
      console.log(res)
      var dataSource = res.data;
      this.setData({
        dataSource
      })
      var that = this;
      dataSource.forEach((item, index) => {
        var content = item["target"]["excerpt"];
        util.formatWxParse(WxParse, dataSource, content, index, that);
      })



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