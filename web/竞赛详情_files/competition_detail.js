

$('.sumoselect-sort select').SumoSelect({    //初始化化下拉选框 数据集列表
    placeholder: 'This is a placeholder'
});



var bkTabNavItem = $('.bk-tab2-nav .tab2-nav-item');  //初始化tab
var bkTabContent = $('.bk-tab2-pane');
bkTabNavItem.on('click', function() {
    var index = $(this).index();
    if (!$(this).hasClass('active')) {
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        $(bkTabContent[index]).addClass('active');
        $(bkTabContent[index]).siblings().removeClass('active');
    }
});

$('.collect-content').find('.collect-btn').click(function(){  //点击收藏
    $(this).hide();
    console.log(site_url)
    $.get(site_url+"collect_compet/", {"compet_id": compet_id}, function (resp) {
        if(resp.result){
            $('.cancel-collect-btn').css({
                'display': 'inline-block'
            })
        }else{
            toastr.error(resp.message)
        }
    })
})

$('.collect-content').find('.cancel-collect-btn').click(function(){
    $(this).hide();
    $.get(site_url+"cancel_collect_compet/", {"compet_id": compet_id}, function (resp) {
        if(resp.result){
            $('.collect-btn').show();
        }else{
            toastr.error(resp.message)
        }
    })
})

$('.search-btn-content').find('.search-form-input').focus(function(){  //搜索框focus
    $(this).parent().addClass('info-onther').removeClass("info");
    $(this).parent().css({
        'width':290,
        'border':"1px solid #dddddd"

    })
    $(this).css({
        'padding-left':9
    })
})

 $('.search-btn-content').find('.search-form-input').blur(function(){ //搜索框blur
    $(this).parent().addClass('info').removeClass('info-onther')
    $(this).parent().css({
        'width':290,
        'border':'1px solid transparent'
    })
     $(this).css({
        'padding-left':98
    })
})
 
$('#upgrade-table').find('.update-content').closest('tr').next("tr").next("tr").find("td").css({ // 更新内容下拉
    "border-top":"none"
})

$('#upgrade-table').find('.update-content').closest('table').css({
    "border-bottom":"none"
})

$('#upgrade-table').on('click', '.update-content', function(event) {
    $("table").find("tr").last().addClass("last-val")
    if($(this).closest("tr").next("tr").hasClass("last-val")){
        $(this).closest('tr').next('tr').find('.log-table-text').stop().slideToggle();
        $(this).closest('tr').next("tr").next("tr").find("td").toggleClass("br-top-control");
        $(this).closest('tbody').parent("table").toggleClass("br-bm-control");
    }else{
        $(this).closest('tr').next('tr').find('.log-table-text').stop().slideToggle();
        $(this).closest('tr').next("tr").next("tr").find("td").toggleClass("br-top-control");
    }     
});

$('.comment-content').find('#text-word').keyup(function(){  //评论字数限制
    var _this = $(this);
    if(_this.val().length>200){
        _this.val( _this.val().substring(0,200));
    };
    $('.comment-content').find('#num').text(200 - _this.val().length );
})

$('.edit-reply').find('#replay-text').keyup(function(){   //回复评论字数限制
    var _this = $(this);
    if(_this.val().length>200){
        _this.val(_this.val().substring(0,200));
    }
    $('.edit-reply').find('#reply-num').text(200 - _this.val().length);
})

$('.text-content-detail').each(function(){
    var _this = $(this);
    if(_this.find('.reply-deatil-wrapper li').length == 0){
        _this.find('.text-wrapper').css({
            'border-bottom':'none'
        })
    }else{
       
    }
})

$('.text-content-detail').on('click','.reply-content .reply-btn-show',function(){   //点击回复出现回复评论编辑框
    var _this = $(this);
    _this.closest('.text-wrapper').siblings('.reply-deatil-wrapper').find('.edit-reply').show();
});


$('.replay-content').find('.reply-btn').click(function(){   //回复中
    $(this).text('回复中');
    $(this).parent('.replay-content').siblings('textarea').css({
        'color':'#cdcdcd'
    })
    $(this).css({
        'background':'#92c3f6',
        'pointer-events': 'none'
    });
})


$('.SlectBox').on('sumo:opened', function(sumo) {   //控制下来选框的样式
    $(this).closest('.sort-selct-content').find('.CaptionCont label i').css({
        '-moz-transform': 'rotate(180deg)',
        '-webkit-transform': 'rotate(180deg)',
        ' -o-transform': 'rotate(180deg)',
        'transform': 'rotate(180deg)'
    });
});

$('.SlectBox').on('sumo:closed', function(sumo) {    //控制下来选框的样式
    $(this).closest('.sort-selct-content').find('.CaptionCont').css({
        '-moz-transform': 'rotate(0deg)',
        '-webkit-transform': 'rotate(0deg)',
        ' -o-transform': 'rotate(0deg)',
        'transform': 'rotate(0deg)'
    });
}); 


$('.preview-left-content').find('ul li').click(function(){ // 预览tab切换
    var index = $(this).index();
    $(this).addClass('active').siblings().removeClass('active');
    $('.tab-warpper .right-content').eq(index).show().siblings().hide();

})

$('.want-enrol').click(function(){ // 我要报名
    var btn  = this;
    var dialog = new bkDialog({
        title: '是否同意竞赛规则？',
        content: '点击确认就意味着接受了竞赛规则。确认后会成功加入到该竞赛。可以上传竞赛结果',
        cancel: '',
        confirm: '确定',
        style: '#624f75',
        confirmFn: function () {
            var url = site_url + "join_competition/"
            $.get(url, {"competition_id": competition_id},function (resp) {
                if (resp.result) {
                    location.reload();
                    toastr.info(resp.message);
                } else {
                    toastr.info(resp.message);
                }
            })
        },
        cancelFn: function () {
            console.log("cancel");
        }
    });
    dialog.show();
});

$(".upload_reslut").on("click",function () {
    window.location.href = site_url + "upload_competition_result/?competition_id=" + competition_id ;

});







$('.markdown-common').find('.tap-markdown').click(function(){ // 切换文本编辑器
    $(this).hide();
    $(this).parents('.markdown-common').find('.tap-editor').show();
    $(this).parents('.markdown-common').find('.editor-content').find('#editor_text').hide();
    $(this).parents('.markdown-common').find('.editor-content').find('.wangEditor-container').hide();
    $(this).parents('.markdown-common').find('.editor-content').find('#marked').show();
});

$('.markdown-common').find('.tap-editor').click(function(){ // 切换文本编辑器
    $(this).hide();
    $(this).parents('.markdown-common').find('.tap-markdown').show();
     $(this).parents('.markdown-common').find('.editor-content').find('#editor_text').show();
     $(this).parents('.markdown-common').find('.editor-content').find('.wangEditor-container').show();  
     $(this).parents('.markdown-common').find('.editor-content').find('#marked').hide();
});

$('.popover-del').find('.cancel-btn').click(function(){
    $('.popover-del').hide();
})

 $('.popover-del').find('.del-btn').click(function(){
    $('.popover-del').hide();
})

$('.del-content').find('.search-rencent-del').click(function(){
     $('.popover-del').show();
})
