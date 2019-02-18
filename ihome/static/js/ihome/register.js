function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

var imageCodeId = "";

function generateUUID() {
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}


// 获取图片
function drawCode(nums) {
    var canvas = document.getElementById("verifyCanvas"); //获取HTML端画布
    var context = canvas.getContext("2d"); //获取画布2D上下文
    context.fillStyle = "cornflowerblue"; //画布填充色
    context.fillRect(0, 0, canvas.width, canvas.height);
    // 创建渐变
    var gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    //清空画布
    context.fillStyle = gradient; //设置字体颜色
    context.font = "25px Arial"; //设置字体

    var x = new Array();
    var y = new Array();
    for (var i = 0; i < 4; i++) {
        x[i] = i * 16 + 10;
        y[i] = Math.random() * 20 + 20;
        context.fillText(nums[i], x[i], y[i]);
    }
    // console.log(rand);
    //画3条随机线
    for (var i = 0; i < 3; i++) {
        drawline(canvas, context);
    }

    // 画30个随机点
    for (var i = 0; i < 30; i++) {
        drawDot(canvas, context);
    }
    convertCanvasToImage(canvas)


    // 点击提交进行验证
    $("#submit").click((e) => {
        var newRand=rand.join('').toUpperCase();
        console.log(newRand);

        //下面就是判断是否== 的代码，无需解释
        var oValue = $('#verify').val().toUpperCase();
        console.log(oValue)
        if (oValue == 0) {
            alert('请输入验证码');
        } else if (oValue != newRand) {
            alert('验证码不正确，请重新输入');
            oValue = ' ';
        } else {
            window.open('http://www.baidu.com', '_self');
        }

    })
}

// 随机线
function drawline(canvas, context) {
    context.moveTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的起点x坐标是画布x坐标0位置，y坐标是画布高度的随机数
    context.lineTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的终点x坐标是画布宽度，y坐标是画布高度的随机数
    context.lineWidth = 0.5; //随机线宽
    context.strokeStyle = 'rgba(50,50,50,0.3)'; //随机线描边属性
    context.stroke(); //描边，即起点描到终点
}
// 随机点(所谓画点其实就是画1px像素的线，方法不再赘述)
function drawDot(canvas, context) {
    var px = Math.floor(Math.random() * canvas.width);
    var py = Math.floor(Math.random() * canvas.height);
    context.moveTo(px, py);
    context.lineTo(px + 1, py + 1);
    context.lineWidth = 0.2;
    context.stroke();
}
// 绘制图片
function convertCanvasToImage(canvas) {
    document.getElementById("verifyCanvas").style.display = "none";
    var image = document.getElementById("code_img");
    image.src = canvas.toDataURL("image/png");
    return image;
}

// 点击图片刷新
// document.getElementById('code_img').onclick = function () {
//     $('#verifyCanvas').remove();
//     $('#verify').after('<canvas width="100" height="40" id="verifyCanvas"></canvas>')
//     drawCode();
// }

function generateImageCode() {
    // 获取验证码，并渲染页面
    $.ajax({
        url: '/user/code/',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // 渲染验证码
            if(data.code == 200){
                // $('.image-code').text(data.data)
                // TODO: 将字符串生成图片
                // 前端生成验证码图片
                var nums = data.data
                var colors = []
                $('#verifyCanvas').remove();
                $('#imgcodediv').append('<canvas width="100" height="40" id="verifyCanvas"></canvas>')
                verVal = drawCode();
            }
        }
    })
}





function generateImageCode() {
    // 获取验证码，并渲染页面
    $.ajax({
        url: '/user/code/',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // 渲染验证码
            if(data.code == 200){
                // $('.image-code').text(data.data)
                // TODO: 将字符串生成图片
                // 前端生成验证码图片
                var nums = data.data
                var colors = []
                $('#verifyCanvas').remove();
                $('#imgcodediv').append('<canvas width="100" height="40" id="verifyCanvas"></canvas>')
                drawCode(nums);
            }
        }
    })
}

//    var codes= [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R', 'S','T','U','V','W','X','Y','Z'];
//    var code=''
//    for (var i=0;i<4;i++) {
//        var newCode = Math.floor(Math.random()*codes.length)
//        code=code+codes[newCode];
//    }
//    $('#codecode').text(code)



$(document).ready(function() {
    generateImageCode();
    $("#mobile").focus(function(){
        $("#mobile-err").hide();
    });
    $("#imagecode").focus(function(){
        $("#image-code-err").hide();
    });

    $("#password").focus(function(){
        $("#password-err").hide();
        $("#password2-err").hide();
    });
    $("#password2").focus(function(){
        $("#password2-err").hide();
    });
    $(".form-register").submit(function(e){
        e.preventDefault();
        mobile = $("#mobile").val();
        imagecode = $("#imagecode").val();
        passwd = $("#password").val();
        passwd2 = $("#password2").val();
        strCode = $("#codecode").text()
        if (!mobile) {
            $("#mobile-err span").html("请填写正确的手机号！");
            $("#mobile-err").show();
            return;
        }
        if (!passwd) {
            $("#password-err span").html("请填写密码!");
            $("#password-err").show();
            return;
        }
        if (passwd != passwd2) {
            $("#password2-err span").html("两次密码不一致!");
            $("#password2-err").show();
            return;
        }
//        异步提交注册请求, ajax
        $.ajax({
            url:'/user/register/',
            type: 'POST',
            dataType: 'json',
            data:{'mobile':mobile, 'imagecode':imagecode,
            'passwd':passwd, 'passwd2':passwd2},
            success:function(data){
                console.log(data)
                if(data.code == '1001'){
                    $('#mobile-err span').html(data.msg)
                    $('#mobile-err').show()
                }
                if(data.code == '1002'){
                    $('#image-code-err span').html(data.msg)
                    $('#image-code-err').show()
                }
                if(data.code == '1003'){
                    $('#password-err span').html(data.msg)
                    $('#password-err').show()
                }
                if(data.code == '1004'){
                    $('#password2-err span').html(data.msg)
                    $('#password2-err').show()
                }
                if(data.code == '200'){
                    location.href='/user/login/'
                }



            },
            error:function(data){
                alert('error!')
            }
        })
    });
})