// pages/topic/answers/answers.js
var api=require("../../../utils/api.js");
var util=require("../../../utils/util.js");
const WxParse = require("../../../utils/wxParse/wxParse.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onItemClick(e){
    var index=e.currentTarget.dataset.index;
    var id=this.data.dataSource[index].id;
    wx.navigateTo({
      url: `../answer/answer?id=${id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var qId = options.id;
    //qId ="47825917";
    var url =`https://www.zhihu.com/api/v4/questions/${qId}/answers?include=data[*].is_normal,admin_closed_comment,reward_info,is_collapsed,annotation_action,annotation_detail,collapse_reason,is_sticky,collapsed_by,suggest_edit,comment_count,can_comment,content,editable_content,voteup_count,reshipment_settings,comment_permission,created_time,updated_time,review_info,relevant_info,question.detail,excerpt,relationship.is_authorized,is_author,voting,is_thanked,is_nothelp,is_labeled,is_recognized;data[].mark_infos[].url;data[].author.follower_count,badge[].topics&limit=20&offset=10&platform=desktop&sort_by=default`;
  
    api.GET(url).then((res)=>{
      console.log(res)
      var dataSource=res.data;
      this.setData({
        dataSource
      })
      var that = this;
      dataSource.forEach((item, index) => {
        var content = item["content"];
        util.formatWxParse(WxParse, dataSource,content,index, that);
      })
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