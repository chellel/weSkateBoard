// pages/home/home.js
var app = getApp();
const utils = require("../../utils/util.js")
const api = require("../../utils/api.js");
var mtabW; //tabpanel选项卡标题栏宽度

Page({

  /**
   * 页面的初始数据
   */

  data: {
    imageUrls: [],
    tabDataSource: [{
        title: "教程",
        slotname: "slot1"
      },
      {
        title: "动作",
        slotname: "slot2"
      },
      {
        title: "其他",
        slotname: "slot3"
      }
    ],
    trickDataSource: [

    ],
    imageDataSource: [{
        id: 1,
        show: true
      },
      {
        id: "2",
        show: false
      },
      {
        id: "3",
        show: false
      },
      {
        id: "4",
        show: false
      },
      {
        id: "5",
        show: false
      },
      {
        id: "6",
        show: false
      },
      {
        id: "7",
        show: false
      },
      {
        id: "8",
        show: false
      },
      {
        id: "9",
        show: false
      },
      {
        id: "10",
        show: false
      },
      {
        id: "11",
        show: false
      },
      {
        id: "12",
        show: false
      },
      {
        id: "13",
        show: false
      },
      {
        id: "14",
        show: false
      },
      {
        id: "15",
        show: false
      },
      {
        id: "16",
        show: false
      },
      {
        id: "17",
        show: false
      },
      {
        id: "18",
        show: false
      },
      {
        id: "19",
        show: false
      },
      {
        id: "20",
        show: false
      }
    ],

    topicInfo: {},
    readMore: false,

    // 这里定义了innerText属性，属性值可以在组件使用时指定
    noDataText: getApp().globalData.message.noDataText,
    sliderOffset: 0,
    sliderLeft: 0,
    hasline: true,
    // 这里是一些组件内部数据
    activeIndex: 0, //当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    slideOffset: 0,
    tabW: 0,
    copy: {},
    windowHeight:getApp().globalData.systemInfo.windowHeight

  },


  /**切换tab导航标题 */
  switchNav: function(e) {
    var that = this;
    var idIndex = parseInt(e.currentTarget.id);
    if (this.data.activeIndex === idIndex)
      return
    else {
      var offsetW = e.currentTarget.offsetLeft; //2种方法获取距离文档左边有多少距离
      this.setData({
        activeIndex: idIndex,
        slideOffset: offsetW
      });
    }
  },
  /**切换tab内容 */
  switchTab: function(e) {
    // swiper组件绑定change事件tabChange，通过e.detail.current拿到当前页
    var current = e.detail.current;
    if ((current + 1) % 4 == 0) {}
    var offsetW = current * mtabW; //2种方法获取距离文档左边有多少距离 用于设置.weui-navbar-slider transform
    this.setData({
      activeIndex: current,
      slideOffset: offsetW
    });
    this.checkCor();
    /*    var dataSource = this.data.dataSource;

    var dataItems = dataSource[current].items;
    var data = {
      current: current,
      items: dataItems
    } 
    this.triggerEvent('changeEvent', data) //changeEvent自定义事件的名称
*/
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (this.data.activeIndex > 2) {

      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  /**设置tab导航标题的宽度 */
  autoTabNavWidth(dataSource) {
    var that = this;
    var systemInfo = app.globalData.systemInfo;
    var num = dataSource.length;
    if (num > 4) num = 4;
    mtabW = systemInfo.windowWidth / num;
    that.setData({
      tabW: mtabW,
      clientHeight: systemInfo.windowHeight - 60, //scroll-view内容的高度等于 设备的高度 - tab标题高度
      slideOffset: systemInfo.windowWidth / num * that.data.activeIndex
    });
    console.log(that.data)

  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  _onItemClick: function(e) {
    var data = e.currentTarget.dataset.data;
    this.triggerEvent("onItemClick", {
      data: data.detail
    })
  },

  readMore() {
    this.setData({
      readMore: !this.data.readMore
    })
  },

  onPageScroll(e) {
    //   this.getRect();
  },
  previewImg(e) {
    var index = e.currentTarget.dataset.index;

    wx.previewImage({
      current: this.data.imageUrls[index],
      urls: this.data.imageUrls
    })
  },
  previewImg1(e) {
    var index = e.currentTarget.dataset.index;
    var imageDataSource = this.data.imageDataSource;
    var imageUrls = [];
    for (var i in imageDataSource) {
      imageUrls.push("https://chellel.github.io/myblog/skateboard/image%20(" + imageDataSource[i].id + ").jpg")
    }
    wx.previewImage({
      current: imageUrls[index],
      urls: imageUrls
    })
  },

  getRect() {
    var offset = 0;
    var clientHeight = wx.getSystemInfoSync().windowHeight;
    debugger
    var echo = wx.createSelectorQuery().selectAll(".data-echo");
    var imageDataSource = this.data.imageDataSource;
    echo.boundingClientRect((rect) => {
      rect.forEach((item, index) => {
        var coords = item;

        var reachVisibleYN = ((coords.top >= 0 && coords.left >= 0 && coords.top) <= clientHeight + parseInt(offset));
        if (reachVisibleYN) {
          imageDataSource[index].show = true;
        }

      })
      this.setData({
        imageDataSource
      })
      //   return ((coords.top >= 0 && coords.left >= 0 && coords.top) <=  clientHeight + parseInt(offset));


    }).exec()


  },
  onTrickClick(e) {
    var index = e.currentTarget.dataset.index;
    var item = this.data.trickDataSource[index];
    var data = JSON.stringify(item);
    wx.navigateTo({
      url: `/pages/detail/detail?data=${data}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var imageUrls = [];
    for (var i = 1; i <= 4; i++) {
      imageUrls.push("https://chellel.github.io/myblog/skateboard/image%20(" + i + ").jpg");
    }
    this.setData({
      imageUrls
    })

    var store = [];
    var nodes = wx.createSelectorQuery().selectAll(".data-echo");
    for (var i = 0; i < nodes.length; i++) {
      store.push(nodes[i]);
    }
    //  var _inView = this.getRect();

    this.autoTabNavWidth(this.data.tabDataSource);
    var that = this;
    utils.getTricks((data) => {
      that.setData({
        trickDataSource: data.items
      });
    });
    var testUrl = 'https://zhuanlan.zhihu.com/api/recommendations/columns?limit=6&offset=6&seed=7';


    var baseUrl = "http://www.zhihu.com/collection/25547043?page=1";

    var me = "https://www.zhihu.com/api/v4/me?include=ad_type%3Bavailable_message_types%2Cdefault_notifications_count%2Cfollow_notifications_count%2Cvote_thank_notifications_count%2Cmessages_count%3Baccount_status%2Cis_bind_phone%2Cis_force_renamed%2Cemail%2Crenamed_fullname";
    var questionId = "39479153";

    var question = "https://www.zhihu.com/api/v4/questions/47825917/answers?&limit=20&offset=0";

    var requestURL = "https://www.zhihu.com/api/search?type=content&q=%E6%BB%91%E6%9D%BF";

    var skateboardTid = "19629946";
    var topicsUrl = `https://www.zhihu.com/api/v4/topics/${skateboardTid}`;

    //var baseUrl ="http://localhost:49738/apihandle.ashx";
    //var baseUrl ="http://192.168.1.166:1598/apihandle.ashx";

    api.GET(topicsUrl).then((topicInfo) => {
      this.setData({
        topicInfo
      })

    });
    var test ="https://www.zhihu.com/api/v4/topics/19629946/creator_wall??include=data[?(target.type=topic_sticky_module)].target.data[?(target.type=answer)].target.content,relationship.is_authorized,is_author,voting,is_thanked,is_nothelp;data[?(target.type=topic_sticky_module)].target.data[?(target.type=answer)].target.is_normal,comment_count,voteup_count,content,relevant_info,excerpt.author.badge[?(type=best_answerer)].topics;data[?(target.type=topic_sticky_module)].target.data[?(target.type=article)].target.content,voteup_count,comment_count,voting,author.badge[?(type=best_answerer)].topics;data[?(target.type=topic_sticky_module)].target.data[?(target.type=people)].target.answer_count,articles_count,gender,follower_count,is_followed,is_following,badge[?(type=best_answerer)].topics;data[?(target.type=answer)].target.annotation_detail,content,hermes_label,is_labeled,relationship.is_authorized,is_author,voting,is_thanked,is_nothelp;data[?(target.type=answer)].target.author.badge[?(type=best_answerer)].topics;data[?(target.type=article)].target.annotation_detail,content,hermes_label,is_labeled,author.badge[?(type=best_answerer)].topics;data[?(target.type=question)].target.annotation_detail,comment_count;&limit=10&offset=10].target.data[?(target.type=answer)].target.content,relationship.is_authorized,is_author,voting,is_thanked,is_nothelp;data[?(target.type=topic_sticky_module)].target.data[?(target.type=answer)].target.is_normal,comment_count,voteup_count,content,relevant_info,excerpt.author.badge[?(type=best_answerer)].topics;data[?(target.type=topic_sticky_module)].target.data[?(target.type=article)].target.content,voteup_count,comment_count,voting,author.badge[?(type=best_answerer)].topics;data[?(target.type=topic_sticky_module)].target.data[?(target.type=people)].target.answer_count,articles_count,gender,follower_count,is_followed,is_following,badge[?(type=best_answerer)].topics;data[?(target.type=answer)].target.annotation_detail,content,hermes_label,is_labeled,relationship.is_authorized,is_author,voting,is_thanked,is_nothelp;data[?(target.type=answer)].target.author.badge[?(type=best_answerer)].topics;data[?(target.type=article)].target.annotation_detail,content,hermes_label,is_labeled,author.badge[?(type=best_answerer)].topics;data[?(target.type=question)].target.annotation_detail,comment_count;&limit=10&offset=10)";
    var test2 ="https://www.zhihu.com/api/v4/topics/19629946/intro?include=content.meta.content.photos";
    var test3 ="https://www.zhihu.com/api/v3/topics/19629946/parent";
    var test4 ="https://www.zhihu.com/api/v4/topics/19629946/feeds/top_activity?include=data%5B%3F%28target.type%3Dtopic_sticky_module%29%5D.target.data%5B%3F%28target.type%3Danswer%29%5D.target.content%2Crelationship.is_authorized%2Cis_author%2Cvoting%2Cis_thanked%2Cis_nothelp%3Bdata%5B%3F%28target.type%3Dtopic_sticky_module%29%5D.target.data%5B%3F%28target.type%3Danswer%29%5D.target.is_normal%2Ccomment_count%2Cvoteup_count%2Ccontent%2Crelevant_info%2Cexcerpt.author.badge%5B%3F%28type%3Dbest_answerer%29%5D.topics%3Bdata%5B%3F%28target.type%3Dtopic_sticky_module%29%5D.target.data%5B%3F%28target.type%3Darticle%29%5D.target.content%2Cvoteup_count%2Ccomment_count%2Cvoting%2Cauthor.badge%5B%3F%28type%3Dbest_answerer%29%5D.topics%3Bdata%5B%3F%28target.type%3Dtopic_sticky_module%29%5D.target.data%5B%3F%28target.type%3Dpeople%29%5D.target.answer_count%2Carticles_count%2Cgender%2Cfollower_count%2Cis_followed%2Cis_following%2Cbadge%5B%3F%28type%3Dbest_answerer%29%5D.topics%3Bdata%5B%3F%28target.type%3Danswer%29%5D.target.annotation_detail%2Ccontent%2Chermes_label%2Cis_labeled%2Crelationship.is_authorized%2Cis_author%2Cvoting%2Cis_thanked%2Cis_nothelp%3Bdata%5B%3F%28target.type%3Danswer%29%5D.target.author.badge%5B%3F%28type%3Dbest_answerer%29%5D.topics%3Bdata%5B%3F%28target.type%3Darticle%29%5D.target.annotation_detail%2Ccontent%2Chermes_label%2Cis_labeled%2Cauthor.badge%5B%3F%28type%3Dbest_answerer%29%5D.topics%3Bdata%5B%3F%28target.type%3Dquestion%29%5D.target.annotation_detail%2Ccomment_count%3B&limit=5&after_id=5588.59416";
   
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