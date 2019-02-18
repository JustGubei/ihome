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
      $.ajax({
        url:'/order/my_orders/',
        type:'GET',
        dataType:'json',

        success:function(data){
            orders = data.orders
            console.log('ajax成功')
            console.log(data)
            msg = ''
            for(i in orders){
            msg += '<li order-id=""><div class="order-title">'
            msg += '<h3>订单编号'+orders[i].order_id+'</h3><div class="fr order-operate"><button type="button" class="btn btn-success order-comment" data-toggle="modal" data-target="#comment-modal">发表评价</button></div></div>'
            msg += '<div class="order-content"><img src="/static/media/'+ orders[i].image + '">' +
                        '<div class="order-text">'+
                        '<h3>订单</h3>'+
                        '    <ul>'+
                        '        <li>创建时间：' + orders[i].create_date + '</li>'+
                        '        <li>入住日期：' + orders[i].begin_date + '</li>'+
                        '        <li>离开日期：' + orders[i].end_date + '</li>'+
                        '        <li>合计金额：' + orders[i].amount + '元(共' + orders[i].days + '晚)</li>'+
                        '        <li>订单状态：'+
                        '            <span>' + orders[i].status + '</span>'+
                        '        </li>'+
                        '        <li>我的评价：' + orders[i].comment + '</li>'+
//                        '        <li>拒单原因：</li>'+
                        '    </ul>'+
                        '</div>'+
                        '</div></li>'

            }
            $('.orders-list').append(msg)
//
        },
        error:function(data){
            alert('error')
        }
    })


    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);
    $(".order-comment").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-comment").attr("order-id", orderId);
    });











});