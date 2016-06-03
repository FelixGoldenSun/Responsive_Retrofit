/**
 * Twit
 *  jQuery Plugin to Display Twitter Tweets on a Blog.
 *  http://code.google.com/p/jquery-twit/
 *
 * Copyright (c) 2010 Yusuke Horie
 *
 * Released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Since  : 0.1.0 - 08/26/2009
 * Version: 0.2.0 - 02/17/2010
 * 
 * updated to support new Twitter API versioning - 10-11-2012
 *
 */
(function(jQuery){

  var _i = 0;

  /** public methods **/

  jQuery.fn.twit = function (user, options) {
    if (typeof user != 'string') return this;

    var
      opts = jQuery.extend({}, jQuery.fn.twit.defaults, options),
      c = jQuery.isFunction(opts.callback) ? opts.callback: _callback,
      url='https://api.twitter.com/1/statuses/user_timeline.json?screen_name='+user,
      params = {};

    opts.user = user;
    params.count = opts.count;

    return this.each(function(i, e) {
      var $e = $(e);
      if (!$e.hasClass('twit')) $e.addClass('twit');

      jQuery.ajax({
        url: url,
        data: params,
        dataType: 'jsonp',
        success: function (o) {
          c.apply(this, [(o.results) ? o.results: o, e, opts]);
                 if(jQuery.isFunction(opts.onready)) opts.onready();
        }
      });
    });
  };

  jQuery.fn.twit.defaults = {
    user: null,
    callback: null,
    icon: true,
    username: true,
    text: true,
    count: 200,
    limit: 7,
    label: 'Twitter',
    title: ''
  };

  /** private method **/

  var _callback = function (o, e, opts) {
    var $this = $(e);
    if (!o || o.length == 0 || $this.length == 0) return false;
    $this.data('_inc', 1);
    _i++;

    var username = o[0].user.screen_name,
        icon = o[0].user.profile_image_url;

    var h =
      '<div class="twitHeader">' +
      ' <span class="twitLabel">' + opts.label + '</span>&nbsp;&nbsp;' +
      ' <span class="twitTitle">' + opts.title + '</span>' +
      '</div>';
    if (opts.icon || opts.username) {
      h += '<div class="twitUser">';
      if (opts.icon)
        h +=
          ' <a href="http://twitter.com/' + username + '/">' +
          '  <img src="' + icon + '" alt="' + username + '" title="' + username + '" style="vertical-align:middle;" />' +
          ' </a>&nbsp;&nbsp;';
      if (opts.username)
        h += '<a href="http://twitter.com/' + username + '/">' + username + '</a>';
      h += '</div>';
    }
    h += '<ul class="twitBody" id="twitList' + _i + '">' + _build(o, $this, opts) + '</ul>';

    $this.html(h);

    $('a.twitEntryShow', '#twitList' + _i).live('click', function (e) {
      e.preventDefault();
      var $t = $(this);

      $t.parent().fadeOut(400, function () {
        var i = $this.data('_inc');
        i++;
        $this.data('_inc', i);

        if ($t.hasClass('twitEntryAll')) {
          $t.die('click');
          var start = (i*opts.limit) - opts.limit;
          $(this).after(_build(o, $this, opts, start, o.length)).remove();
        } else {
          $(this).after(_build(o, $this, opts)).remove();
        }
      });
    });

  };

  var _build = function (o, $t, opts, s, e) {
    var
      h = '',
      inc = $t.data('_inc'),
      start = s || (inc*opts.limit) - opts.limit,
      end = e || ((o.length > start + opts.limit) ? start + opts.limit: o.length);

    for (var i=start; i<end; i++) {
      var
        t = o[i],
        username = t.user.screen_name,
        icon = t.user.profile_image_url;

      h += '<li class="twitEntry">';
      if (opts.text) {
        var text = t.text
          .replace(/(https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/, function (u) {
            var shortUrl = (u.length > 30) ? u.substr(0, 30) + '...': u;
            return '<a href="' + u + '">' + shortUrl + '</a>';
          })
          .replace(/@([a-zA-Z0-9_]+)/g, '@<a href="http://twitter.com/$1">$1</a>')
          .replace(/(?:^|\s)#([^\s\.\+:!]+)/g, function (a, u) {
            return ' <a href="http://twitter.com/search?q=' + encodeURIComponent(u) + '">#' + u + '</a>';
          });
        h += ' <span>' + text + '</span>';
      }

      h += '</li>';
    }

    if (o.length > end) {
      h +=
        '<li class="twitNavi">' +
        '<a href="#" class="twitEntryShow">more</a> &nbsp;/&nbsp;';
      if (o.length > opts.limit)
        h += '<a href="#" class="twitEntryShow twitEntryAll">all</a>';
      h += '</li>';
    }
    return h;
  };

})(jQuery);


