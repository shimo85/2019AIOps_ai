/* Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (MIT_LICENSE.txt)
 * and GPL Version 2 (GPL_LICENSE.txt) licenses.
 *
 * Version: 1.1.1
 * Requires jQuery 1.3+
 * Docs: http://docs.jquery.com/Plugins/livequery
 */
(function(a){a.extend(a.fn,{livequery:function(e,d,c){var b=this,f;if(a.isFunction(e)){c=d,d=e,e=undefined}a.each(a.livequery.queries,function(g,h){if(b.selector==h.selector&&b.context==h.context&&e==h.type&&(!d||d.$lqguid==h.fn.$lqguid)&&(!c||c.$lqguid==h.fn2.$lqguid)){return(f=h)&&false}});f=f||new a.livequery(this.selector,this.context,e,d,c);f.stopped=false;f.run();return this},expire:function(e,d,c){var b=this;if(a.isFunction(e)){c=d,d=e,e=undefined}a.each(a.livequery.queries,function(f,g){if(b.selector==g.selector&&b.context==g.context&&(!e||e==g.type)&&(!d||d.$lqguid==g.fn.$lqguid)&&(!c||c.$lqguid==g.fn2.$lqguid)&&!this.stopped){a.livequery.stop(g.id)}});return this}});a.livequery=function(b,d,f,e,c){this.selector=b;this.context=d;this.type=f;this.fn=e;this.fn2=c;this.elements=[];this.stopped=false;this.id=a.livequery.queries.push(this)-1;e.$lqguid=e.$lqguid||a.livequery.guid++;if(c){c.$lqguid=c.$lqguid||a.livequery.guid++}return this};a.livequery.prototype={stop:function(){var b=this;if(this.type){this.elements.unbind(this.type,this.fn)}else{if(this.fn2){this.elements.each(function(c,d){b.fn2.apply(d)})}}this.elements=[];this.stopped=true},run:function(){if(this.stopped){return}var d=this;var e=this.elements,c=a(this.selector,this.context),b=c.not(e);this.elements=c;if(this.type){b.bind(this.type,this.fn);if(e.length>0){a.each(e,function(f,g){if(a.inArray(g,c)<0){a.event.remove(g,d.type,d.fn)}})}}else{b.each(function(){d.fn.apply(this)});if(this.fn2&&e.length>0){a.each(e,function(f,g){if(a.inArray(g,c)<0){d.fn2.apply(g)}})}}}};a.extend(a.livequery,{guid:0,queries:[],queue:[],running:false,timeout:null,checkQueue:function(){if(a.livequery.running&&a.livequery.queue.length){var b=a.livequery.queue.length;while(b--){a.livequery.queries[a.livequery.queue.shift()].run()}}},pause:function(){a.livequery.running=false},play:function(){a.livequery.running=true;a.livequery.run()},registerPlugin:function(){a.each(arguments,function(c,d){if(!a.fn[d]){return}var b=a.fn[d];a.fn[d]=function(){var e=b.apply(this,arguments);a.livequery.run();return e}})},run:function(b){if(b!=undefined){if(a.inArray(b,a.livequery.queue)<0){a.livequery.queue.push(b)}}else{a.each(a.livequery.queries,function(c){if(a.inArray(c,a.livequery.queue)<0){a.livequery.queue.push(c)}})}if(a.livequery.timeout){clearTimeout(a.livequery.timeout)}a.livequery.timeout=setTimeout(a.livequery.checkQueue,20)},stop:function(b){if(b!=undefined){a.livequery.queries[b].stop()}else{a.each(a.livequery.queries,function(c){a.livequery.queries[c].stop()})}}});a.livequery.registerPlugin("append","prepend","after","before","wrap","attr","removeAttr","addClass","removeClass","toggleClass","empty","remove","html");a(function(){a.livequery.play()})})(jQuery);

