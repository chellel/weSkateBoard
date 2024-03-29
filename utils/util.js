var api = require("../utils/api.js");
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

const getTricks = function(callback) {
  wx.showLoading({
    title: '加载中...',
  })
  api.GET("https://www.fastmock.site/mock/a9640dd42395bca80f5e098ce33afdd1/skateboard/api/getTrick").then((data) => {
    callback(data);
    wx.hideLoading()
  });
}

const getTrickById = function(callback) {
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

const getAnswer = function(aid, callback) {
  // var aid = "445326904";
  var aUrl = `https://www.zhihu.com/api/v4/answers/${aid}?include=data[*].is_normal,suggest_edit,comment_count,collapsed_counts,reviewing_comments_count,can_comment,content,voteup_count,reshipment_settings,comment_permission,mark_infos,created_time,updated_time,relationship.voting,is_author,is_thanked,is_nothelp,upvoted_followees;data[*].author.badge[?(type=best_answerer)].topics].topics)`;
  api.GET(aUrl).then((res) => {
    callback(res);
  });
}



function formatWxParse(WxParse, dataSource, content, index, that, bindName = "content", wxParseTemArrayName = "contentArray") {
  WxParse.wxParse(bindName + index, 'html', content, that)
  var startIndex = that.data[wxParseTemArrayName].length;
  if (index == dataSource.length - 1) {
    WxParse.wxParseTemArray(wxParseTemArrayName, bindName, startIndex, dataSource.length, that)
    for (var i = startIndex; i < dataSource.length; i++) {
      delete that.data[bindName + i];
    }
  }


}

/**替换文本中所有包含p标签的字符串 */
function replaceP(item, content) {
  item[content] = item[content].replace(/<p>/g, '').replace(/<\/p>/g, '');
}

/** 将数值转换为万单位的数值 */
function formatLargeNumber(num) {
  var convertNum = num;
  if (typeof(num) != "number")
    num = parseInt(num);
  if (num > 1000) {
    num = num / 1000;
    num = num.toFixed(1);
    convertNum = num + 'k';
  }

  return convertNum;
}

module.exports = {
  formatTime,
  getTricks,
  getAnswer,
  formatWxParse,
  replaceP,
  formatLargeNumber
}