/*!
 * CSS Browser Selector v0.4.0 (Nov 02, 2010)
 * http://rafael.adm.br/css_browser_selector
 */
function css_browser_selector(u){var ua=u.toLowerCase(),is=function(t){return ua.indexOf(t)>-1},g='gecko',w='webkit',s='safari',o='opera',m='mobile',h=document.documentElement,b=[(!(/opera|webtv/i.test(ua))&&/msie\s(\d)/.test(ua))?('ie ie'+RegExp.$1):is('firefox/2')?g+' ff2':is('firefox/3.5')?g+' ff3 ff3_5':is('firefox/3.6')?g+' ff3 ff3_6':is('firefox/3')?g+' ff3':is('gecko/')?g:is('opera')?o+(/version\/(\d+)/.test(ua)?' '+o+RegExp.$1:(/opera(\s|\/)(\d+)/.test(ua)?' '+o+RegExp.$2:'')):is('konqueror')?'konqueror':is('blackberry')?m+' blackberry':is('android')?m+' android':is('chrome')?w+' chrome':is('iron')?w+' iron':is('applewebkit/')?w+' '+s+(/version\/(\d+)/.test(ua)?' '+s+RegExp.$1:''):is('mozilla/')?g:'',is('j2me')?m+' j2me':is('iphone')?m+' iphone':is('ipod')?m+' ipod':is('ipad')?m+' ipad':is('mac')?'mac':is('darwin')?'mac':is('webtv')?'webtv':is('win')?'win'+(is('windows nt 6.0')?' vista':''):is('freebsd')?'freebsd':(is('x11')||is('linux'))?'linux':'','js']; c = b.join(' '); h.className += ' '+c; return c;}; css_browser_selector(navigator.userAgent);

/*!
 * (v) Compact labels plugin (v20110124)
 * Takes one option: labelOpacity [default: true] set to false to disable label opacity change on empty input focus
 */
(function($){$.fn.compactize=function(options){var defaults={labelOpacity:true};options=$.extend(defaults,options);return this.each(function(){var label=$(this),input=$('#'+label.attr('for'));input.focus(function(){if(options.labelOpacity){if(input.val()===''){label.css('opacity','0.5');}}else{label.hide();}});input.keydown(function(){label.hide();});input.blur(function(){if(input.val()===''){label.show();if(options.labelOpacity){label.css('opacity',1);}}});window.setInterval(function(){if(input.val()!==''){label.hide();}},50);});};})(jQuery);

/*!
 * (v) hrefID jQuery extention
 * returns a valid #hash string from link href attribute in Internet Explorer
 */
(function($){$.fn.extend({hrefId:function(){return $(this).attr('href').substr($(this).attr('href').indexOf('#'));}});})(jQuery);

/*!
 * (v) EqualHeights v1.12
 * Sets equal height for all passed elements (keeping padding in mind)
 */
(function($){"use strict";$.fn.equalHeights=function(){$(window).resize($.proxy(function(){var tallest=0;$(this).css('min-height',0);$(this).each(function(){if($(this).outerHeight()>tallest){tallest=$(this).outerHeight();}});$(this).each(function(){var padding=$(this).outerHeight()-$(this).height();var height=tallest-padding;$(this).css({'min-height':height});if($.browser.msie&&parseInt($.browser.version,10)===6){$(this).height(height);}});},this)).triggerHandler('resize');return this;};})(jQuery);

