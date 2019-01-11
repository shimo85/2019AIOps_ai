//-----------------------------------------------------------
/**
 * 调试配置，请只在这个地方进行设置，不要动其他代码
 */
var debug = true; // 是否是调试模式，注意：在上传代码的时候，要改为false
//-----------------------------------------------------------

//以下公用代码区域，使用范围非常广，请勿更改--------------------------------

// TODO 403 ajax 请求错误时artdialog提示
if (typeof(remote_static_url) == "undefined"){
	remote_static_url = 'http://o.qcloud.com/static_api/';
}
document.write(" <script lanague=\"javascript\" src=\""+remote_static_url+"artdialog/jquery.artDialog.js?skin=simple\"> <\/script>");
//csrftoken处理js
function choose_csrftoken_by_jquery(){
	var jquery_version = $().jquery;
	var current_version = jquery_version.split('.');
	var compare_version = [1, 10, 0];
	var result = true;
	for(var i = 0; i < 3 && result; i++){
		if(parseInt(current_version[i]) < compare_version[i]){
			result = false;
		}else if(parseInt(current_version[i]) > compare_version[i]){
			break;
		}
	}
	//大于或等于1.10.0
	if(result){
		document.write(" <script lanague=\"javascript\" src=\""+remote_static_url+"csrftoken_v3.js\"> <\/script>");
	}
	else{
		document.write(" <script lanague=\"javascript\" src=\""+remote_static_url+"csrftoken.js\"> <\/script>");
	}
}
choose_csrftoken_by_jquery();

/*
 * 打开登录窗口
 */
function open_login_dialog(src){
	var login_html = '<div class="mod_login" id="loginbox" style="padding: 0px 0px; visibility: visible;" align="center">' +
								'<iframe name="login_frame" id="login_frame"  width="100%" height="100%" frameborder="0" allowtransparency="yes"  src="'+src+
								'" style="width:374px;height: 320px;"></iframe>' +
							 '</div>';
	art.dialog({
		id:"401_dialog",
		fixed: true,
		lock: true,
		padding: "0px 0px",
		content: login_html
	});
}
/*
 * 关闭登录框
 */
function close_login_dialog(){
	art.dialog({id: '401_dialog'}).close();
}
/*
 *  登录提示
 * 不在蓝鲸平台中，则跳转到蓝鲸平台中
 */
function jump_to_pt(app_code){
	var d_tips = "温馨提示：请在蓝鲸平台中使用该应用！<br>即将跳转至蓝鲸平台！"
	var tips =arguments[1]? arguments[1]:d_tips;
	if (typeof(bk_url) == "undefined"){
		bk_url = 'http://o.qcloud.com';
	}
	// 当前应用的宣传链接
	if(app_code){
		var jump_url = bk_url + "/?app=" + app_code;
	}else{
		var jump_url = bk_url + "/";
	}
	art.dialog({
		title: "温馨提示",
		width: 340,
		icon: 'warning',
		lock: true,
		content: tips,
		time: 2,
		close: function () {
			window.top.location = jump_url;
		}
	});
}

/**
 * ajax全局设置
 */
// 在这里对ajax请求做一些统一公用处理
$.ajaxSetup({
//	timeout: 8000,
	statusCode: {
	    401: function(xhr) {
	    	// 打开登录对话框
	    	var _src = xhr.responseText;
	    	try{
	    		window.top.BLUEKING.corefunc.open_login_dialog(_src);
	    	}catch(err){
	    		open_login_dialog(_src);
	    	}
	    },
	    402: function(xhr) {
	    	// 功能开关
	    	var _src = xhr.responseText;
	    	ajax_content = '<iframe name="403_iframe" frameborder="0" src="'+_src+'" style="width:570px;height:380px;"></iframe>';
			art.dialog({
			    title: "提示",
			    lock: true,
			    content: ajax_content
			});
	    	return;
	    },
	    500: function(xhr, textStatus) {
	    	// 异常
	    	if(debug){
	    		toastr.error("系统出现异常("+xhr.status+'):' + xhr.responseText);
	    	}
	    	else{
	    		toastr.error("系统出现异常, 请记录下错误场景并与开发人员联系, 谢谢!");
	    	}
	    }
	}
});
/************************ptlogin2 方法*******************************************/
//ptlogin2会自动调用
function ptlogin2_onResize(width, height) {
	  var lgnBox=document.getElementById("loginbox");
	  var frame=document.getElementById("login_frame");
	  lgnBox.style.height=height+"px";
	  frame.style.height=height+"px";
	  lgnBox.style.width=width+"px";
	  frame.style.width=width+"px";
	  lgnBox.style.visibility="hidden";
	  lgnBox.style.visibility="visible";
};
function ptlogin2_onClose(){
	  //弹出Iframe方式的范例
	  login_wnd = document.getElementById("loginbox");
	  login_wnd.style.display="none"
}
if (typeof window.postMessage !== 'undefined') {
	window.onmessage = function(event) {
		var msg = event || window.event; // 兼容IE8
		var data;
		if (typeof  JSON !== 'undefined') // IE7兼容模式不存在JSON对象
			data = JSON.parse(msg.data);
		else
			data = str2JSON(msg.data);

		switch (data.action) {
			case 'close':
			ptlogin2_onClose();
			break;

			case 'resize':
				ptlogin2_onResize(data.width, data.height);
			break;

			default: //什么也不做，便于我们扩展接口
			break;
		}
		// 考虑到ptlogin接口的扩展性，希望业务在对于data.action的条件处理也要保持一定的可扩展性
		// 如不要采用：data.action == 'resize' ? ptlogin2_onResize(data.width, data.height) : ptlogin2_onClose()
		// 一旦ptlogin支持了新的接口，那么该代码将会无法正常工作，影响业务正常使用
	}
}
/**
 * [str2JSON 降字符串转换成json对象（供业务参考）]
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function str2JSON(str) {
	eval('var __pt_json='+str);
	return __pt_json;
}

/**
 * xssCheck 将用js渲染的html进行转义
 * @param str 需要转义的字符串
 * @param reg 需要转义的字符等，可选参数
*/
function xssCheck(str,reg){
    return str ? str.replace(reg || /[&<">'](?:(amp|lt|quot|gt|#39|nbsp|#\d+);)?/g, function (a, b) {
        if(b){
            return a;
        }else{
            return {
                '<':'&lt;',
                '&':'&amp;',
                '"':'&quot;',
                '>':'&gt;',
                "'":'&#39;',
            }[a]
        }
    }) : '';
}