//统计页面点击量(系统应用不添加)
$(function(){
		var bklocation = window.location.href;
		
		//例如: list = ["http:", "", "appcode.test.qcloudapps.com",""]
		var list = bklocation.split('/');
		/*
		 * 活跃度统计（内建应用进行统计）
		 */
		//根据window url 判断是否为普通APP
		var is_app_domain = false;
		try{
			if(typeof String.prototype.endsWith != 'function'){
				var app_domain = 'qcloudapps.com';
				var is_app_domain = list[2].indexOf(app_domain, list[2].length - app_domain.length) !== -1;
				
			}else{
				var is_app_domain = list[2].endsWith('qcloudapps.com');
			}
		}catch(err){
			var is_app_domain = false;
		}
		if(is_app_domain == true){
			var domain_list = list[2].split('.');
			// app独立域名中带有appcode
			if (domain_list.length == 3 && domain_list[1] != 'test'){
				var app_code_analysis = domain_list[0];
			}else{
				var app_code_analysis = 'workbench';
			}
			// 绑定点击事件
			$("a, button, input:button, input:submit, .btn")
			.livequery('click', function() {
				try{
					// 调用统计接口
					//window.top.app_click_record(app_code_analysis, 1);
					var msg = {operation: 'app_click_record',
						   app_code: app_code_analysis}
					window.top.postMessage(JSON.stringify(msg),'*')
				}catch(err){
					console.log(err);
					
				}
			});
			
		}else{
			//平台和系统应用
			var app_code_analysis = 'workbench';
		}
		/*
		 * 在线时长统计，平台、系统应用及内建应用都使用
		 */
		//离线时间限制为2分钟（默认，后台可配）	
		try{
			var time_limit = parseInt(window.top.user_online_time) ? parseInt(window.top.user_online_time) : 12000;
		}catch(err){
			var time_limit = 12000;	
		}
		//默认激活时间、失去焦点时间、最后活动时间均为当前时间
		var as_date_now = new Date();
		var as_s_time = as_date_now, 
			as_e_time = as_date_now, 
			as_l_active = as_date_now;	
		
		//获取浏览器来源 TODO
		//var browser_type = _judge_browser_from();
		
		//页面激活
		window.onfocus = function(){
			as_date_now = new Date();		//当前时间
			as_s_time = as_date_now;		//激活时间
			//逻辑判断，激活时间与上次失效时间间隔小于等于两分钟，认为是在线状态,统计，否则为离线状态，不统计
			var short_time = as_s_time - as_e_time;
			//保存在线时间(时间差大于0且小于2分钟，则记录cookie)
			if(short_time <= time_limit && short_time > 0){
				try{
					//window.top.app_online_record(app_code_analysis, short_time);
					msg = {operation: 'app_online_record',
						   app_code: app_code_analysis,
						   short_time: short_time}
					window.top.postMessage(JSON.stringify(msg),'*');
				}catch(err){
				}
			}
			// 失去焦点的时间、最后活动时间调为和激活时间一致
			as_e_time = as_date_now;
			as_l_active = as_date_now;
		}
		
		//页面失去焦点
		window.onblur = function(){
			as_date_now = new Date();	//当前时间
			as_e_time = as_date_now;		//刷新失去焦点的时间
			//逻辑判断，最后活动时间与现在时间比较，大于2分钟，则记录最后活动时间与激活时间的差值,否则记录失去焦点时间和激活时间差值
			if(as_date_now - as_l_active > time_limit){
				//保存在线时间（最后活动时间与激活时间差，大于0保存）
				if(as_l_active - as_s_time > 0){
					try{
						//window.top.app_online_record(app_code_analysis, as_l_active - as_s_time);
						var _online_time = as_l_active - as_s_time;
						var msg = {operation: 'app_online_record',
								   app_code: app_code_analysis,
								   short_time: _online_time}
						window.top.postMessage( JSON.stringify(msg), '*');
					}catch(err){
						
					}
				}
			}else{
				//保存在线时间（失去焦点时间与激活时间差，大于0保存）
				if(as_e_time - as_s_time > 0){
					try{
						var _online_time = as_e_time - as_s_time;
						var msg = {operation: 'app_online_record',
								   app_code: app_code_analysis,
								   short_time: _online_time}
						window.top.postMessage( JSON.stringify(msg), '*');
						//window.top.app_online_record(app_code_analysis, as_e_time - as_s_time);
					}catch(err){
											
					}
				}
			}
			//变量重置
			as_s_time = as_date_now;
			as_e_time = as_date_now;
			as_l_active = as_date_now;
		}
		
		//页面关闭或刷新（判断方法同失去焦点）
		window.onunload = function (){
			as_date_now = new Date();	//当前时间
			as_e_time = as_date_now;		//刷新失去焦点的时间
			//逻辑判断，最后活动时间与现在时间比较，大于2分钟，则记录最后时间与激活时间的差值,否则记录失去焦点时间和激活时间差值
			if(as_date_now - as_l_active > time_limit){
				//保存在线时间（最后活动时间与激活时间差，大于0保存）
				if(as_l_active - as_s_time > 0){
					try{
						//window.top.app_online_record(app_code_analysis, as_l_active - as_s_time);
						var _online_time = as_l_active - as_s_time;
						 var msg = {operation: 'app_online_record',
								   app_code: app_code_analysis,
								   short_time: _online_time}
						window.top.postMessage(JSON.stringify(msg), '*');
					}catch(err){
						
					}
				}
			}else{
				//保存在线时间（失去焦点时间与激活时间差，大于0保存）
				if(as_e_time - as_s_time > 0){
					try{
						var _online_time = as_e_time - as_s_time;
						var msg = {operation: 'app_online_record',
								   app_code: app_code_analysis,
								   short_time: _online_time}
						window.top.postMessage(JSON.stringify(msg), '*');
						//window.top.app_online_record(app_code_analysis, as_e_time - as_s_time);
					}catch(err){
						
					}
				}
			}
			//变量重置
			as_s_time = as_date_now;
			as_e_time = as_date_now;
			as_l_active = as_date_now;
		}
		
		//页面有click活动，防止长时间页面不活动
		window.onclick = function(){
			as_date_now = new Date();	//当前时间
			//最后活动时间与现在时间比较，大于2分钟，则记录最后时间与激活时间的差值，否则更新最后活动时间
			if(as_date_now - as_l_active > time_limit){
				//保存在线时间（最后活动时间与激活时间差，大于0保存）
				if(as_l_active - as_s_time > 0){
					try{
						var _online_time = as_l_active - as_s_time;
						var msg = {operation: 'app_online_record',
								   app_code: app_code_analysis,
								   short_time: _online_time}
						window.top.postMessage(JSON.stringify(msg), '*');
						//window.top.app_online_record(app_code_analysis, as_l_active - as_s_time);
					}catch(err){
						
					}
				}
				//更新激活时间和失去焦点时间为当前时间
				as_s_time = as_date_now;
				as_e_time = as_date_now;
			}
			//最后活动时间重置
			as_l_active = as_date_now;
		}
		
});


//判断浏览器来源，0：PC，1：phone，2：ipad
function _judge_browser_from(){
	var browser = navigator.userAgent.toLowerCase();
	if(browser.indexOf('ipad') > 0 && browser.indexOf('iphone') > 0){
		return 2;
	}else if((browser.indexOf('linux') > 0 && browser.indexOf('android') > 0) || browser.indexOf('iphone') > 0){
		return 1;
	}else{
		return 0;
	}
}

