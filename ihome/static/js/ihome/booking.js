function hrefBack() {
    history.go(-1);
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

function showErrorMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

$(document).ready(function(){
    var url = location.search
    str = url.split('=')
    id = str[1]

    $.ajax({
        url:'/house/lbooking/'+id+'/',
        type:'GET',
        dataType:'json',
        success:function(data){


            if(data.code=='200'){
                $('.house-text').html('<h3>'+ data.house.title +'</h3><p>' + '￥<span>' + data.house.price +'</span>/晚</p>')
            }


        },
        error:function(data){
            alert('error')
        }


    })

    $(".input-daterange").datepicker({
        format: "yyyy-mm-dd",
        startDate: "today",
        language: "zh-CN",
        autoclose: true
    });
    $(".input-daterange").on("changeDate", function(){
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();

        if (startDate && endDate && startDate > endDate) {
            showErrorMsg();
        } else {
            var sd = new Date(startDate);
            var ed = new Date(endDate);
            days = (ed - sd)/(1000*3600*24);
            var price = $(".house-text>p>span").html();
            var amount = days * parseFloat(price);
            $(".order-amount>span").html(amount.toFixed(2) + "(共"+ days +"晚)");
        }
    });




    $('.submit-btn').click(function(e){
        e.preventDefault();
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();
        var sd = new Date(startDate);
        var ed = new Date(endDate);
        days = (ed - sd)/(1000*3600*24);
        var price = $(".house-text>p>span").html();
        var amount = days * parseFloat(price);

        $.ajax({
            url:'/house/booking/',
            type:'POST',
            dataType:'json',
            data:{'house_id':id,'sd':startDate,'ed':endDate,'days':days,'price':price,'amount':amount},
            success:function(data){


                if(data.code=='200'){
                    location.href = '/order/lorders/'
                }


            },
            error:function(data){
                alert('error')
            }
        })
    })
})
