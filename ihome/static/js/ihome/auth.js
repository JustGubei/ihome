function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

$(document).ready(function(){
    $('#form-auth').submit(function(e){
       e.preventDefault();
       $(this).ajaxSubmit({
            url:'/user/auth/',
                type:'POST',
                dataType:'json',
                data:{
                    'id_name':$('#real-name').val(),
                    'id_card':$('#id-card').val()
                },
                success:function(data){

                    console.log(data)
                    if(data.code=='200'){
                        alert('认证成功')

                    }
                    if(data.code=='1015'){
                        alert('您的输入有误，请重新输入')
                    }

                },
                error:function(data){
                    alert('error!')
                }

       })

    })
})



$(document).ready(function(){
       $.ajax({
            url:'/user/auths/',
                type:'GET',
                dataType:'json',
                success:function(data){
                    console.log(data)
                    if(data.code=='200'){

                        $('#real-name').val(data.data.id_name)
                        $('#real-name').attr('disabled',true)
                        $('#id-card').val(data.data.id_card)
                        $('#id-card').attr('disabled',true)
                        $('#save').hide()
                    }


                },
                error:function(data){
                    alert('error!')
                }

       })

})