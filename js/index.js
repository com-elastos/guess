;(function (factory) {
    //time 201907151357
    var registeredInModuleLoader = false;
    if (typeof define === 'function' && define.amd) {
        define(factory);
        registeredInModuleLoader = true;
    }
    if (typeof exports === 'object') {
        module.exports = factory();
        registeredInModuleLoader = true;
    }
    if (!registeredInModuleLoader) {
        var OldCookies = window.Cookies;
        var api = window.Cookies = factory();
        api.noConflict = function () {
            window.Cookies = OldCookies;
            return api;
        };
    }
}(function () {
    function extend () {
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
            var attributes = arguments[ i ];
            for (var key in attributes) {
                result[key] = attributes[key];
            }
        }
        return result;
    }

    function init (converter) {
        function api (key, value, attributes) {
            var result;
            if (typeof document === 'undefined') {
                return;
            }

            // Write

            if (arguments.length > 1) {
                attributes = extend({
                    path: '/'
                }, api.defaults, attributes);

                if (typeof attributes.expires === 'number') {
                    var expires = new Date();
                    expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
                    attributes.expires = expires;
                }

                // We're using "expires" because "max-age" is not supported by IE
                attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

                try {
                    result = JSON.stringify(value);
                    if (/^[\{\[]/.test(result)) {
                        value = result;
                    }
                } catch (e) {}

                if (!converter.write) {
                    value = encodeURIComponent(String(value))
                        .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
                } else {
                    value = converter.write(value, key);
                }

                key = encodeURIComponent(String(key));
                key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
                key = key.replace(/[\(\)]/g, escape);

                var stringifiedAttributes = '';

                for (var attributeName in attributes) {
                    if (!attributes[attributeName]) {
                        continue;
                    }
                    stringifiedAttributes += '; ' + attributeName;
                    if (attributes[attributeName] === true) {
                        continue;
                    }
                    stringifiedAttributes += '=' + attributes[attributeName];
                }
                return (document.cookie = key + '=' + value + stringifiedAttributes);
            }

            // Read

            if (!key) {
                result = {};
            }

            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all. Also prevents odd result when
            // calling "get()"
            var cookies = document.cookie ? document.cookie.split('; ') : [];
            var rdecode = /(%[0-9A-Z]{2})+/g;
            var i = 0;

            for (; i < cookies.length; i++) {
                var parts = cookies[i].split('=');
                var cookie = parts.slice(1).join('=');

                if (!this.json && cookie.charAt(0) === '"') {
                    cookie = cookie.slice(1, -1);
                }

                try {
                    var name = parts[0].replace(rdecode, decodeURIComponent);
                    cookie = converter.read ?
                        converter.read(cookie, name) : converter(cookie, name) ||
                        cookie.replace(rdecode, decodeURIComponent);

                    if (this.json) {
                        try {
                            cookie = JSON.parse(cookie);
                        } catch (e) {}
                    }

                    if (key === name) {
                        result = cookie;
                        break;
                    }

                    if (!key) {
                        result[name] = cookie;
                    }
                } catch (e) {}
            }

            return result;
        }

        api.set = api;
        api.get = function (key) {
            return api.call(api, key);
        };
        api.getJSON = function () {
            return api.apply({
                json: true
            }, [].slice.call(arguments));
        };
        api.defaults = {};

        api.remove = function (key, attributes) {
            api(key, '', extend(attributes, {
                expires: -1
            }));
        };

        api.withConverter = init;

        return api;
    }

    return init(function () {});
}));
// 以上为JS-cookie
// 设置一个时间为7天的cookie Cookies.set('name', 'value', { expires: 7 });
// 获取cookie  Cookies.get('nothing');
// 删除cookie Cookies.remove('name', { path: '' }); // removed!


// 以下正式开始
;(function(global, factory) {
  // 调用一些factory方法
  var factoryMethods = factory(global)

  var voteEndtime = 12;

  var voteBegintime= 15;

  var prodictLast;

  var DIDData;

  var info

  var appGuess = {
    apiRoot: 'http://elahive.club/api/', // 接口路径
    dataMonth: '', // 接口返回的时间月份
    dataDate: '', // 接口返回的时间日期
    dataHour: '', // 接口返回的时间小时
    dataMinute: '', // 接口返回的时间分钟
    lastTimestamp: '', // 前一天时间的时间戳
    lastDate: '', // 前一天时间日期
    currentTimestamp: new Date().getTime(), // 当前时间的时间戳
    currentDate: factoryMethods.formatDate(this.currentTimestamp, 'yyyy-MM-dd'), // 当前时间日期

    initDom: function initDom() {
      // 调用格式化时间实例
      // factoryMethods.formatDate('1562590479', 'yyyy-MM-dd HH:mm:ss')

      // Cookies.set('name', 'value', { expires: 7 });
      //预测昨天的期数
      this.lastTimestamp = new Date().getTime()-24*60*60*1000
      //预测当天的期数
      this.currentTimestamp = new Date().getTime()
      this.lastDate = factoryMethods.formatDate(this.lastTimestamp, 'yyyy-MM-dd')
      this.currentDate = factoryMethods.formatDate(this.currentTimestamp, 'yyyy-MM-dd')

      // 初始化API地址
      // this.initApi()

     var guessstatus = factoryMethods.getQueryString("guessstatus");
     if (guessstatus){
        var subscribe = {}

        subscribe.value = factoryMethods.getQueryString("value");
        subscribe.status = guessstatus;

        subscribe.timestamp = new Date().getTime()
        window.localStorage.setItem('subscribeLast', JSON.stringify(subscribe));
     }

      // Ajax设置
      $.ajaxSetup({
        // type: 'POST',
        dataType: 'JSON',
        contentType: 'application/json;charset=utf-8',
        timeout: 5000,
        cache:false,
        xhrFields: {
          withCredentials: true
        }
      })

      //this.initDid();

      // 请求用户初始化接口
      this.initData()

      // 初始化排行榜数据
      this.initRank()

      // 初始化选择语言积分数
      this.initBetUl()

      // 初始化一些dom操作
      this.initSomeDom()

      // 初始化轮播
      this.initSwiper()

      // 多语言模块
      this.initMultiLang()

      // 语言国际化
      this.initLangI18n()
    },
    // initApi: function initApi() {
    //   var _Self = this;
    //   var localHost = window.location.host;
    //   //
    //   if(localHost == 'pact.youzu.com') {
    //     _Self.apiRoot = ''
    //   } else {
    //     _Self.apiRoot = ''
    //   }
    // },
    initData: function initData() {
      var _Self = this;
      $.ajax({
        data: {},
        type: 'GET',
        url: _Self.apiRoot + '1.json',
        xhrFields: {
          withCredentials: false // 设置为true时开启cookies，但是方法会报错
        },
        success: function(res) {
            // TODO res及其必要元素判空等逻辑
            // if () {
            info = res.data[0];

            // 总奖金池
            var amounts = parseFloat(info.amounts[0] + info.amounts[1]).toFixed(2);
            $('.module-two').find('h4').empty().html('当前奖池<span>'+amounts+'</span>积分')

            // 当前大盘指数
            var dataTime = new Date();
            _Self.dataMonth = dataTime.getMonth() + 1;
            _Self.dataDate  = dataTime.getDate();
            _Self.dataHour = dataTime.getHours();

            _Self.dataMinute = dataTime.getMinutes();
            $('.mark').html(_Self.dataMonth + '月' + _Self.dataDate + '日 大盘指数:<span class="mark-desc">12000  2.58%</span>');

            // 价格波动 // TODO 可以考虑数字颜色——红涨绿跌，根据incressRate的正负识别涨跌
            var incressRate = ((info.prices[1] - info.prices[0]) * 100 / info.prices[0]).toFixed(2);
            if(incressRate >0) {
              $('.mark-desc').addClass('up-color')
            }
            $('.mark-desc').html(info.prices[1] + '   ' + incressRate + '%');

            // 进度百分比
            var leftPercent = $('.percent');
            var rightPercent = $('.right-percent');
            var upPercent = 50;
            if ((Math.abs(info.wallets[0]) > Number.EPSILON) || (Math.abs(info.wallets[1]) > Number.EPSILON))
            {
                upPercent = Math.round(info.wallets[0] * 100 / (info.wallets[0] + info.wallets[1]));
            }

            var progressBar = upPercent + '%';
            var downProgressBar = (100 - upPercent) + '%';
            leftPercent.animate({width: progressBar});
            leftPercent.html(progressBar);
            rightPercent.animate(downProgressBar);
            rightPercent.html(downProgressBar);

            var prodictDOm = $('.prodict-dom'), btnsBox = $('.btns-box');




            prodictLast = JSON.parse(window.localStorage.getItem('subscribeLast')) || []

            //规则   0-12点前，如果当期没有预期过，则可以预测，已经预测过，显示预测结果
            //      12-15点 如果当期没有预期过，则提示请在15:00分后预言下一场，已经预测过，显示预测结果
            //      15-24点 如果下一期没有预期过，则可以预测，已经预测过，显示预测结果
//console.error(prodictLast);
//console.error(factoryMethods.formatDate(prodictLast.timestamp, 'yyyy-MM-dd'));
           // 根据最后一个历史时间戳的hour来判断同一天预测的是上午还是下午预测的,时间戳等回调函数处理

            if(_Self.dataHour < voteEndtime) {
              if(prodictLast &&
                   (factoryMethods.formatDate(prodictLast.timestamp, 'yyyy-MM-dd') == _Self.lastDate
                || factoryMethods.formatDate(prodictLast.timestamp, 'yyyy-MM-dd') == _Self.currentDate)) {
                      if (factoryMethods.formatDate(prodictLast.timestamp, 'yyyy-MM-dd') == _Self.lastDate){
                        var lastHour = new Date(prodictLast.timestamp).getHours();
                        if (lastHour <= voteBegintime){
                            btnsBox.show();
                            prodictDOm.hide();
                            return;
                        }
                      }

                      if(prodictLast.status == 1) {
                        prodictDOm.find('h4').empty().html('您已预言' + prodictLast.value + 'ELA <span class="dowm">涨</span>')
                      } else {
                        prodictDOm.find('h4').empty().html('您已预言' + prodictLast.value + 'ELA <span class="dowm">跌</span>')
                      }
                      prodictDOm.find('p').empty().text('今日15:00结果揭晓')

                    btnsBox.hide();
                    prodictDOm.show();
              } else {
                  btnsBox.show();
                  prodictDOm.hide();
              }
            } else if(_Self.dataHour >= voteEndtime && _Self.dataHour < voteBegintime) {
                  if (prodictLast && (factoryMethods.formatDate(prodictLast.timestamp, 'yyyy-MM-dd') == _Self.currentDate)) {
                      if(prodictLast.status == 1) {
                        prodictDOm.find('h4').empty().html('您已预言' + prodictLast.value + 'ELA <span class="dowm">涨</span>')
                      } else {
                        prodictDOm.find('h4').empty().html('您已预言' + prodictLast.value + 'ELA <span class="dowm">跌</span>')
                      }
                      prodictDOm.find('p').empty().text('预计今日15:00结果揭晓')
                    } else {
                      prodictDOm.find('h4').empty().text('当日预言已经截止')
                      prodictDOm.find('p').empty().text('请在15:00后预言下一场')
                    }
                btnsBox.hide();
                prodictDOm.show();
            } else {
              if(prodictLast) {
                var lastHour = new Date(prodictLast.timestamp).getHours();
                if(factoryMethods.formatDate(prodictLast.timestamp, 'yyyy-MM-dd') == _Self.currentDate && lastHour >= voteBegintime) {
                  if(prodictLast.guessstatus == 1) {
                    prodictDOm.find('h4').empty().html('您已预言' + prodictLast.value + 'ELA <span class="dowm">涨</span>')
                  } else {
                    prodictDOm.find('h4').empty().html('您已预言' + prodictLast.value + 'ELA <span class="dowm">跌</span>')
                  }
                  prodictDOm.find('p').empty().text('预计下一个交易日15：00结果揭晓')
                  btnsBox.hide()
                  prodictDOm.show()
                }
              } else {
                  btnsBox.show()
                  prodictDOm.hide()
              }
            }
        },
        error: function(err) {
          console.error(err);
        },
        complete: function() {

        }
      })
    },

    // 排行榜
    initRank: function initRank() {
      var _Self = this;
      $.ajax({
        data: {},
        type: 'GET',
        url: _Self.apiRoot + '2.json',
        xhrFields: {
          withCredentials: false // 设置为true时开启cookies，但是方法会报错
        },
        success: function(res) {
          var data = res.data[0], counts = data.counts, wallets = data.wallets;
          var rankBox = $('.rank-box'), rankStr='';
          for (var index = 0; index < wallets.length; index++) {
            if(DIDData){
                if(DIDData.ELAAddress == wallets[index]) {
                    wallets[index] = DIDData.DID;
                }
            }
            rankStr +='<li><span class="num">'+index+'</span><img class="icon" src="./img/user-icon.png" alt="" srcset="">' +
            '<div class="name-nick"><h5>'+wallets[index]+'</h5><p>王者预言家</p></div><div class="achieve">' +
            '<p class="red"></p><p></p></div><div class="result"><p>'+counts[index]+'次</p><p>预言战绩</p></div></li>'
          }
          rankBox.empty().html(rankStr)
        },
        error: function(err) {
          console.error(err)
        }
      })
    },
    // 点击档位，结果预览
    initBetUl: function initBetUl() {
      var _Self = this;
      var prodictResult = $('.prodict-result'), prodictStr= '', str = '猜对预计可得<span>40积分</span>，仅供参考';
      $('.bet-ul li').on('click', function(el) {

        el.preventDefault();
        $(this).addClass('current').siblings('li').removeClass('current');
        var thisVal = $(this).data('value');

        var fthisVal = parseFloat(thisVal).toFixed(2);

        var uptotal =  parseFloat(info.amounts[0]).toFixed(2);

        var downtotal =  parseFloat(info.amounts[1]).toFixed(2);


        // 总奖金池
        var newamounts = parseFloat(parseFloat(uptotal) + parseFloat(downtotal) + parseFloat(fthisVal)).toFixed(2);

        var gthisVal = fthisVal;


         if ($('.look').hasClass('look-up')){
            var totalyes = parseFloat(parseFloat(fthisVal) + parseFloat(uptotal)).toFixed(2);
            gthisVal = parseFloat(parseFloat(newamounts)*parseFloat(fthisVal)/parseFloat(totalyes)).toFixed(2);
        }else{
            var totalno = parseFloat(parseFloat(fthisVal) + parseFloat(downtotal)).toFixed(2);
            gthisVal = parseFloat(parseFloat(newamounts)*parseFloat(fthisVal)/parseFloat(totalno)).toFixed(2);
        }

        prodictStr = '猜对预计可得<span>' + gthisVal + 'ELA</span>，仅供参考'
        prodictResult.empty().html(prodictStr);
      })
    },

    initSomeDom: function initSomeDom() {
      var _Self = this;
      var lookWrap = $('#look_wrap'), downBtn = $('.down-btn'), prodictDOm = $('.prodict-dom');
      $('span.close').on('click', function(el) {
        el.preventDefault()
        var dialogWrap = $('.dialog-wrap')
        dialogWrap.fadeOut(300);
      })

      $('.btns-box div').on('click', function(el) {
        var $this = $(this)
        el.preventDefault()
        // 看涨
        if($this.hasClass('up')) {
          lookWrap.find('.look').removeClass('look-down').addClass('look-up')
          downBtn.attr('data-status', true).find('h5').empty().text('我要看涨')
        } else { // 看跌
          lookWrap.find('.look').removeClass('look-up').addClass('look-down')
          downBtn.attr('data-status', false).find('h5').empty().text('我要看跌')
        }
        lookWrap.fadeIn(300)
      })

      downBtn.on('click', function(el) {
        el.preventDefault();
        var thisStatus = $(this).attr('data-status')
        var prodictR = {}
        $('.bet-ul li').each(function(index, item) {
          if($(item).hasClass('current')) {
            prodictR.value = $(item).attr('data-value')
          }
        })

        // 只记录当前一条记录
        //var prodictHistory = JSON.parse(window.localStorage.getItem('prodictHistory')) || []
        // 1表示涨， 2表示跌
        if(thisStatus && thisStatus == 'true') {
          //prodictR.status = 1
          prodictDOm.find('h4').empty().html('您已预言' + prodictR.value + 'ELA <span class="dowm">涨</span>')
        } else {
          //prodictR.status = 2
          prodictDOm.find('h4').empty().html('您已预言' + prodictR.value + 'ELA <span class="dowm">跌</span>')
        }

        lookWrap.fadeOut(200)
        $('.btns-box').fadeOut(200)
        prodictDOm.fadeIn(300)

      //TODO 这里记得修改7月9号的那个日期，那个日期是从api接口里面返回。
      //点击涨和跌的时候记得使用内部浏览器打开www.baid.com即可。

      // 当前页面跳转到baidu => window.location.href = 'https://www.baidu.com'
      // 新页面打来百度的方法 =》
      var preurl = 'elaphant://elapay?AppID=fdde367ea6b90e02930cfc9f7477ca0a6378346683ecf73d758c594dfdccc2bd969e9b6c7a63072e8255916b05c063a6403357f1d2d7f4c90a6fd4fb07fee60f&AppName=guessbtc&Description=guessbtc&DID=iWGmSX9T4JnHjX61ns3QqpsMTuEs2tPYhj&PublicKey=03e2422dcb4e54f26448293f7922b223576944fe9d149a86cbce8fd0fc75d20d6e&CoinName=ELA';

      var fthisVal = parseFloat(prodictR.value).toFixed(4);
      var amount = '&Amount=' + fthisVal;
      var returnurl = 'http://weelink.online/guess/index.html?guessstatus=';
      if(thisStatus && thisStatus == 'true') {
        amount= amount + '0888';
        returnurl = returnurl + 1 + '&value=' + fthisVal;
      } else{
        amount= amount + '0555';
        returnurl = returnurl + 2 + '&value=' + fthisVal;
      }
      var address ='&ReceivingAddress=EgJtsdXMrjpsFGyGpTGTBZfAi2pp1PmGC2';
      window.open(preurl + amount + address + '&ReturnUrl=' + encodeURIComponent(returnurl), '_blank')
      })
    },

    initDid: function initDid() {
      var _Self = this;

     var DIDNewData = factoryMethods.getQueryString("Data");
     if (DIDNewData){
        var didkey = DIDNewData.DID;
        window.localStorage.setItem('DIDData', JSON.stringify(DIDNewData));
     }

    DIDData = JSON.parse(window.localStorage.getItem('DIDData')) || [];
    if(!DIDData) {

      // 当前页面跳转到baidu => window.location.href = 'https://www.baidu.com'
      // 新页面打来百度的方法 =》
      var preurl = 'elaphant://identity?AppID=fdde367ea6b90e02930cfc9f7477ca0a6378346683ecf73d758c594dfdccc2bd969e9b6c7a63072e8255916b05c063a6403357f1d2d7f4c90a6fd4fb07fee60f&AppName=guessbtc&Description=guessbtc&DID=iWGmSX9T4JnHjX61ns3QqpsMTuEs2tPYhj&PublicKey=03e2422dcb4e54f26448293f7922b223576944fe9d149a86cbce8fd0fc75d20d6e&CoinName=ELA';

      var returnurl = 'http://weelink.online/guess/index.html';
      window.open(preurl + amount +'&ReturnUrl=' + encodeURIComponent(returnurl), '_blank');
    }
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
    },

    // 多语言模块
    initMultiLang: function initMultiLang() {
      var langBox = $('.lang-box');
      langBox.on('click', function() {
        langBox.find('ul').fadeToggle()
      })
    },

    // 语言国际化
    initLangI18n: function initLangI18n(lang) {
      var lang= lang? lang: 'zh'
      jQuery.i18n.properties({
        // 加载资浏览器语言对应的资源文件
        name: 'lang', // 资源文件名称
        path: '/js/i18n/', // 资源文件路径
        mode: 'map', // 用 Map 的方式使用资源文件中的值
        language: lang,
        cache: false,
        encoding: 'UTF-8',
        callback: function() { // 加载成功后设置显示内容
          console.error(jQuery.i18n)
          console.error(jQuery.i18n.prop('name'))
          // // 显示“用户名”
          // $('#label_username').html($.i18n.prop('string_username')); 
          //   // 显示“密码”
          // $('#label_password').html($.i18n.prop('string_password')); 
          //     // 显示“登录”
          // $('#button_login').val($.i18n.prop('string_login')); 
        } 
      })
    } 
  }

  window.appGuess = appGuess;
  appGuess.initDom();

})(typeof window !== "undefined" ? window : this, function(window, $, noGlobal ) {

      //获取url上的参数
      var getQueryString =   function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
     }



  var formatDate =   function formatDate(time, fmt) {
    if(time == '' || time == null || time == undefined) {
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