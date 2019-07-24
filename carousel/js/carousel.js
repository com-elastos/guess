
// 以下正式开始
; (function (global, factory) {

  var appCarousel = {
    initDom: function initDom() {
      // 初始化轮播
      this.initSwiper()
    },
    // 轮播
    initSwiper: function initSwiper() {
      if($('.swiper-container').length > 0) {
        var mySwiper = new Swiper ('.swiper-container', {
          loop: true, // 循环模式选项
          autoplay: {
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: true,
          },

          // 如果需要分页器
          pagination: {
            el: '.swiper-pagination',
          }
        })
      }
    }
  }

  window.appCarousel = appCarousel;
  appCarousel.initDom();
})(typeof window !== "undefined" ? window : this, function (window, $, noGlobal) {

  //获取url上的参数
  var getQueryString = function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
  }



  var formatDate = function formatDate(time, fmt) {
    if (time == '' || time == null || time == undefined) {
      return;
    }
    if (arguments.length === 0) {
      return null;
    }
    if ((time + '').length === 10) {
      time = +time * 1000
    }
    var timer;
    if (typeof time == 'object') {
      timer = time;
    } else {
      timer = new Date(parseInt(time));
    }

    if (!fmt) {
      fmt = "yyyy-MM-dd HH:mm:ss";
    }
    var o = {
      "M+": timer.getMonth() + 1, //月份
      "d+": timer.getDate(), //日
      "h+": timer.getHours() % 12 == 0 ? 12 : timer.getHours() % 12, //小时
      "H+": timer.getHours(), //小时
      "m+": timer.getMinutes(), //分
      "s+": timer.getSeconds(), //秒
      "q+": Math.floor((timer.getMonth() + 3) / 3), //季度
      "S": timer.getMilliseconds() //毫秒
    };
    var week = {
      "0": "日",
      "1": "一",
      "2": "二",
      "3": "三",
      "4": "四",
      "5": "五",
      "6": "六"
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (timer.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[timer.getDay() + ""]);
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }

  return {
    getQueryString: getQueryString,
    formatDate: formatDate
  }

})