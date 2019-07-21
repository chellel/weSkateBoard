var api=require("../utils/api.js");
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getTricks=function(callback){
  wx.showLoading({
    title: '加载中...',
  })
  api.GET("https://www.easy-mock.com/mock/5d302560f532ea49fab32d91/skateboard/getTrick").then((data)=>{
    callback(data);
    wx.hideLoading()
  });
}

const getTrickById = function (callback) {
  wx.showLoading({
    title: '加载中...',
  })
 /* api.GET("https://www.easy-mock.com/mock/5d302560f532ea49fab32d91/skateboard/getTrickById").then((data) => {
    callback(data);
    wx.hideLoading()
  });*/
  /**模拟getTrickById接口 */
  callback();
}

module.exports = {
  formatTime,
  getTricks
}
