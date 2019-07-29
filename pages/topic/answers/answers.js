// pages/topic/answers/answers.js
var api = require("../../../utils/api.js");
var util = require("../../../utils/util.js");
const WxParse = require("../../../utils/wxParse/wxParse.js");
var qId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentArray: [],
    isLoading: false,
    clientX: getApp().globalData.systemInfo.windowWidth - 40,
    clientY: getApp().globalData.systemInfo.windowHeight - 80,
    isHidden: true
  },

  onItemClick(e) {
    var index = e.currentTarget.dataset.index;
    var id = this.data.dataSource[index].id;
    wx.navigateTo({
      url: `../answer/answer?id=${id}`,
    })
  },
  getDataSource() {
    wx.showNavigationBarLoading()
    this.setData({
      isLoading: true
    })
    var limit = 4;

    var url = `https://www.zhihu.com/api/v4/questions/${qId}/answers?include=data[*].is_normal,admin_closed_comment,reward_info,is_collapsed,annotation_action,annotation_detail,collapse_reason,is_sticky,collapsed_by,suggest_edit,comment_count,can_comment,content,editable_content,voteup_count,reshipment_settings,comment_permission,created_time,updated_time,review_info,relevant_info,question.detail,excerpt,relationship.is_authorized,is_author,voting,is_thanked,is_nothelp,is_labeled,is_recognized;data[].mark_infos[].url;data[].author.follower_count,badge[].topics&platform=desktop&sort_by=default`;
    var d = "297730641";
    var test = `https://www.zhihu.com/api/v4/questions/${qId}/answers?include=data%5B*%5D.is_normal%2Cadmin_closed_comment%2Creward_info%2Cis_collapsed%2Cannotation_action%2Cannotation_detail%2Ccollapse_reason%2Cis_sticky%2Ccollapsed_by%2Csuggest_edit%2Ccomment_count%2Ccan_comment%2Ccontent%2Ceditable_content%2Cvoteup_count%2Creshipment_settings%2Ccomment_permission%2Ccreated_time%2Cupdated_time%2Creview_info%2Crelevant_info%2Cquestion%2Cexcerpt%2Crelationship.is_authorized%2Cis_author%2Cvoting%2Cis_thanked%2Cis_nothelp%2Cis_labeled%2Cis_recognized%2Cpaid_info%2Cpaid_info_content%3Bdata%5B*%5D.mark_infos%5B*%5D.url%3Bdata%5B*%5D.author.follower_count%2Cbadge%5B*%5D.topics&offset=&limit=3&sort_by=default&platform=desktop`;
    var paging = this.data.paging;
    if (paging) {
      if (paging.is_end) {
        wx.showToast({
          title: '到底啦',
        })
        return
      }

      url = paging.next;
    }
    console.log(url)
    api.GET(url).then((res) => {
      wx.hideNavigationBarLoading();
      this.setData({
        isLoading: false
      })
      console.log(res)
      var dataSource = res.data;
      var currDataSource = this.data.dataSource;
      if (Array.isArray(currDataSource) && currDataSource.length > 0)
        dataSource = [...currDataSource, ...dataSource];
      this.setData({
        dataSource,
        paging: res.paging
      })
      var that = this;
      var wxParseTemArrayName = "contentArray";
      dataSource.forEach((item, index) => {

        if (index < this.data[wxParseTemArrayName].length)
          return
        var content = item["content"];
        util.formatWxParse(WxParse, dataSource, content, index, that);
      })
    }).catch(e => {
      wx.hideNavigationBarLoading();
      this.setData({
        isLoading: false
      })
    })

  },
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
    })
    this.setData({
      isHidden: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var type = options.type;
    qId = options.id;
    if (!qId)
      qId = "47825917"; //test
    this.getDataSource();
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

  onPageScroll: function(e) {
    if (e.scrollTop > this.data.clientY) {
      if (this.data.isHidden) {
        this.setData({
          isHidden: false
        })
        setTimeout(() => {
          var animation = wx.createAnimation({})
          animation.opacity(1).translateY(0).step();
          this.setData({
            animation: animation.export()
          })
        }, 0)
      }

    } else {
     if(!this.data.isHidden)
       this.setData({
         isHidden: true
       })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.paging.is_end)
      return
    this.getDataSource();






  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})