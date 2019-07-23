// pages/topic/questions/questions.js
var api = require("../../../utils/api.js");
var util = require("../../../utils/util.js");
const WxParse = require("../../../utils/wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource: {
      activityDataSource: [],
      essenceDataSource: []
    },

    sliderOffset: 0,
    sliderLeft: 0,
    hasline: true,
    // 这里是一些组件内部数据
    activeIndex: 0, //当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    slideOffset: 0,
    tabW: 0,
    winHeight: "", //窗口高度
    narbar: [{
        title: "讨论",
        slotname: "slot1",
        type: "top_activity",
        datasourceId: "activityDataSource"
      },
      {
        title: "精华",
        slotname: "slot2",
        type: "essence",
        datasourceId: "essenceDataSource"

      }
    ]
  },
  /**切换tab导航标题 */
  switchNav: function(e) {
    var that = this;
    var idIndex = e.currentTarget.dataset.index;
    if (this.data.activeIndex === idIndex) {
      return false
    } else {
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
    this.setData({
      activeIndex: current
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

  onTitleClick(e) {
    var index = e.currentTarget.dataset.index;
    var {
      activeIndex,
      narbar
    } = this.data;
    var datasourceId = narbar[activeIndex].datasourceId;
    var id = this.data.dataSource[datasourceId][index].target.question.id;
    wx.navigateTo({
      url: `../answers/answers?id=${id}`,
    })

  },
  onItemClick(e) {
    var index = e.currentTarget.dataset.index;
    var target = this.data.dataSource[index].target;
    var {
      id,
      type
    } = target;
    var url = "";
    if (type == "answer") {
      url = `../answer/answer?id=${id}&type=${type}`
    } else if (type == "article") {
      url = `../answers/answers?id=${id}&type=${type}`

    }
    wx.navigateTo({
      url
    })
  },
  getDataSource(tid) {
    var {
      activeIndex,
      narbar
    } = this.data;
    var narbarItem = narbar[activeIndex];
    var {
      type,
      datasourceId
    } = narbarItem;
    var topicsUrl = `https://www.zhihu.com/api/v4/topics/${tid}/feeds/${type}?include=data[*]&limit=20`;
    api.GET(topicsUrl).then((res) => {
      console.log(res)
      var dataSource = res.data;
      var dataSourceKey = "dataSource." + datasourceId;

      this.setData({
        "dataSource.activityDataSource": dataSource
      })
      var that = this;
      dataSource.forEach((item, index) => {
        var content = item["target"]["excerpt"];
        util.formatWxParse(WxParse, dataSource, content, index, that);
      })
      var dd = this.data;
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var tid = options.id;
    if (!tid) //test
      tid = "19629946";
    this.getDataSource(tid);


    //var topicUrl = `https://www.zhihu.com/api/v4/topics/${tid}`;
    //   var topicsUrl = `https://www.zhihu.com/api/v4/topics/${tid}/feeds/essence`;
    var test4 = "https://www.zhihu.com/api/v4/topics/19629946/feeds/top_activity?include=data[*]&limit=20";



    this.setData({
      clientHeight: getApp().globalData.systemInfo.windowHeight - 30 //scroll-view内容的高度等于 设备的高度 - tab标题高度
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