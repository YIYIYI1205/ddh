/**
 * Created by WY on 2018/10/8.
 */
$(function() {

    /* 获取任务ID */
    var taskId = getSearchValue(location.search, "tid");
    console.log(taskId);
    var task_params = {
        /*任务名称的最大长度*/
        task_name_length: 10,
        /*任务描述的最大长度*/
        task_describe_length: 200,
        /*私密信息的最大长度*/
        // task_secret_length: 200,
        /*图片的最大数量*/
        task_image_max_length: 3,

        /*设置时间*/
        task_time_min_time: "2017-01-01",
        task_time_max_time: "2020-12-31",

        /*用户金币数量*/
        task_money_number: 0,

        /*联系方式预选*/
        task_link_id: 3,
        task_link_max_length: 11,

        /*用户所在学校*/
        school: ""
    };
    var link_params = [
        { link_id: 1, link_text: "微信号", link_input_type: "text" },
        { link_id: 2, link_text: "QQ号", link_input_type: "number" },
        { link_id: 3, link_text: "手机号", link_input_type: "number" }
    ];
    $("#task-name").attr("placeholder", "不超过" + task_params.task_name_length + "个字");
    /*设置任务描述的限制*/
    $("#task-describe").attr("placeholder", "请简单的描述一下任务，不超过" + task_params.task_describe_length + "个字");
    $("#task-describe-length").text("0");
    $("#task-describe-max-length").text(task_params.task_describe_length);
    getData(taskId);
    function getData(callback_deal_data) {
        $.get(ServerUrl + "task/task/" + taskId, function(data) {
            console.log(data);
            var task=data.data.task;
            console.log(task);
            $("#task-money").attr("placeholder", "总金币数量为: " + task.pub.goldCoins);
            $("#task-name").val(task.title);
            $("#task-type").val(task.category.category);
            /*设置时间，时间就重新改变了*/
            $("#task-time-begin").datetimePicker({
                rotateEffect: true,
                min: task_params.task_time_min_time,
                max: task_params.task_time_max_time,
                value: getTimeAddHour(),
                onClose: function() {
                    var time = $("#task-time-begin").val();
                    var now_time = getTimeAddHour();
                    if (now_time > time) {
                        $.alert("开始时间大于当前时间，如果存在错误请修改");
                    }
                }
            });
            $("#task-time-end").datetimePicker({
                rotateEffect: true,
                min: task_params.task_time_min_time,
                max: task_params.task_time_max_time,
                value: getTimeAddHour(2),
                onClose: function() {
                    var time = $("#task-time-end").val();
                    var now_time = getTimeAddHour();
                    if (now_time > time) {
                        $("#task-time-end").val(getTimeAddHour(2));
                        $.alert("结束时间小于当前时间，存在错误请修改");
                    }
                }
            });
            $("#task-place").val(task.place);
            $("#task-money").val(task.coins);
            $("#task-other-money").val(task.rewards);
            // 联系方式
            if(task.weixin!=""){
                $("#task-link-select").val("微信号");
                $("#task-link-method").text("微信号");
                $("#task-link-input").val(task.weixi);
            }
            if(task.qq!=""){
                $("#task-link-select").val("QQ号");
                $("#task-link-method").text("QQ号");
                $("#task-link-input").val(task.qq);
            }
            if(task.telephone!=""){
                $("#task-link-select").val("手机号");
                $("#task-link-method").text("手机号");
                $("#task-link-input").val(task.telephone);
            }
            // 任务描述
            $("#task-describe").val(task.content);
            if(task.images!=""&&task.images!=null){
                task.images=task.images.slice(1).split(";");
                // 用一个新的变量来存之前的图片
                var newImage=task.images;
                var count=task.images.length;
                var num=task.images.length;
                var images=newImage.join(";")+";";
                //展示已有图片
                showExistImage();
                //展示新的图片
                showImage();
                function showExistImage(){
                    if(task.images.length==3){
                        // 隐藏
                        $("#weui-uploader__input-box").css('display','none');
                    }
                    var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>', 
                    // var url='http://timeseller.fantasy512.cn/ddh/image/upload/302_2.jpeg'; 
                    // var url2='http://timeseller.fantasy512.cn/ddh/image/upload/302_1.jpeg'; 
                    // var tmpl2 = '<li class="weui-uploader__file" style="background-image:url('+url2+')"></li>';
                    // var tmpl = '<li class="weui-uploader__file" style="background-image:url('+url+')"></li>',  
                        $gallery = $("#gallery"),  
                        $galleryImg = $("#galleryImg"),  
                        $uploaderInput = $("#uploaderInput"),  
                        $uploaderFiles = $("#uploaderFiles");  
                        // $uploaderFiles.append($(tmpl));
                        // $uploaderFiles.append($(tmpl2));
                    for(var i = 0;i<task.images.length;i++) {
                        $uploaderFiles.append($(tmpl.replace('#url#', task.images[i])));       
                    }  
                    var index; //第几张图片  
                    $uploaderFiles.on("click", "li", function() {  
                        index = $(this).index();  
                        $galleryImg.attr("style", this.getAttribute("style"));  
                        $gallery.fadeIn(100);  
                    });  
                    //点击span隐藏，不要直接点gallery就隐藏，删不掉图片
                    $("#galleryImg").click(function() { 
                        $gallery.fadeOut(100);  
                    });  
                    //删除图片  
                    $(".weui-gallery__del").click(function() { 
                        count--;
                        num--;
                        $("#weui-uploader__input-box").css('display','block');
                        $gallery.fadeOut(100);  
                        $uploaderFiles.find("li").eq(index).remove();  
                        // 删掉一个图片，就从newImage中删除一个图片
                        newImage.splice(index,1);
                        images=newImage.join(";")+";";
                    });   
                }
                function showImage(){
                    var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>',  
                        $gallery = $("#gallery"),  
                        $galleryImg = $("#galleryImg"),  
                        $uploaderInput = $("#uploaderInput"),  
                        $uploaderFiles = $("#uploaderFiles");  
                    $uploaderInput.on("change", function(e) {  
                        var src, url = window.URL || window.webkitURL || window.mozURL,  
                        files = e.target.files;
                        for(var i = 0, len = files.length; i < len; ++i) {
                            count++;
                            if(count>2){
                                $("#weui-uploader__input-box").css('display','none');
                            }
                            if(count>3){
                                alert("只能上传3张图片");
                                count--;
                                return;
                            }  
                            var file = files[i];  
                            var size=file.size;
                            if(size>1024*1024*5){
                                alert("图片不能超过5M");
                                return;
                            }
                            if(url) {  
                                src = url.createObjectURL(file);
                            } else {  
                                src = e.target.result;  
                            }  
                            $uploaderFiles.append($(tmpl.replace('#url#', src)));       
                        }   
                    });  
                }
                //获取现在展示出来的图片,上传图片
                submitImage();
                function submitImage(){
                    $('.zjxfjs_file').on('change', function (event) {
                        var files = event.target.files;

                        for (var i = 0;i < files.length; i++) {
                            var file = files[i];
                            var size=file.size;
                            if(size>1024*1024*5){
                                return;
                            }
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var img = new Image();
                                img.src = e.target.result;         
                                img.onload = function () {  
                                    // 不要超出最大宽度  
                                    var w = Math.min(10000, img.width);  
                                    // 高度按比例计算  
                                    var h = img.height * (w / img.width);  
                                    var canvas = document.createElement('canvas');  
                                    var ctx = canvas.getContext('2d');  
                                    // 设置 canvas 的宽度和高度  
                                    canvas.width = w;  
                                    canvas.height = h;  
                                    ctx.drawImage(img, 0, 0, w, h); 
                                    var base64 = canvas.toDataURL('image/jpeg',0.6);  
                                    console.log(base64);
                                    console.log(images);
                                    images=images+base64; 
                                    console.log(images);
                                }
                            };
                            reader.readAsDataURL(file);
                        }
                    }); 
                }
            }else{
                //没有图片直接上传，和publish是一样的
                showImage();
                submitImage();
                function showImage(){
                    var count=0; 
                    var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>',  
                        $gallery = $("#gallery"),  
                        $galleryImg = $("#galleryImg"),  
                        $uploaderInput = $("#uploaderInput"),  
                        $uploaderFiles = $("#uploaderFiles");  
                        $uploaderInput.on("change", function(e) {  
                    var src, url = window.URL || window.webkitURL || window.mozURL,  
                        files = e.target.files;
                    for(var i = 0, len = files.length; i < len; ++i) {
                                    
                                    count++;
                                    if(count>2){
                                        $("#weui-uploader__input-box").css('display','none');
                                    }
                                    if(count>3){
                                        alert("只能上传3张图片");
                                        count--;
                                        return;
                                    }  
                                    var file = files[i];  
                                    var size=file.size;
                                    if(size>1024*1024*5){
                                        alert("图片不能超过5M");
                                        return;
                                    }
                                    if(url) {  
                                        src = url.createObjectURL(file);
                                    } else {  
                                        src = e.target.result;  
                                    }  
                                    $uploaderFiles.append($(tmpl.replace('#url#', src)));       
                                }   
                            });  
                        var index; //第几张图片  
                        $uploaderFiles.on("click", "li", function() {  
                            index = $(this).index();  
                            $galleryImg.attr("style", this.getAttribute("style"));  
                            $gallery.fadeIn(100);  
                        });  
                        //点击span隐藏，不要直接点gallery就隐藏，删不掉图片
                        $("#galleryImg").click(function() { 
                            $gallery.fadeOut(100);  
                        });  
                        //删除图片  
                        $(".weui-gallery__del").click(function() { 
                            count=$uploaderFiles[0].children.length-1;
                            console.log(count);
                            $("#weui-uploader__input-box").css('display','block');
                            $gallery.fadeOut(100);  
                            $uploaderFiles.find("li").eq(index).remove();  
                        });  
                }
                var images="";
                function submitImage(){
                     var count=0;
                    $('.zjxfjs_file').on('change', function (event) {
                            var files = event.target.files;
                            for (var i = 0, len = files.length; i < len; i++) {
                                count++;
                                if(count>3){
                                    return;
                                }
                                var file = files[i];
                                var size=file.size;
                                // console.log(size);
                                if(size>1024*1024*5){
                                    return;
                                }
                                var reader = new FileReader();
                                reader.onload = function (e) {
                                    // var imgName=$("#uploaderInput").val(); 
                                    // console.log(imgName); 
                                    var img = new Image();
                                    img.src = e.target.result;         
                                    img.onload = function () {  
                                        // console.log("123");
                                        // 不要超出最大宽度  
                                        var w = Math.min(10000, img.width);  
                                        // 高度按比例计算  
                                        var h = img.height * (w / img.width);  
                                        var canvas = document.createElement('canvas');  
                                        var ctx = canvas.getContext('2d');  
                                        // 设置 canvas 的宽度和高度  
                                        canvas.width = w;  
                                        canvas.height = h;  
                                        ctx.drawImage(img, 0, 0, w, h); 
                    　　　　　　　　　　　　
                                        var base64 = canvas.toDataURL('image/jpeg',0.6);  
                                        // console.log(base64);
                                       //console.log(base64);
                                        // 插入到预览区  
                                        // var image_key="image"+count;
                                        // console.log(image_key);
                                        console.log(base64);

                                        images=images+base64;
                                        console.log(images);  
                                        // if(i==0){
                                        //     images.image1=base64;
                                        // }
                                        // if(i==1){
                                        //     images.image2=base64;
                                        // }
                                        // if(i==2){
                                        //     images.image3=base64;
                                        // }
                                    }
                                };
                                reader.readAsDataURL(file);
                            }
                            console.log(images);
                            
                            // images=JSON.stringify(images); 

                        }); 
                }
            }
            // 点击提交之后再获取一遍输入框所有数据
            submit_form();
            /*提交表单*/
            function submit_form() {
                $("#submit").click(function() {
                    /*如果没有足够的金币，不能发布任务*/
                    if (task.pub.goldCoins < 10) {
                        $.alert("金币小于10，不能发布任务！", function() {});
                    }
                    console.log(images);
                    if($("#task-type").val()=='跑腿'){
                        var catId='1';
                    }else if(("#task-type").val()=='爱问'){
                        var catId='2';
                    }else if(("#task-type").val()=='约玩'){
                        var catId='3';
                    }else if(("#task-type").val()=='组队'){
                        var catId='4';
                    }else{
                        var catId='5';
                    }
                    if($("#task-link-select").val()=="微信号"){
                        var weixin=$("#task-link-input").val();
                        var telephone="";
                        var qq="";
                    }else if($("#task-link-select").val()=="QQ号"){
                        var qq=$("#task-link-input").val();
                        var telephone="";
                        var weixin="";
                    }else{
                        var telephone=$("#task-link-input").val();
                        var qq="";
                        var weixin="";
                    }
                    /*获取并组装表单项*/
                    var datas = {
                        title: $("#task-name").val(),
                        content: $("#task-describe").val(),
                        startTime: $("#task-time-begin").val(),
                        endTime: $("#task-time-end").val(),
                        catId: catId,
                        place: $("#task-place").val(),
                        coins: $("#task-money").val(),
                        rewards: $("#task-other-money").val(),
                        school: '',
                        images: images,
                        weixin: weixin,
                        qq: qq,
                        telephone: telephone
                    };
                    /*检查表单项*/
                    if (datas.title.length == 0) {
                        $.alert("任务名称不能为空");
                        $("#task-name").focus();
                        return;
                    }
                    if (datas.title.length > task_params.task_name_length) {
                        $.alert("任务名称的长度不能超过" + task_params.task_name_length + "个字");
                        $("#task-name").focus();
                        return;
                    }
                    if (datas.content.length == 0) {
                        $.alert("任务描述不能为空");
                        $("#task-describe").focus();
                        return;
                    }
                    if (datas.content.length > task_params.task_describe_length) {
                        $.alert("任务描述的长度不能超过" + task_params.task_describe_length + "个字");
                        $("#task-describe").focus();
                        return;
                    }
                    if ($("#task-time-begin").val() > $("#task-time-end").val()) {
                        $.alert("结束时间早于开始时间，存在错误请修改");
                        $("#task-time-end").focus();
                        return;
                    }
                    // if (datas.coins > task_params.task_money_number) {
                    //     $.alert("总金币只有" + task_params.task_money_number + ",请重新输入");
                    //     $("#task-describe").focus();
                    //     return;
                    // }

                    /*检查是否有金币或酬劳，没问题（有金币或酬劳/用户确认没有金币或酬劳）后上传数据到服务器*/
                    var is_money_ok = true;
                    if ((datas.coins.length == 0 || datas.coins <= 0) && datas.reward.length == 0) {
                        is_money_ok = false;
                        $.confirm("确定发布任务不给金币或酬劳吗？", function() {
                            is_money_ok = true;
                        }, function() {
                            if (datas.coins.length == 0 || datas.coins == 0) {
                                $("#task-money").focus();
                            }
                        });
                    }
                    if (is_money_ok) {
                        /*上传服务器*/
                        $.confirm("确定发布任务吗？", function() {
                            console.log(datas);
                            uploadData(datas);
                        });
                    }
                    function uploadData(datas) {
                        $.showLoading("任务上传中");
                        uploadOtherData(datas);
                    }
                    /*上传其他数据的回调函数*/
                    function uploadOtherData(datas) {
                        console.log(datas);
                        $.post(ServerUrl + "task/publish" ,datas, function(data) {
                            $.hideLoading();
                            if (data.status == Status.Status_OK) {
                                $.alert("任务上传成功", function() {
                                    location.href = ServerUrl + "web/wechat/view/task.html?id=" + data.data;
                                });
                            } else {
                                $.alert("任务上传失败", function() {

                                });
                            }
                        });
                    }
                });
            }
        });
    }
})