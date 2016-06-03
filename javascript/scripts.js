/*!
 * Scripts
 *
 */
head.ready(function() {
 "use strict";

	var Engine = {
		utils : {
			links : function(){
				$('a[rel*="external"]').click(function(e){
					e.preventDefault();
					window.open($(this).attr('href'));
				});
			},
			mails : function(){
				$('a[href^="mailto:"]').each(function(){
					var 
						mail = $(this).attr('href').replace('mailto:',''),
						replaced = mail.replace('/at/','@');
					$(this).attr('href','mailto:' + replaced);
					if($(this).text() === mail) {
						$(this).text(replaced);
					}
				});
			},
				navSelectedState : function(nav){
				 // pass in the container tag eg 'nav'
				 jQuery(nav + " ul li").each(function(){
					   if (jQuery(this).find("a").attr('href') === window.location.pathname)
					   {
							 jQuery(this).addClass('selected');
							 jQuery(this).parents("li").addClass('selected');
					   }   
				 });
			},// navSelectedState
			
			dynamicMenuSelectPersist : function(url,navID){
				  if(window.location.href.indexOf(url) != -1){
						jQuery("#"+navID).addClass("selected");
				  }
			},
			
			sefAppLinks : function(wrapper,bullet,target){
				 jQuery(wrapper).each(function(){
					  var link = jQuery(this).find(bullet).attr("href");
					  jQuery(this).find(target).attr("href",link);
				 });
			},
			
			webAppPagination : function(){
                    if(jQuery("ul.pagination.webapp").size() === 0){return;}
                    jQuery(".pagination-a ul").append(jQuery("ul.pagination.webapp").html());
                    jQuery("li.pag-next").addClass("next");
                    jQuery("li.pag-prev").addClass("prev");
                    jQuery(".pagination-a").show();
             }, // webAppPagination
			 
			 latestTweets : function(wrap,twitterUsername,howManyTweets){
                   
                    if(jQuery(wrap).size() === 0){return;}
					
						var pageit = function() {
							
							$(".twitNavi").remove(); // kill more / all
							
							$('.twitter-a').sfTestimonial({
								item: 'ul.twitBody li',
								autorotate: false
							});
						}
                   
						var $twitterUserName = jQuery(wrap+" "+twitterUsername).text();
						var $howManyTweets = jQuery(wrap+" "+howManyTweets).text();
						
						console.log($twitterUserName);
						console.log($howManyTweets);
						
						jQuery(wrap).twit($twitterUserName, {
							limit: $howManyTweets,
							icon: false,
							onready: function() {
								pageit();
							}
						});
                   
              } // latest tweets
		},
		forms : {
			labels : function() {
				$('.search-a label').compactize();
				$('.newsletter-a label').compactize();
				$('.form-b .field label').compactize();
			}
		},
		ui : {
			faq	: function() {
				$('.faq-a').each(function(){
					var
						$root = $(this),
						$dt = $root.find('dt'),
						$toggler = $root.find('dt a');

					$toggler.click(function(e){
						$(this).parent().next('dd:first').toggleClass('active');
						$(this).parent().toggleClass('active');
						return false;
					});
				});
			},
			showcase : function() {
				$('.showcase-a').each(function() {
					var
						$root   = $(this),
						$wrap   = $root.find('div.wrap'),
						$images = $('<ul class="images"></ul>'),
						$infos  = $('<ul class="infos"></ul>'),
						count   = $root.find('div.items article').size();

					// prepare
					$root.find('div.items article').each(function() {
						$images.append('<li>' + $(this).find('figure').html() + '</li>');
						$infos.append('<li><div class="text">' + $(this).find('div.text').html() + '</div></li>');
					});

					// inject
					$root.find('div.items').remove();
					$images.appendTo($wrap).fadeIn(1000);
					$infos.appendTo($wrap).fadeIn(1000);

					if(count <= 1) return;

					var $steps = $('<ul class="steps"><li class="prev off"><a href="#prev">Previous</a></li><li class="next"><a href="#next">Next</a></li></ul>');
					$steps.appendTo($wrap);

					var $paging = $('<ul class="paging"></ul>');
					for(var i=0; i<count; i++){
						$paging.append('<li><a href="#slide'+(i+1)+'"'+(i == 0 ? ' class="active"' : '')+'>'+(i+1)+'</a></li>');
					}
					$paging.appendTo($wrap);

					// move!
					var current = 1;
					var times = {
						info: 500,
						image: 400,
						cycle: 7000
					};
					
					var show = function(position) {
						
						$root.find('ul.steps p').removeClass('off');
						if(position == 1) $root.find('ul.steps li.prev').addClass('off');
						if(position == count) $root.find('ul.steps li.next').addClass('off');

						$root.find('ul.paging li:eq('+(position-1)+') a').addClass('active').parent().siblings().find('a.active').removeClass('active');

						var move = 960;

						$images.find('li:visible').fadeOut(times.image,function() {
							$images.find('li:eq('+(position-1)+')').fadeIn(times.image);
						});

						$infos.find('li:visible').animate({'left': -move,'opacity': '0'},times.info,function() {
							$infos.find('li:eq('+(position-1)+')').fadeIn(times.info/2).animate({'left':0,'opacity':1},times.info/2);
							$(this).hide().css('left',move);
						});

					};

					// prev & next navigation
					$root.find('ul.steps li a').click(function() {
						if($root.find('ul:animated').size() > 0) return false;

						if($(this).parent().is('.prev')){
							if(current == 1){
								current = count;
							} else {
								current--;
							}
						} else {
							if(current == count){
								current = 1;
							} else {
								current++;
							}
						}
						
						show(current);

						return false;
					});
					
					// paging
					$root.find('ul.paging li a').click(function() {
						if($root.find('ul:animated').size() > 0 || $(this).is('.active')) return false;
						var index = $root.find('ul.paging li a').index(this);
						
						current = index + 1;
						show(current);
						
						return false;
					});
					
					// autorotate & pause on mouseover
					if(times.cycle > 0){					
						var showcaseCycle = setInterval(function(){
							if($root.data('over') != 1) $root.find('ul.steps li.next a').trigger('click');
						},times.cycle+(times.image*2));

						$root.bind('mouseenter',function(){
							$(this).data('over',1);
						}).mouseleave(function() {
							$(this).data('over',0);
						});
					}

				});
			},
			testimonials : function() {
				$('.testimonials-a').not(".testimonials-a.inner").sfTestimonial();
			},
			togglesearch : function() {
				$('#top .top-utils').each(function() {
					var
						$root    = $(this),
						$toggler = $root.find('a.search'),
						$form    = $root.find('.search-a');

					$toggler.click(function(e) {
						e.preventDefault();
						$(this).toggleClass('selected');
						$form.toggle(300);
					});
					
				});
			},
			twitter : function() {
				
				/*
				$('.twitter-a').sfTestimonial({
					item: 'ul.items li',
					autorotate: false
				});
				*/
				
				var pageit = function() {
					$('.twitter-a').sfTestimonial({
						item: 'ul.twitBody li',
						autorotate: false
					});
				}
				
				
				
				
				
			}
		},
		fixes : {
			enhancements : function() {
				
				//$(".newslist-a > ul > li:last").css("border","none"); // kill border on last item for news
				
				if($.browser.msie && parseInt($.browser.version,10) < 9){
					$('hr').wrap('<div class="hr"></div>');
					$(':last-child:not(cufon)').addClass('last-child');
				}
			},
			pie : function() {
				$('body').bind('refresh.pie',function() {
					if($.browser.msie && parseInt($.browser.version,10) < 9){
						if(window.PIE !== undefined){							
							$('.INSERT_PIE_ELEMENTS_HERE').each(function() {
								window.PIE.detach(this);
								window.PIE.attach(this);
							});
						}
					}
				});
			}
		},
		
		tweaks : {
			
			webAppPagination : function(targetWrapper){
					if($("ul.pagination.webapp").size() === 0){return;}
						
						 var $target = $("."+targetWrapper);
						 $target.append("<nav class='pagination-a'><ul></ul></nav>");
						
					$(".pagination-a ul").append(jQuery("ul.pagination.webapp").html());
					$("li.pag-next").addClass("next");
					$("li.pag-prev").addClass("prev");
					$(".pagination-a").show();
			 }, // webAppPagination
			 
			footerDate : function(){
				if(jQuery("span.auto-copy").size() === 0){return;}
				var currentTime=new Date();
				var year=currentTime.getFullYear();
				jQuery("span.auto-copy").text(year);
			}


		}
	};

	Engine.utils.links();
	Engine.utils.mails();
	Engine.utils.navSelectedState('nav');
	Engine.utils.latestTweets(".tweets-container",".twitterUserName",".howManyTweets");
	Engine.utils.dynamicMenuSelectPersist("/_blog/","main-nav-blog");
	Engine.forms.labels();
	Engine.ui.showcase();
	Engine.ui.togglesearch();
	Engine.ui.testimonials();
	Engine.ui.faq();
	Engine.fixes.enhancements();
	Engine.tweaks.webAppPagination("stories-a");
	Engine.tweaks.footerDate();
	
});