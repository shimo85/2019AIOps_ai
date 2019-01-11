/**
 * 消息推送客户端js 
 * 
 */
document.write(" <script lanague=\"javascript\" src=\"https:\/\/push.o.tencent.com\/socket.io\/socket.io.js?v=1\"><\/script>");
push = {
	userId: '',    // 用户信息
	appCode:'',  // 系统注册的id
	topics: [],   // 订阅的消息
	pushUrl: 'https://push.o.tencent.com',  // 消息推送系统url
	unReadMsgCount: 0, // 未读消息数目
	socket: '',
	isQlcoud: false, // 是否为广州版本
	getCookie:function(b){var a=document.cookie.match(new RegExp("(^| )"+b+"=([^;]*)(;|$)"));return !a?"":decodeURIComponent(a[2])},
	delCookie:function(a,b,c){document.cookie=a+"=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path="+(c?c:"/")+"; "+(b?("domain="+b+";"):"")},
	init: function(){
		var user_id = push.getCookie('bk_uid');
		if(!user_id){
			var uin = push.getCookie('uin') ? push.getCookie('uin') : push.getCookie('p_uin');
			uin = uin.substr(1);
			var user_id = parseInt(uin);
		}
		push.userId = user_id;
	},
	listen:function(appCode, showMsgFunc){
		if(push.isQlcoud){
			push.appCode = 'bkapp_q_'+appCode; 
		}else{
			push.appCode = 'bkapp_t_'+appCode; 
		}
		push.init();
		// 默认只监听当前系统的消息
		push.topics = [push.appCode];
		var registerInfo = {'userId':push.userId, 'appCode':push.appCode, 'topics':push.topics};	    
		var socket = io(push.pushUrl);
		push.socket = socket;
		push. socket.on('connect', function() {
        	socket.emit('bind', JSON.stringify(registerInfo), function(result){
        		console.log('bind '+ result);
        	});
        });
	    // 监听订阅的消息
		push.socket.on('channelMessage', function(data){
			showMsgFunc(data);
		});
	},
	/*
	 * 读取消息事件
	 */
	sendReadEvent:function(nId, fn){
		push.init();
        var  readInfo = {'userId':push.userId, 'nId':nId, 'app_code':push.appCode};
        // 向服务器提交已读事件
		push.socket.emit('readEvent', JSON.stringify(readInfo), function(unReadMsgCount){
			// 用户读取消息后的回调方法
			fn(unReadMsgCount);
		});
	}
}
