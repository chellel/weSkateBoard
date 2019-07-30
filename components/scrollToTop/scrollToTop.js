// components/scrollToTop/scrollToTop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isHidden: {
      type: Boolean,
      value: true
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    clientX: getApp().globalData.systemInfo.windowWidth - 40,
    clientY: getApp().globalData.systemInfo.windowHeight - 80,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    scrollToTop() {
      wx.pageScrollTo({
        scrollTop: 0,
      })
      this.setData({
        isHidden: true
      })
      this.triggerEvent("scrollToTop");
    },
    show() {
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
    },
    hide() {
      if (!this.data.isHidden)
        this.setData({
          isHidden: true
        })
    }
  }
})