function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    $('#form-avatar').submit(function(e){
       e.preventDefault();
       $(this).ajaxSubmit({
            url:'/house/profile/',
            type:'PATCH',
            dataType:'json',
            success:function(data){
                console.log(data)
                if(data.code=='200'){
                    alert('修改成功')
                    $('#user-avatar').attr('src','/static/media/'+data.url)
                }
                if(data.code=='1010'){
                    alert('图片格式有误')
                }
                if(data.code=='1011'){
                    alert('参数有误')
                }


            },
            error:function(data){
                alert('error!')
            }

    })
});

    $('#form-name').submit(function(e){
        e.preventDefault();
        $(this).ajaxSubmit({
                url:'/house/profile/',
                type:'PATCH',
                dataType:'json',
                success:function(data){
                    console.log(data)
                    if(data.code=='200'){
                        alert('修改成功')

                    }

                    if(data.code=='1012'){
                        alert('名字已经存在')
                    }

                },
                error:function(data){
                    alert('error!')
                }




        })
   })
})