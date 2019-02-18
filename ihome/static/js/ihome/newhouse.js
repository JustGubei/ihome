function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){

    $('#form-house-info').submit(function(e){
       e.preventDefault();
       $(this).ajaxSubmit({
            url:'/house/newhouse/',
            type:'POST',
            dataType:'json',
            success:function(data){
                $('#form-house-info').hide()
                $('#form-house-image').show()
                $('#house-id').val(data.house_id)
                console.log(data)

            },
            error:function(data){
                alert('error!')
            }

       })

    })

    $('#form-house-image').submit(function(e){
        e.preventDefault();
        $(this).ajaxSubmit({
            url:'/house/newhouse_pic/',
            type:'POST',
            dataType:'json',
            success:function(data){
                console.log(data)
                $('#form-house-info').hide()
                $('#form-house-image').show()
                if(data.code=='200'){
                    $('.house-image-cons').append(' <img src="/static/media/'+ data.image_url+'"> ')
                    alert('图片上传成功')
                }

            },
            error:function(data){
                console.log('error')
            }

        })
    })

})