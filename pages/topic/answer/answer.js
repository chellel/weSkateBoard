// pages/topic/answer/answer.js
const api = require("../../../utils/api.js");
const util = require("../../../utils/util.js");
const WxParse = require("../../../utils/wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource: {},
    commentDataSource: [],
    isVoteUp: false,
    isStar: false,
    isFollow: false,
    offset: 0, //当前页码
    isLoading: false,
    clientY: getApp().globalData.systemInfo.windowHeight - 80,

  },
  VoteUp() {
    wx.showToast({
      title: this.data.isVoteUp ? "取消赞同" : "已赞同",
      icon: this.data.isVoteUp ? "none" : ""
    })
    var currVoteUp = this.data.isVoteUp;
    var dataSource = this.data.dataSource;
    currVoteUp ? dataSource.voteup_count-- : dataSource.voteup_count++;

    this.setData({
      isVoteUp: !currVoteUp,
      dataSource
    })
  },
  Star() {
    wx.showToast({
      title: this.data.isStar ? "取消收藏" : "已收藏",
      icon: this.data.isStar ? "none" : ""
    })
    this.setData({
      isStar: !this.data.isStar
    })
  },
  /**关注 */
  Follow() {

    wx.showToast({
      title: this.data.isFollow ? "取消关注" : "已关注",
      icon: this.data.isFollow ? "none" : ""
    })
    this.setData({
      isFollow: !this.data.isFollow
    })
  },
  getDataSource() {
    wx.showLoading({
      title: getApp().globalData.message.loadingText
    })
    util.getAnswer(this.aid, (data) => {
      // console.log(data)
      data.created_time_format = new Date(data.created_time).toLocaleString();
      this.setData({
        dataSource: data
      })
      var that = this;
      var content = this.data.dataSource.content;
      WxParse.wxParse('content', 'html', content, that, 5);
    });
  },
  /**获取答案的评论 */
  getComment() {

    var limit = 10;
    var url = "";
    var {
      paging,
      commentDataSource: currCommentDataSource,
      offset
    } = this.data;
    if (paging) {
      if (paging.is_end) return
    }
    this.setData({
      isLoading: true
    })
    url = `https://www.zhihu.com/api/v4/answers/${this.aid}/root_comments?order=normal&limit=${limit}&offset=${offset}&status=open`

    api.GET(url).then((res) => {
      this.setData({
        isLoading: false
      })
      console.log(res)
      var commentDataSource = res.data;
      handleHTML(commentDataSource);

      function handleHTML(dataSource) {
        dataSource.map(item => {
          util.replaceP(item, "content");
          item.child_comments.map(child_comment=>{
            util.replaceP(child_comment, "content");
          })
        })
      }
      if (currCommentDataSource.length > 0)
        commentDataSource = [...currCommentDataSource, ...commentDataSource];
      this.setData({
        commentDataSource,
        paging: res.paging,
        offset: offset + limit
      })
    }).catch(e => {
      this.setData({
        isLoading: false
      })
    })


  },
  /**评论点赞 */
  like(e) {
    var index = e.currentTarget.dataset.index;
    var commentDataSource = this.data.commentDataSource;
    var is_like = commentDataSource[index].is_like;
    is_like = is_like != undefined ? !is_like : true;
    is_like ? commentDataSource[index].vote_count++ : commentDataSource[index].vote_count--;
    commentDataSource[index].is_like = is_like;
    this.setData({
      commentDataSource
    })
  },
  /**评论的回复点赞 */
  child_comment_like(e) {
    var { index, childindex} = e.currentTarget.dataset;
    var commentDataSource = this.data.commentDataSource;
    var is_like = commentDataSource[index].child_comments[childindex].is_like;
    is_like=is_like!=undefined?!is_like:true;
    is_like ? commentDataSource[index].child_comments[childindex].vote_count++ : commentDataSource[index].child_comments[childindex].vote_count--;
    commentDataSource[index].child_comments[childindex].is_like = is_like;
    this.setData({
      commentDataSource
    })
  },
  /**查看更多评论回复 */
  getChildComments(e) {
    var {
      index,
      id: cid
    } = e.currentTarget.dataset; //commentDataSource的index
    var url = `https://www.zhihu.com/api/v4/comments/${cid}/child_comments`;
    api.GET(url).then(res => {
      var child_comments=res.data;
      child_comments.map(child_comment => {
        util.replaceP(child_comment, "content");
      })
      var commentDataSource = this.data.commentDataSource;
      commentDataSource[index].child_comments = child_comments;
      this.setData({
        commentDataSource
      })

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.aid = options.id;
    if (!this.aid)
      this.aid = "24441836"; //test
    this.scrollToTop = this.selectComponent("#scrollToTop");

    this.getDataSource();
    this.getComment();

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
    this.getComment();
  },


  onPageScroll: function (e) {
    e.scrollTop > this.data.clientY ? this.scrollToTop.show() : this.scrollToTop.hide();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})