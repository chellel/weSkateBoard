// pages/topic/questions/questions.js
var api = require("../../../utils/api.js");
var util = require("../../../utils/util.js");
const WxParse = require("../../../utils/wxParse/wxParse.js");
var tid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource: {
      activityDataSource: [],
      essenceDataSource: []
    },
    showNarBar: true,
    sliderOffset: 0,
    sliderLeft: 0,
    hasline: true,
    // 这里是一些组件内部数据
    activeIndex: 0, //当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    slideOffset: 0,
    tabW: 0,
    windowHeight: getApp().globalData.systemInfo.windowHeight, //窗口高度
    narbar: [{
        title: "讨论",
        slotname: "slot1",
        type: "top_activity",
        datasourceId: "activityDataSource",
        wxParseTemArrayName: "activityArray",
        currentPage: 0, //当前起始筛选条数
        isRender: false,
        isLoading: false,
        paging: {},
      },
      {
        title: "精华",
        slotname: "slot2",
        type: "essence",
        datasourceId: "essenceDataSource",
        wxParseTemArrayName: "essenceArray",
        currentPage: 0, //当前起始筛选条数
        isRender: false,
        isLoading: false,
        paging: {},

      }
    ],
    activityArray: [],
    essenceArray: [],
    clientY: getApp().globalData.systemInfo.windowHeight - 80,
    clientHeight: getApp().globalData.systemInfo.windowHeight//scroll-view内容的高度 = 设备的高度 - weui-narbar高度

  },
  /**切换tab导航标题 */
  switchNav: function(e) {
    var that = this;
    var activeIndex = e.currentTarget.dataset.index;
    if (this.data.activeIndex === activeIndex) {
      return false
    } else {
      this.setData({
        activeIndex
      });
    }
  },
  /**切换tab内容 */
  switchTab: function(e) {
    // swiper组件绑定change事件tabChange，通过e.detail.current拿到当前页
    var activeIndex = e.detail.current;

    this.setData({
      activeIndex
    });
    if (!this.data.narbar[activeIndex].isRender)
      this.getDataSource(activeIndex);

  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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
    var {
      activeIndex,
      narbar
    } = this.data;
    var datasourceId = narbar[activeIndex].datasourceId;
    var target = this.data.dataSource[datasourceId][index].target;
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
  getDataSource(activeIndex) {

    var narbar = this.data.narbar;
    var narbarItem = narbar[activeIndex];

    var {
      type,
      datasourceId,
      wxParseTemArrayName,
      paging
    } = narbarItem;

    var topicsUrl = "";
    if (Object.keys(paging).length > 0) { //判断paging不为空
      if (paging.is_end)
        return
      topicsUrl = paging.next;
    } else {
      topicsUrl = `https://www.zhihu.com/api/v4/topics/${tid}/feeds/${type}?include=data[*]&limit=${limit}&offset=0`;
      if (type == "active_activity")
        topicsUrl + "&after_id=0";
    }
    var limit = 4; //每次加载页面数据条数


    //  console.log(topicsUrl)//https://www.zhihu.com/api/v4/topics/19629946/feeds/top_activity?include=data[*]&limit=5&after_id=5589.15728
  /*  wx.showLoading({
      title: '加载中...',
    })*/

    this.changeLoadmoreStatus(narbar, narbarItem, "isLoading", true);
    api.GET(topicsUrl).then((res) => {
    /* if (Object.keys(paging).length > 0)  //test
        if (!paging.is_end)
          return*/
      this.changeLoadmoreStatus(narbar, narbarItem, "isLoading", false);
      var dataSource = res.data;
      // var dataSourceKey = "dataSource." + datasourceId;
      var dataTemp = {};
      var currDataSource = this.data.dataSource[datasourceId];
      if (datasourceId == "activityDataSource") {
        var dataSourceTemp = dataSource.filter((item) => { //由于无法得知article文章的api，暂时过滤
          if (item.target.type != "article")
            return item;
        })
        //  dataSourceTemp = [...dataSource];
        if (Array.isArray(currDataSource)) {
          dataSourceTemp = [...currDataSource, ...dataSourceTemp];
        }
        dataTemp = {
          "dataSource.activityDataSource": dataSourceTemp
        };
      } else if (datasourceId == "essenceDataSource") {
        if (Array.isArray(currDataSource)) {
          dataSource = [...currDataSource, ...dataSource];
        }
        dataTemp = {
          "dataSource.essenceDataSource": dataSource
        };
      }
      narbarItem.isRender = true;
      narbarItem.currentPage = narbarItem.currentPage + limit;
      narbarItem.paging = res.paging;

      Object.assign(dataTemp, {
        narbar
      });
      this.setData(dataTemp)
      var that = this;
      this.data.dataSource[datasourceId].forEach((item, index) => {
        if (index < this.data[wxParseTemArrayName].length)
          return
        // var content = item["content"];
        var content = item["target"]["excerpt"];
        util.formatWxParse(WxParse, that.data.dataSource[datasourceId], content, index, that, type, wxParseTemArrayName);
      })
    }).catch(() => {
      var narbar = this.data.narbar;
      var narbarItem = narbar[activeIndex];
      narbarItem.isLoading = false;
      this.setData({
        narbar
      })
    })
  },
  changeLoadmoreStatus(narbar, narbarItem, key, value) {
    narbarItem[key] = value;
    this.setData({
      narbar
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    tid = options.id;
    if (!tid) //test
      tid = "19629946";
    this.getDataSource(this.data.activeIndex);


    this.scrollToTop = this.selectComponent("#scrollToTop");

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

  onScrollReachBottom() {
    this.getDataSource(this.data.activeIndex);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  onScroll: function(e) {
 //   console.log(e.detail.deltaY)
    if (e.detail.deltaY > 20)    //向上滚动 为避免回弹出现短时间内上下滚动引起的灵敏度过高导致不断闪烁效果，将阀值设置为20
    {
      this.setData({
        showNarBar: true,
        clientHeight: this.data.windowHeight - 30
      })
    } else if (e.detail.deltaY < -20) {    //向下滚动
      this.setData({
        showNarBar: false,
        clientHeight: this.data.windowHeight
      })
    }
    e.detail.scrollTop > this.data.clientY ? this.scrollToTop.show() : this.scrollToTop.hide();

  },
  scrollToScrollTop() {

    this.setData({
      scrollTopNum: 0
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})