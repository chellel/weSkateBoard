// pages/home/home.js
var app=getApp();
const utils=require("../../utils/util.js")
var mtabW; //tabpanel选项卡标题栏宽度

Page({

  /**
   * 页面的初始数据
   */

  data: {
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
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    noDataText: getApp().globalData.message.noDataText,
    sliderOffset: 0,
    sliderLeft: 0,
    hasline: true,
    // 这里是一些组件内部数据
    activeIndex: 1, //当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    slideOffset: 0,
    tabW: 0,
    copy: {}
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
    var systemInfo=app.globalData.systemInfo;
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

  onPageScroll(e) {
 //   this.getRect();
  },
previewImg(e){
  debugger

  wx.previewImage({
    urls: [],
  })
},

  getRect() {
    var offset = 0;
    var clientHeight = wx.getSystemInfoSync().windowHeight;
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
  onTrickClick(e){
    debugger
    wx.navigateTo({
      url: `/pages/detail/detail?id=${e}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var store = [];
    var nodes = wx.createSelectorQuery().selectAll(".data-echo");
    for (var i = 0; i < nodes.length; i++) {
      store.push(nodes[i]);
    }
  //  var _inView = this.getRect();

    this.autoTabNavWidth(this.data.tabDataSource);
var that=this;
    utils.getTricks((data)=>{
      console.log(data.items)
      that.setData({
        trickDataSource: data.items
      });
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