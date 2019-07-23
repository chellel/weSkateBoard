//获取应用实例

var mtabW; //tabpanel选项卡标题栏宽度

Page({
 
  data: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    dataSource: [],
    noDataText: getApp().globalData.message.noDataText ,
    sliderOffset: 0,
    sliderLeft: 0,
    hasline: true,
    // 这里是一些组件内部数据
    activeIndex: 0, //当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    slideOffset: 0,
    tabW: 0,
    winHeight: "" //窗口高度
  },
  ready: function() {
  /*  this.setData({
      noDataText: getApp().message.noDataText
    })*/
    this.autoTabNavWidth();
  },
  methods: {
    /**切换tab导航标题 */
    switchNav: function(e) {
      var that = this;
      var idIndex = parseInt(e.currentTarget.id);
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
    autoTabNavWidth() {
      var that = this;
      wx.getSystemInfo({
        success: function(res) {
          var num = that.data.dataSource.length;
          if (num > 4) num = 4;
          mtabW = res.windowWidth / num;
          that.setData({
            tabW: mtabW
          })
          var clientHeight = res.windowHeight,
            clientWidth = res.windowWidth,
            rpxR = 750 / clientWidth;
          var calc = clientHeight * rpxR - 90;
          that.setData({
            winHeight: calc,
            clientHeight: res.windowHeight - 60 //scroll-view内容的高度等于 设备的高度 - tab标题高度
          });
        }
      });
    },
    tabClick: function(e) {
      this.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.id
      });
    },
    
    _onItemClick: function (e) {
      var data = e.currentTarget.dataset.data;
      this.triggerEvent("onItemClick", { data: data.detail })
    },
  },
})