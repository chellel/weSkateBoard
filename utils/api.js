const http = ({
  url,
  params,
  ...other
} = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: params,
      ...other,
      success: res => {
        wx.hideLoading();
        wx.hideNavigationBarLoading()
        resolve(res.data);
      },
      fail: e => {
        wx.hideLoading();
        wx.hideNavigationBarLoading()
        wx.getNetworkType({
          success: function(res) {
            if (res.networkType == "none") {
              wx.showModal({
                content: '无法连接到网络，请检查',
                showCancel: false
              })
            }
          },
        })
      },
      complete: e => {}
    })
  })
}

module.exports = {
  GET(url, params = {}) {
    return http({
      url,
      params,
      method: "GET"
    })
  },
  POST(url, params = {}) {
    return http({
      url,
      params,
      method: "POST"
    })
  }
}