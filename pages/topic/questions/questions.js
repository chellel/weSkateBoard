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
        datasourceId: "activityDataSource",
      wxParseTemArrayName:"activityArray",
        currentPage: 0, //当前起始筛选条数
        isRender: false,
      isLoading: false,
      paging:{}
      },
      {
        title: "精华",
        slotname: "slot2",
        type: "essence",
        datasourceId: "essenceDataSource",
        wxParseTemArrayName: "essenceArray",
        currentPage: 0, //当前起始筛选条数
        isRender: false,
        isLoading:false,
        paging: {}

      }],
    activityArray: [],
    essenceArray: [],
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
    if (Object.keys(paging).length > 0) {//判断paging不为空
      if (paging.is_end) {
        wx.showToast({
          title: '到底啦',
        })
        return
      }
      topicsUrl = paging.next;
    } else {
      topicsUrl = `https://www.zhihu.com/api/v4/topics/${tid}/feeds/${type}?include=data[*]&limit=${limit}&offset=0`;
      if (type == "active_activity")
        topicsUrl + "&after_id=0";
    }
    var limit = 4; //每次加载页面数据条数

    
  //  console.log(topicsUrl)//https://www.zhihu.com/api/v4/topics/19629946/feeds/top_activity?include=data[*]&limit=5&after_id=5589.15728
    wx.showLoading({
      title: '加载中...',
    })
 
    this.changeLoadmoreStatus(narbar, narbarItem, "isLoading", true);
    api.GET(topicsUrl).then((res) => {
    this.changeLoadmoreStatus(narbar,narbarItem,"isLoading",false);
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
        if (index<this.data[wxParseTemArrayName].length)
           return
       // var content = item["content"];
        var content = item["target"]["excerpt"];
        util.formatWxParse(WxParse, that.data.dataSource[datasourceId], content, index, that, type,wxParseTemArrayName);
      })
    }).catch(()=>{
      var narbar = this.data.narbar;
      var narbarItem = narbar[activeIndex];
      narbarItem.isLoading = false;
      this.setData({
        narbar
      })
    })
  },
  changeLoadmoreStatus(narbar,narbarItem,key,value){
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


    //var topicUrl = `https://www.zhihu.com/api/v4/topics/${tid}`;
    //   var topicsUrl = `https://www.zhihu.com/api/v4/topics/${tid}/feeds/essence`;
    var test4 = "https://www.zhihu.com/api/v4/topics/19629946/feeds/top_activity?include=data[*]&limit=20";
    var d = getApp().globalData.systemInfo.windowHeight - 30;


    this.setData({
      clientHeight: getApp().globalData.systemInfo.windowHeight //scroll-view内容的高度等于 设备的高度 - tab标题高度
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

  onScrollReachBottom() {
    console.log("onReachBottom")
    this.getDataSource(this.data.activeIndex);
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