/*!
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 * Open source under the BSD License. Copyright © 2008 George McGinley Smith
*/
jQuery.easing['jswing']=jQuery.easing['swing'];jQuery.extend(jQuery.easing,{def:'easeOutQuad',swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d);},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+b;},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+b;},easeInOutQuad:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t+b;return-c/2*((--t)*(t-2)-1)+b;},easeInCubic:function(x,t,b,c,d){return c*(t/=d)*t*t+b;},easeOutCubic:function(x,t,b,c,d){return c*((t=t/d-1)*t*t+1)+b;},easeInOutCubic:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t+b;return c/2*((t-=2)*t*t+2)+b;},easeInQuart:function(x,t,b,c,d){return c*(t/=d)*t*t*t+b;},easeOutQuart:function(x,t,b,c,d){return-c*((t=t/d-1)*t*t*t-1)+b;},easeInOutQuart:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t+b;return-c/2*((t-=2)*t*t*t-2)+b;},easeInQuint:function(x,t,b,c,d){return c*(t/=d)*t*t*t*t+b;},easeOutQuint:function(x,t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b;},easeInOutQuint:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t*t+b;return c/2*((t-=2)*t*t*t*t+2)+b;},easeInSine:function(x,t,b,c,d){return-c*Math.cos(t/d*(Math.PI/2))+c+b;},easeOutSine:function(x,t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b;},easeInOutSine:function(x,t,b,c,d){return-c/2*(Math.cos(Math.PI*t/d)-1)+b;},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b;},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;},easeInOutExpo:function(x,t,b,c,d){if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b;return c/2*(-Math.pow(2,-10*--t)+2)+b;},easeInCirc:function(x,t,b,c,d){return-c*(Math.sqrt(1-(t/=d)*t)-1)+b;},easeOutCirc:function(x,t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b;},easeInOutCirc:function(x,t,b,c,d){if((t/=d/2)<1)return-c/2*(Math.sqrt(1-t*t)-1)+b;return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b;},easeInElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4;}else{var s=p/(2*Math.PI)*Math.asin(c/a);}return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;},easeOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4;}else{var s=p/(2*Math.PI)*Math.asin(c/a);}return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b;},easeInOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4;}else{var s=p/(2*Math.PI)*Math.asin(c/a);}if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b;},easeInBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b;},easeOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;},easeInBounce:function(x,t,b,c,d){return c-jQuery.easing.easeOutBounce(x,d-t,0,c,d)+b;},easeOutBounce:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b;}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b;}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b;}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b;}},easeInOutBounce:function(x,t,b,c,d){if(t<d/2)return jQuery.easing.easeInBounce(x,t*2,0,c,d)*.5+b;return jQuery.easing.easeOutBounce(x,t*2-d,0,c,d)*.5+c*.5+b;}});

/**
 * sfTestimonial
 *
 * @version: 1.1
 * @author SimpleFlame http://www.simpleflame.com/
 *
 * Settings
 *  nextClass   - optional class for the next link
 *  item        - selector matching single testimonial
 *  nextLabel   - text of the next link
 *  duration    - autorotate interval
 *  autorotate  - autorotate on/off switch
 *  activeClass - which testimonial should be displayed as the first active one
 */
(function($){var sfTestimonial=function(el,options){var defaults={nextClass:null,prevClass:null,item:'div.item',nextLabel:'Next',prevLabel:'Prev',duration:5000,autorotate:true,activeClass:'active'};this.options=$.extend(defaults,options);this.wrapper=$(el);this.items=this.wrapper.find(this.options.item);this.current=this.items.index('.'+this.options.activeClass);if(this.current<0){this.current=0;} this.items.hide().eq(this.current).show();this.buildNavigation();if(this.options.autorotate){this.autorotate();}};sfTestimonial.prototype.buildNavigation=function(){var buildNavItem=$.proxy(function(label,offset,className){var el=$('<a>',{'href':'#','text':label,click:$.proxy(function(e){e.preventDefault();this.cycle(offset);},this)});if(className){el.addClass(className);} return $('<li />').append(el);},this);var next=buildNavItem(this.options.nextLabel,1,this.options.nextClass),prev=buildNavItem(this.options.prevLabel,-1,this.options.prevClass);var ul=$('<ul class="nav" />').append(next,prev);this.wrapper.append(ul);};sfTestimonial.prototype.cycle=function(){var offset=arguments[0]||1;this.items.stop().eq(this.current).hide();this.current=this.current+offset;if(this.current===this.items.length){this.current=0;} else if(this.current===-1){this.current=this.items.length-1;} this.items.stop().eq(this.current).fadeIn();if(this.options.autorotate){this.autorotate();}};sfTestimonial.prototype.autorotate=function(){window.clearTimeout(this.timeout);this.timeout=window.setTimeout($.proxy(function(){this.cycle();},this),this.options.duration);};$.fn.sfTestimonial=function(){var options=arguments[0]||{};return this.each(function(){return new sfTestimonial(this,options);});};})(jQuery);