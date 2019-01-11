/**
 * Created by stttt on 2017/9/22.
 */

//获取url的参数
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null){
        return r[2];
    }
    return null;
}

//提交按钮提交
function compet_comment_add(){
    var content = $('#text-word').val();
    var competition_id = GetQueryString('competition_id');
    if (competition_id == null) {
        return;
    }
    if(content == ''){
        toastr.error('内容不能为空!');
        return;
    }
    $.ajax({
        url: site_url + 'submit_comment/',
        type: 'POST',
        data: {
            content: content,
            type: 'compet',
            target_id: competition_id,  //TODO 提交的对象!
            csrfmiddlewaretoken: csrf_token
        },
        success: function (res) {
            if(res.result){
                toastr.success('评论提交成功');
                var order = $('#select_commet').val();
                $("#text-word").val("");
                get_comment_cnt(competition_id);
                get_all_comment(order);
            }else
                {
                toastr.error(res.msg);

            }
        }
    })
}

//获取评论内容
function get_all_comment(order) {
    var com_id = GetQueryString('competition_id');
    if (com_id == null) {
        return;
    }
    $.ajax({
        url: '/compet_comment/?id=' + com_id + '&comment_order=' + order,
        type: "GET",
        dataType: "json",
        success: function (res) {
            var html='';
            var comment_data = res.data;
            if(res.code==0){
                for(var i=0;i<comment_data.length;i++){
                    if (comment_data[i]['portrait']=='') {
                        var imgtag='<img src="'+site_url+'static/images/common/touxiang.png">';
                    }else{
                        var imgtag='<img id="imghead" width=100px height=100px border=0 src="' + comment_data[i]['portrait'] + '">';
                    }
                    if(comment_data[i]["is_author"])
                    {
                    html += '<li><div class="comments-cover comments-common"><div class="avatar-content">' + imgtag + '</div><div class="text-content text-content-detail"><div class="text-wrapper"><a href="javascript;" class="my-name text-link">' +
                            comment_data[i]['owner_username'] + '</a><span class="just-now">' + comment_data[i]['create_time'] + '</span><a class="author-btn">作者</a><p>' + comment_data[i]['content'] + '</p><div class="reply-content"><a class=" text-link">赞同<em>' +
                            comment_data[i]['like_count'] + '</em></a></div></div></div></div></li>'
                    }
                    else
                    {
                        html += '<li><div class="comments-cover comments-common"><div class="avatar-content">' + imgtag + '</div><div class="text-content text-content-detail"><div class="text-wrapper"><a href="javascript;" class="my-name text-link">' +
                            comment_data[i]['owner_username'] + '</a><span class="just-now">' + comment_data[i]['create_time'] + '</span><p>' + comment_data[i]['content'] + '</p><div class="reply-content"><a class=" text-link">赞同<em>' +
                            comment_data[i]['like_count'] + '</em></a></div></div></div></div></li>'
                    }

                }
                $('#all_commnet').html(html);

            }else{
                toastr.error(res.msg);
            }
        }
    })
}

// 获取评论条目
function get_comment_cnt(id){
    $.ajax({
        url: site_url + 'com_comment_count/?id=' + id,
        type: 'GET',
        success: function(res){
            if (res.code==0){
                var _html = '总共' + res.data + '评论';
                $("#comment_cnt").html(_html);
            }else{
                toastr.success(res.data);
            }
        }
    })
}

// 排序动作
$("#select_commet").change(function () {
    var order = $('#select_commet').val();
    var com_id = GetQueryString('competition_id');
    get_comment_cnt(com_id);
    get_all_comment(order);
});


