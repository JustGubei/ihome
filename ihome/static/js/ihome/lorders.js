//模态框居中的控制
function centerModals(){
    $('.modal').each(function(i){   //遍历每一个模态框
        var $clone = $(this).clone().css('display', 'block').appendTo('body');    
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top-30);  //修正原先已经有的30个像素
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);

    $.ajax({
        url:'/order/lorder/',
        type:'GET',
        dataType:'json',
        success:function(data){
            console.log(data)



//                $('.orders-list li .order-title').append('<h3>订单编号：' + i.order_id    + '</h3>')
//                $('.orders-list li .order-content ul').append('<h3>'+ i.house_title + '</h3>')
//                $('.orders-list li .order-content ul').append('<li>创建时间：' + i.create_date + '</li>')
//                $('.orders-list li .order-content ul').append('<li>入住日期：' + i.begin_date + '</li>')
//                $('.orders-list li .order-content ul').append('<li>离开日期：' + i.end_date + '</li>')
////              $('.orders-list li .order-content ul'.append('<li>合计金额：￥' + i.amount + '(共'+ i.days +'晚)</li>')
////              $('.orders-list li .order-content ul').append('<li>订单状态：<span>' + {% if i.status == "WAIT_ACCEPT" % } + '未接单' + {% else %} + '已接单' + {% endif %} + '</span></li>')
////              $('.orders-list li .order-content ul').append('<li>客户评价：' + {% if not i.comment %} + '客户未作出评价' + {% else %}+ {{ i.comment }} + {% endif %} + '</li>')
                orders = data.orders

                all_order = ''
                for(i in orders){
                    all_order += '<ul class="orders-list"><li order-id="' + orders[i].order_id + '"><div class="order-title">'
                    all_order += '<h3>订单编号：' + orders[i].order_id + '</h3>'
                    // all_order += '<div class="fr order-operate">'
                    if (orders[i].status == '待接单'){
                        all_order += '<div class="fr order-operate" id="button_' + orders[i].order_id + '"><button type="button" class="btn btn-success order-accept" data-toggle="modal" data-target="#accept-modal" order-id="\' + orders[i].order_id + \'">接单</button><button type="button" class="btn btn-danger order-reject" data-toggle="modal" data-target="#reject-modal">拒单</button></div>'
                    }
                    all_order += '</div><div class="order-content">'
                    all_order += '<img src="/static/media/' + orders[i].image + '">'
                    all_order += '<div class="order-text"><h3>订单</h3>'
                    all_order += '<ul><li>创建时间：' + orders[i].create_date + '</li>'
                    all_order += '<li>入住日期：' + orders[i].begin_date + '</li>'
                    all_order += '<li>离开日期：' + orders[i].end_date + '</li>'
                    all_order += '<li>合计金额：' + orders[i].amount + '元(共' + orders[i].days + '晚)</li>'
                    all_order += '<li>订单状态：<span id="status_' + orders[i].order_id + '">' + orders[i].status + '</span></li>'
                    all_order += '<li>客户评价：' + orders[i].comment + '</li></ul></ul>'
                }
                $('.orders-con').append(all_order)
                $(".order-accept").on("click", function(){
                    var orderId = $(this).parents("li").attr("order-id");
                    $(".modal-accept").attr("order-id", orderId);
                });
            //    拒单
                $(".order-reject").on("click", function(){
                    var orderId = $(this).parents("li").attr("order-id");
                    $(".modal-reject").attr("order-id", orderId);
                });



        },
        error:function(data){
            alert('error')
        }


    })

//    接单




//  接单
    $('.modal-accept').click(function(e){
        var order_id = $('.modal-accept').attr('order-id');
        console.log(order_id)
         $.ajax({
            url:'/order/lorders/',
            type:'PUT',
            dataType:'json',
            data:{'status': 'WAIT_PAYMENT','order_id':order_id},
            success:function(data){
                if(data.code=='200'){
                    $('#accept-modal').hide()
                    $('.modal-backdrop').css({'display': 'None'})
                    $('.order-operate').hide();
                    $('#' + order_id).text('待支付');
                }


            },
            error:function(data){
                alert('error')
            }
        })

    })
//  拒单
    $('.modal-reject').click(function(e){
        var order_id = $('.order-accept').attr('order-id');
        var comment=$('#reject-reason').val();
         $.ajax({
            url:'/order/lorders/' + order_id + '/',
            type:'PUT',
            dataType:'json',
            data: {'status': 'REJECTED','comment':comment,'order_id':order_id},
            success:function(data){
                if(data.code=='200'){
                    $('.order-operate').hide();
                    $('.modal-backdrop').css({'display': 'None'})
                    $('#' + order_id).text('已拒单');
                }


            },
            error:function(data){
                alert('error')
            }
        })
    })
});
