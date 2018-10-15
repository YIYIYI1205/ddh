/**
 * Created by fengziboboy on 2017/11/17.
 */
$(function() {

    clickEvent();
    //获取用户id
    var userId = getSearchValue(location.search, "id");

    /*设置点击事件*/
    function clickEvent() {
        /*点击头像*/
        $(".user-info-show .user-edit-btn").off("click").on("click", function() {
            var id = 1;
            location.href = "user-edit.html?id=" + id;
        });
    }

    $.get(ServerUrl + "my/showinfo/" + userId, function(datas) {
        if (datas.status == Status.Status_OK) {
            $.toast("数据获取成功");
            // 展示个人资料界面
            showUserInfo(datas.data);
        } else {
            $.toast("数据获取错误");
        }
    });

    // 展示个人数据
    function showUserInfo(datas) {
        // 判断访问页面者的是否为本人
        $.get(ServerUrl + "my/user", function(mydatas) {
            if (mydatas.status == Status.Status_OK) {
                if (datas[0].openid == mydatas.data[0].openid) {
                    init_show_data(datas, 1);
                } else {
                    init_show_data(datas, 0);
                }
            } else {
                $.toast("数据获取错误");
            }
        });

        var uid = datas[0].uid;
        $.get(ServerUrl + "comment/getComments/" + uid, function(mydatas) {//请求接口 ，需要分数和评论内容。郭松说还要头像和昵称
            if (mydatas.status == Status.Status_OK) {
                //组装评论的数据
                var datas=mydatas.data;
                var comments=$("#comments");
                for(i=0;i<datas.length;i++){
                    buildComment(datas[i]);
                }
            } else {
                $.toast("数据获取错误");
            }

        });
    }


    function buildComment(data){
        var $html = $("#content");
        $html.find(".headimgurl").attr("src", data.headimgurl); //获取评论者头像
        $html.find(".name").text(data.nickname);//获取评论者昵称
        $html.find(".count").text(data.commentGrade);//取得分数
        $html.find(".usercomment").text(data.commentContent);//取得评论
        $html.find(".time").text(data.commentDate);//取得评论者评论的时间
    }

    /*初始化界面*/
    function init_show_data(datas, isSelf) {
        $(".headimg").attr("src", datas[0].headimgurl);
        $("#user-name").text(datas[0].nickname);
        // 性别暂时只有男女
        $("#user-gender").text(datas[0].sex);
        $("#user-address").text(datas[1].province);
        $("#user-school").text(datas[1].schoolName);
        //本人显示编辑按钮
        if (isSelf) {
            $("#user-tel").text(datas[0].phone);
            $("#user-tel").css("display", "block");
            $(".user-edit-btn").css("display", "block");
        }
        //如果用户没有上传学生证，使用默认提示图（也就是不变）
        if (datas[0].card != null) {
            var card_img = "../../../" + datas[0].card;
            $("#user-card-show img").attr("src", card_img);
        }
    }

});