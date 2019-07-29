// pages/search/index/index.js
var util = require("../../../utils/util.js");
var api = require("../../../utils/api.js");
var WxParse = require("../../../utils/wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource: [],
    paging: {},
    readMore: false,
    readIndexMore: false,
    readIndex: 1, //默认收起时只显示一行
    isLoading: false

  },
  readMore() {
    this.setData({
      readMore: !this.data.readMore
    })
  },
  readIndexMore() {
    var readIndexMore = this.data.readIndexMore;
    this.setData({
      readIndexMore: !readIndexMore,
      readIndex: readIndexMore ? 2 : this.data.topicInfo.content_essence_list.length
    })
  },
  onContentListItemClick(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/topic/answers/answers?id=' + id
    })
  },
  onItemClick(e) {
    var index = e.currentTarget.dataset.index;
    var id = this.data.dataSource[index].object.id;
    wx.navigateTo({
      url: `/pages/topic/answer/answer?id=${id}`,
    })
  },
  getDataSource(q) {
    this.setData({
      isLoading: true
    })
    wx.showLoading({
      title: getApp().globalData.message.loadingText,
    })
    wx.showNavigationBarLoading()

    if (!q) { //test
      q = "滑板";
    }

    var limit = 4;
    var url = "";
    var paging = this.data.paging;
    if (JSON.stringify(paging) !== '{}') {
      if (paging.is_end) {
        wx.showToast({
          title: '到底啦',
        })
        return
      }

      url = paging.next;
    } else {
      url = `https://www.zhihu.com/api/v4/search_v3?t=general&q=${q}&correction=1&offset=0&limit=${limit}&lc_idx=0&show_all_topics=0`;
    }

    api.GET(url).then(res => {
      this.setData({
        isLoading: false
      })
      var bindName = "content";

      var dataSource = res.data;
      var that = this;
      dataSource = handleHtml(dataSource, that);

      /**替换文本中所有包含em的字符串 */
      function replaceEM(item, content) {
        item[content] = item[content].replace(/<em>/g, '').replace(/<\/em>/g, '');
      }

      function handleHtml(dataSource, that) {
        var search_result_answer_index = that.data.search_result_answer_index;
        var search_result_answer_startindex = that.data.search_result_answer_startindex;
        if (search_result_answer_index == undefined) {
          search_result_answer_index = 0;
        }

        search_result_answer_startindex = search_result_answer_index;

        dataSource.forEach((dataItem, index) => {
          /**按type分类处理数据 */
          switch (dataItem.type) {
            case "wiki_box":
              var topicInfo = dataItem.object;
              topicInfo["introduction"] = topicInfo["introduction"].replace(/<em>/g, '').replace(/<\/em>/g, '');
              topicInfo["name"] = topicInfo["name"].replace(/<em>/g, '').replace(/<\/em>/g, '');

              var content_essence_list = topicInfo.content_essence_list;
              if (Array.isArray(content_essence_list) == true)
                content_essence_list.forEach((item) => {
                  item["title"] = item["title"].replace(/<em>/g, '').replace(/<\/em>/g, '');
                  item.content_list.forEach(conentItem => {
                    conentItem["title"] = conentItem["title"].replace(/<em>/g, '').replace(/<\/em>/g, '');
                  })
                })
              that.setData({
                topicInfo
              })

              break;
            case "search_result":

              var object = dataItem.object;

              if (object.type == "answer") {
                object.author.name = object.author.name.replace(/<em>/g, '').replace(/<\/em>/g, '');
                replaceEM(object, "excerpt");

                var wxParseTemArrayName = "contentArray";

                /*    if (Array.isArray(that.data[wxParseTemArrayName]))
                      if (index < that.data[wxParseTemArrayName].length)
                        return*/
                var content = dataItem.object["content"];
                // util.formatWxParse(WxParse, dataSource, content, index, that);

                WxParse.wxParse(bindName + search_result_answer_index, 'html', content, that)
                dataItem.object.search_result_answer_index = search_result_answer_index;

                search_result_answer_index++;
              } else if (object.type == "column") {

              }

              break;
            case "":

              break;
          }
        })
        WxParse.wxParseTemArray("contentArray", "content", search_result_answer_startindex, search_result_answer_index, that)
        for (var i = search_result_answer_startindex; i < search_result_answer_index; i++) {
          delete that.data[bindName + i];
        }
        that.setData({
          search_result_answer_index
        })
        return dataSource;
      }

      var currDataSource = this.data.dataSource;
      dataSource = [...currDataSource, ...dataSource];
      this.setData({
        dataSource,
        paging: res.paging
      })
      console.log(dataSource)
    }).catch(e => {
      this.setData({
        isLoading: false
      })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var q = options.q;
    if (!q) { //test
      q = "滑板";
    }
    this.getDataSource(q);
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
    this.getDataSource();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})