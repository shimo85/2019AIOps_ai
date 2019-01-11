$(function(){
	$(".carousel-ul li:gt(4)").css({
		"margin-top":"-1px",
	});
    $(".carousel-ul li:gt(2)").css({
        "cursor":"default"
    });

    $("#search_input").keypress(function (e) {
        var e = e || window.event;
        if(e.keyCode == 13){
            toastr.info("敬请期待")
        }
    })
    $("#search").on("click",function () {
        toastr.info("敬请期待")
    })

    init_slider()
    function loin_req(login_data) {
        $.post(site_url+'iaccount/login/',login_data,function (resp) {
            // debugger;
            if(typeof(resp)=="string"){ //关闭登录窗口
                $(".login-pops-page").hide();
                $(".login-pops-page").find(".relative-protocol").hide();
                $(".login-pops-page").find(".login-form").removeClass('offset-left')
                $(".login-pops-page").find(".reg-form").removeClass('offset-right')
                location.reload();
            } else if (typeof(resp)=="object") {
                if (!resp.result ){
                    toastr.error(resp.message)
                }
            } else {
                console.log("xxxx")
            }
        })
    }

	function validation (reg,className,validate) {  //登录表单验证
        if (validate) {
        	$(className).css({"border-bottom-color":"#e4e4e4"});
        	$(className).removeClass("invalid");
        	$(className).removeClass("tip-color");
            $(className).parent('.input-control').siblings(".reg-tips").addClass('dn');
            $(className).siblings('.icon-check-1').removeClass('dn');
           	if(className.siblings().hasClass("pwd-code")) {
        		$(className).siblings(".pwd-code").removeClass("tip-color");
        	}else if(className .siblings().hasClass("icon-user")){
        		$(className).siblings(".icon-user").removeClass("tip-color");
        	}else if(className.siblings().hasClass("icon-id")){
        		$(className).siblings(".icon-id").removeClass("tip-color");
        	}else if(className.siblings().hasClass("pwd-code-repeat")){
        		$(className).siblings(".pwd-code-repeat").removeClass("tip-color");
        	}
        } else {
           	$(className).parent('.input-control').siblings(".reg-tips").removeClass('dn');
            $(className).siblings('.icon-check-1').addClass('dn');
            $(className).addClass("tip-color");
            $(className).addClass("invalid")
        	$(className).css({"border-bottom-color":"#d65d49"});
        	if(className.siblings().hasClass("icon-password")) {
        		$(className).siblings(".icon-password").addClass("tip-color");
        	}else if($(className) .siblings().hasClass("icon-user")){
        		$(className).siblings(".icon-user").addClass("tip-color");
        	}else if(className.siblings().hasClass("icon-id")){
        		$(className).siblings(".icon-id").addClass("tip-color");
        	}else if(className.siblings().hasClass("pwd-code-repeat")){
        		$(className).siblings(".pwd-code-repeat").addClass("tip-color");
        	}
        }
	}
	
	function email () {  //邮箱验证
		var regEmail =/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
		var emailClass = $(".input-control .input-email");
		var emailReg = regEmail.test($.trim($(".input-control .input-email").val()))
		validation(regEmail,emailClass,emailReg);
	}

	$(".input-control .input-email").blur(function(){
		email();
	})

    $(".login-form .login-email").blur(function(){
        var regEmail =/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        var emailClass = $(".login-form .login-email");
        var emailReg = regEmail.test($.trim($(".login-form .login-email").val()))
        if(!emailReg){
            toastr.error("请输入正确的邮箱")
        }
	})
	
	function password () {  //密码验证
		var regPwd = /^([A-Z]|[a-z]|[0-9]){6,20}$/;
		var pwdClass = $(".input-control .reg-password");
		var pwdClassReg = regPwd.test($.trim($(".reg-password").val()))
		validation(regPwd,pwdClass,pwdClassReg)
	}
	$(".input-control .reg-password").blur(function(){
		password();
	})
	
	function passwordRepeat () {  //密码重复验证
		var regPwd = /^([A-Z]|[a-z]|[0-9]){6,20}$/;
		var passwordRepeatClass = $(".input-control .reg-password-repeat");
		var passwordRepeatReg = $.trim($(".reg-password-repeat").val()) == $.trim($(".reg-password").val()) &regPwd.test($.trim($(".reg-password-repeat").val()))
		validation(regPwd,passwordRepeatClass,passwordRepeatReg)
	}
	$(".input-control .reg-password-repeat").blur(function(){
		passwordRepeat();
	})

	function name () {  //昵称已被占用
		var nameClass = $(".input-control .reg-name");
		var nameReg = $.trim($(".reg-name").val()) !== "";
		validation(null,nameClass,nameReg)
	}

	$(".input-control .reg-name").blur(function(){
		name();
	})
	
	$("#reg_submit").click(function(){  //点击注册验证
		var rerial = $(".ref-user").serializeArray();
		console.log('rerial',rerial);
		var keyword;
		for (var i =0 ; i < rerial.length;i++) {
			for (var key in rerial[i]) {
				if (rerial[i].value== "") {
					keyword = rerial[i].name;
					$('[name = '+keyword+']').parent('.input-control').siblings(".reg-tips").removeClass('dn');
					$('[name = '+keyword+']').addClass("invalid");
		            $('[name = '+keyword+']').siblings('.icon-check-1').addClass('dn');
		            $('[name = '+keyword+']').addClass("tip-color");
		        	$('[name = '+keyword+']').css({"border-bottom-color":"#d65d49"});
		        	if($('[name = '+keyword+']').siblings().hasClass("pwd-code")) {
		        		$('[name = '+keyword+']').siblings(".pwd-code").addClass("tip-color");
		        	}else if($('[name = '+keyword+']') .siblings().hasClass("icon-user")){
		        		$('[name = '+keyword+']').siblings(".icon-user").addClass("tip-color");
		        	}else if($('[name = '+keyword+']').siblings().hasClass("icon-id")){
		        		$('[name = '+keyword+']').siblings(".icon-id").addClass("tip-color");
		        	}else if($('[name = '+keyword+']').siblings().hasClass("pwd-code-repeat")){
		        		$('[name = '+keyword+']').siblings(".pwd-code-repeat").addClass("tip-color");
		        	}
                    console.log(1)
		        	return false;
				} else {
					$('[name = '+keyword+']').css({"border-bottom-color":"#e4e4e4"})
					$('[name = '+keyword+']').removeClass("invalid");
		        	$('[name = '+keyword+']').removeClass("tip-color");
		            $('[name = '+keyword+']').parent('.input-control').siblings(".reg-tips").addClass('dn');
		            $('[name = '+keyword+']').siblings('.icon-check-1').removeClass('dn');
		            if($('[name = '+keyword+']').siblings().hasClass("icon-password")) {
		        		$('[name = '+keyword+']').siblings(".icon-password").removeClass("tip-color");
		        	}else if($($('[name = '+keyword+']')) .siblings().hasClass("icon-user")){
		        		$('[name = '+keyword+']').siblings(".icon-user").removeClass("tip-color");
		        	}else if($('[name = '+keyword+']').siblings().hasClass("icon-id")){
		        		$('[name = '+keyword+']').siblings(".icon-id").removeClass("tip-color");
		        	}else if($('[name = '+keyword+']').siblings().hasClass("pwd-code-repeat")){
		        		$('[name = '+keyword+']').siblings(".pwd-code-repeat").removeClass("tip-color");
		        	}
				}
			}
		}

        var post_data = {};
        for (var j =0 ; j < rerial.length;j++) {
            post_data[rerial[j].name]=rerial[j].value
        }
        post_data["nickname"]=post_data["username"];
        post_data["csrfmiddlewaretoken"]=csrf_token;
        console.log(post_data)
        $.post(site_url+'iaccount/reg_user/',post_data,function (resp) {
            if(resp.result){
                var login_data = {}
                login_data["email"]=resp.data.email
                login_data["password"]=resp.data.password
                login_data["csrfmiddlewaretoken"]=csrf_token;
                loin_req(login_data)
                // $(".login-pops-page").find('.login-common-arrow').css({maxHeight:582})
 		        // $(".login-pops-page").find(".reg-form").removeClass('offset-right');
 		        // $(".login-pops-page").find(".login-form").removeClass('offset-left');
            }else{
                //停留在注册页面
                toastr.error(resp.message)
                console.log("继续注册")
                //关闭注册窗口
                $(".login-pops-page").hide();
                $(".login-pops-page").find(".login-form").removeClass('offset-left');
                $(".login-pops-page").find(".reg-form").removeClass('offset-right');
            }
        })
        console.log("sss")
	});

    function init_slider() {
        $(".slider-hook").slider({
		width: 300, // width
		height: 40, // height
		sliderBg: "rgb(240, 240, 240)", // 滑块背景颜色
		color: "#aaaaaa", // 文字颜色
		fontSize: 14, // 文字大小
		bgColor: "#7bb94d", // 背景颜色
		textMsg: "按住滑块，拖拽验证", // 提示文字
		successMsg: "验证通过", // 验证成功提示文字
		successColor: "#fff", // 滑块验证成功提示文字颜色
		time: 400, // 返回时间
		callback: function(result) { // 回调函数，true(成功),false(失败)
			$("#result2").text(result);
		}
	});
    }

	
	$("#protocol-text").mCustomScrollbar({  //协议滚动条初始化
	    setHeight:340, //设置高度
	    theme:"minimal-dark" //设置风格
	});

	$("#match_result_content").mCustomScrollbar({  //模糊搜索滚动条初始化
	    setHeight:200, //设置高度
	    theme:"minimal-dark" //设置风格
	});
	
	// function highlight() { //模糊查询 
	// 	clearSelection()
	// 	var searchInputVal = $('#search_input').val();
	// 	var regRepalce = new RegExp(searchInputVal,'g');
	// 	$('.match-box').each(function(){
	// 		var _this = $(this);
	// 		var searchHtml = _this.find('.search-text').html();
	// 		var newHtml = searchHtml.replace(regRepalce,'<strong>' + searchInputVal + '</strong>');
	// 		_this.find('.search-text').html(newHtml);

	// 	})
	// 	$('.match-box .search-text').each(function(){
	// 		var _this =$(this);
	// 		if(_this.find('strong').text() == searchInputVal){
	// 			_this.closest('.match-result-content').show();
 //                $('.no-match-data').hide();

	// 		} else {
	// 			_this.closest('.match-result-content').hide();
 //                $('.no-match-data').show();
 //                $('.no-match-data').find('.no-match-text span').text(searchInputVal);
	// 		}
	// 	})
		
	// }

	// $('#search_input').on('input',function(){  //模糊查询
	// 	var uesrkey = $('#search_input').val();
	// 	if(uesrkey == ''){
	// 		$('.match-box .search-text').each(function(){
	// 			var _this =$(this);		
	// 			_this.closest('.match-result-content').hide();
 //                $('.no-match-data').hide();
	// 		})
	// 	} else {
	// 		highlight();
	// 	}
	// })
   		
 //   	function clearSelection() {  //清楚匹配的内容
 //        $('.match-box .search-text').each(function() {
 //            $(this).find('strong').each(function() //找到所有highlight属性的元素；
 //            {
 //                $(this).replaceWith($(this).html()); //将他们的属性去掉；
 //            });
 //        });
 //    }

    $(".nav-login").find("#login-btn").click(function(){ 
    	$(".login-pops-page").find('.login-common-arrow').css({maxHeight:582})   //点击登录按钮
    	$(".login-pops-page").show();
    	$(".login-pops-page").find(".login-common-arrow").show();
    	$(".login-pops-page").find(".login-form").show();
    });

    $(".nav-login").find(".reg-btn").click(function(){
        console.log("xxx")
        $('.ref-user').find('input').val("")
    	$(".login-pops-page").find('.login-common-arrow').css({maxHeight:582})   //点击注册按钮
    	$(".login-pops-page").show();
    	$(".login-pops-page").find(".login-common-arrow").show();
        $(".login-pops-page").find('.login-common-arrow').css({maxHeight:100+"%"})
    	$(".login-pops-page").find(".login-form").addClass('offset-left');
    	$(".login-pops-page").find(".reg-form").addClass('offset-right');
        $(".login-pops-page").find(".reg-form").show();
    });

    $("#logout-btn").click(function() {
        var login_data = {}
        login_data["csrfmiddlewaretoken"]=csrf_token;
        console.log(login_data)
        $.post(site_url+'iaccount/logout/',login_data,function (resp) {
            debugger;
            if(typeof(resp)=="string"){
                //关闭登录窗口
                $(".login-pops-page").hide();
                $(".login-pops-page").find(".relative-protocol").hide();
                $(".login-pops-page").find(".login-form").removeClass('offset-left')
                $(".login-pops-page").find(".reg-form").removeClass('offset-right')
                window.location.href='/';
            }else if(typeof(resp)=="object"){
                if(!resp.result){
                    toastr.error(resp.message)
                }
            }else{
                console.log("xxxx")
            }
        })
    })


    $("#login_submit").click(function () {
        var user_info = $(".login-user").serializeArray();
		console.log(user_info)
        var login_data = {}
        for(var i =0 ; i < user_info.length;i++){
            login_data[user_info[i].name]=user_info[i].value
        }
		if(login_data['email']==""){
			toastr.error("请输入邮箱账号");
			return false
		}
		if(login_data['password']==""){
			toastr.error("请输入密码");
			return false
		}
        login_data["csrfmiddlewaretoken"]=csrf_token;
        console.log(login_data)
        loin_req(login_data)
    })
       
    $(".login-pops-page").find(".reg-login").click(function(){
        debugger;
        $(".login-pops-page").find('.login-common-arrow').css({maxHeight:100+"%"});    //点击注册账户
    	$(".login-pops-page").find(".login-form").addClass('offset-left');
    	$(".login-pops-page").find(".reg-form").addClass('offset-right');
    });

  	$('.forget-pwd').on("click", function () {
		toastr.info("请联系管理员")
	});

	$(".reg-btn-box").find(".return-login").click(function(){    //返回登录
		$(".login-pops-page").find('.login-common-arrow').css({maxHeight:582});
 		$(".login-pops-page").find(".reg-form").removeClass('offset-right');
 		$(".login-pops-page").find(".login-form").removeClass('offset-left');
    });

   
    $(".agreement-btn").find("#reg-agreement").click(function(){   //点击查看协议
     	// $(".login-pops-page").find(".login-form").addClass('offset-left');
        // $(".login-pops-page").find(".reg-form").addClass('offset-right');
        // $(".login-pops-page").find(".relative-protocol").show();
        // $(".login-pops-page").find(".login-common-arrow").hide();
		window.location.href=site_url+"protocol/"
    });
  
    $(".login-pops-page").find("#close-btn").click(function(){   //点击关闭弹窗
    	$(".login-pops-page").hide();
    	$(".login-pops-page").find(".login-form").removeClass('offset-left');
    	$(".login-pops-page").find(".reg-form").removeClass('offset-right');
    });

    $(".login-pops-page").find(".protocol-close-btn").click(function(){
     	$(".login-pops-page").hide();
     	$(".login-pops-page").find(".relative-protocol").hide();
        $(".login-pops-page").find(".login-form").removeClass('offset-left');
    	$(".login-pops-page").find(".reg-form").removeClass('offset-right');
    });

     
    $(".protocol-btn").find("#have-reading").click(function(){  //已阅读
     	$(".login-pops-page").find(".relative-protocol").hide();
     	$(".login-pops-page").find(".login-common-arrow").show();
    });
	
})