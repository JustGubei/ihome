$(document).ready(function(){
    $.ajax({
        url:'/house/myhouses/',
        dataType:'json',
        type:'GET',
        success:function(data){
            console.log(data)
            if(data.code=='200'){
                $(".auth-warn").hide();
                $('.new-house').show();
                $('#houses-list').show();
                for(var i=0; i<data.hlist.length; i++){
                    var h_li = ''
                    h_li += '<li><a href="/house/detail/?house_id=' + data.hlist[i].id + '"><div class="house-title">'
                    h_li += '<h3>房屋ID:'+ data.hlist[i].id +' —— ' + data.hlist[i].title + '</h3></div>'
                    h_li += '<div class="house-content">'
                    h_li += '<img src="/static/media/' + data.hlist[i].image +  '" >'
                    h_li += '<div class="house-text"><ul>'
                    h_li += '<li>位于：' + data.hlist[i].area + '</li>'
                    h_li += '<li>价格：￥' + data.hlist[i].price + '/晚</li>'
                    h_li += '<li>发布时间：' + data.hlist[i].create_time + '</li>'
                    h_li += '</ul></div></div></a></li>'
                    $('#houses-list').append(h_li)
                }

            }



            if(data.code=='1014'){
                $(".auth-warn").show();
                $('.new-house').hide();
                $('#houses-list').hide();
            }
        },
        error:function(data){
            alert('error')
        }





    })

})