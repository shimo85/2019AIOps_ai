/**
 * Created by isiahhuang on 2017/8/29.
 */

function get_competition_list() {
    load_rank()
    // var compet_id = _id
    // var post_data = new Object();
    // if (compet_id) {
    //     post_data["compet_id"] = compet_id;
    //     var request_url = site_url + 'competition_list_rank/';
    //     // var _get_data = JSON.stringify(post_data);
    //      $.get(request_url, {"competition_id": _id},function (data) {
    //          console.info(data);
    //          if (data.code == 0) {
    //                 make_rank_table(data.data);
    //             }
    //             else {
    //                 toastr.error(data.message);
    //                 var html = '';
    //                 $("#rank_list_body").html(html);
    //             }
    //      });
        //  $.ajax({
        //     url: request_url,
        //     cache: false,
        //     type: "GET",
        //     data: _get_data,
        //     dataType: "json",
        //     success: function (data) {
        //         //$("#loding-img-1").hide();
        //         if (data.code == 0) {
        //
        //             make_rank_table(data.data);
        //         }
        //         else {
        //             toastr.error(data.message);
        //             var html = '';
        //             $("#rank_list_body").html(html);
        //         }
        //     },
        //     error: function (data) {
        //         //$("#loding-img-1").hide();
        //         toastr.info("敬请期待");
        //         //$("#rank_list_body").html(html);
        //     }
        // })
    // }
}

function add_rest_rank_list (cnt) {
    var compet_id = _id;
    var post_data = new Object();
    if (compet_id) {
        post_data['start_point'] = 11;
        post_data['end_point'] = cnt;
        post_data["compet_id"] = compet_id;
        var request_url = site_url + 'competition_list_rank/';
        var _post_data = JSON.stringify(post_data);
        $.get(request_url, _post_data,function (data) {

                //$("#loding-img-1").hide();
                if (data.code == 0) {
                    var rank_list = data.data.rank_list;
                    var _html = $("#rank_list_body").html();
                    for (row in rank_list) {
                        _html += '<tr><td>' + rank_list[row]["team_rank"] + '</td><td>' + rank_list[row]["team_name"] + '</td><td></td><td>' + rank_list[row]["team_score"] + '</td><td></td></tr>';
                    }
                    $("#rank_list_body").html(_html);
                    $("#rank_list_foot").hide();
                    $("#rank_list_foot").html('');
                }
                else {
                    toastr.error(data.message);
                    //var html = '';
                    //$("#rank_list_body").html(html);
                }

        })
    }
}

function refresh_result_table(data) {
    var html = "";
    for(var i in data)
    {
        var item = data[i]
        // html=html+"<tr><td>""</td><td></td><td></td><td></td></tr>"
        html=html+"<tr>"+
            "<td style='display:none'>"+item['file_id']+"<\/td>"+"<td>"+item['filename']+"<\/td>" +
            "<td>"+item['filename_desc']+"<\/td>"+"<td>"+item['create_time']+"<\/td>"+
            "<td>"+item['file_size']+"<\/td>"+"<td>"+item['score']+"<\/td>"+"<td>"+item['status']+"<\/td>"+
                "<td>"+item['result_message']+"<\/td>"+
            "<td><a target='_blank' class='text-link' href='"+item['url']+"'>下载</a><\/td>"+
            "<\/tr>"
    }
    $("#result_tb_list").html(html);
}


$("#refresh_result").on("click",function () {
    var url = site_url + "refresh_result_data/"
                $.get(url, {"competition_id": competition_id},function (resp) {
                if (resp.result) {
                toastr.info(resp.message);
                    refresh_result_table(resp.data);
                } else {
                    toastr.info(resp.message);
                }
            });
});
function load_rank() {
    $('#rank_table').html();
    var language = {
        processing: "努力加载数据中...",
        search: '搜索：',
        lengthMenu: "每页显示 _MENU_ 记录",
        zeroRecords: "没找到相应的数据！",
         info: "分页 _PAGE_ / _PAGES_",
        infoEmpty: "暂无数据！",
        infoFiltered: "(从 _TOTAL_ 条数据中搜索)",
        paginate: {
            first: '<<',
            last: '>>',
            previous: '上一页',
            next: '下一页',
        }
    };
   var rank_table_data = $('#rank_table').DataTable({
        paging: true, //隐藏分页
        ordering: false, //关闭排序
       destroy:true,
        info: true, //隐藏左下角分页信息
        searching: false, //关闭搜索
        lengthChange: true, //不允许用户改变表格每页显示的记录数
        language: language, //汉化
        LengthMenu : [10, 25, 50, -1],
        autoWidth: false,
        ajax: {
            "url": site_url + "competition_list_rank/?compet_id=" + _id,
            "type": "GET",
            "dataSrc": function (json) {
                console.info(json.data)
                return json.data
            }
        },
        columns: [
            {"data": "team_rank", width:"20%","title": "队伍排名"},
            {"data": "team_name", width:"20%","title": "队伍名字"},
            {"data": "team_score", width:"20%","title": "队伍分数"}

        ]
    });

    return rank_table_data;
}

function make_rank_table(data) {
    var rank_list = data.rank_list;
    var cnt = data["count"];
    var html = "";
    for (row in rank_list) {
        html += '<tr><td>' + rank_list[row]["team_rank"] + '</td><td>' + rank_list[row]["team_name"] + '</td><td></td><td>' + rank_list[row]["team_score"] + '</td><td></td></tr>';
    }
    $("#rank_list_body").html(html);
    if (cnt <= 10 ) {$("#rank_list_foot").hide();}
    else {
        var html_foot = '<tr><td style="width:100px;" onclick="add_rest_rank_list(' + cnt + ')">11-' + cnt + '</td><td><i class="bk-icon icon-plus-square"></i><span>显示剩余' + (cnt-10) + '</td><td></td><td></td><td></td>';
        $("#rank_list_foot").html(html_foot);
        $("#rank_list_foot").show();
    }
}
