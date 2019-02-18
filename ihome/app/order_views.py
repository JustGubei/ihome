"""__author__ =侯晨皓"""
from flask import Blueprint, render_template, session, request, jsonify

from app.models import Order, House

order = Blueprint('order',__name__)

@order.route('/orders/',methods=['GET'])
def orders():
    return render_template('orders.html')

@order.route('/my_orders/',methods=['GET'])
def my_orders():
    data = []
    orders = Order.query.filter(Order.user_id == session['user_id']).all()
    for order in orders:
        data.append(order.to_dict())
    return jsonify({'code': 200, 'msg': '获取页面成功', 'orders': data})






#客户订单页
@order.route('/lorders/',methods=['GET'])
def lorders():

    return render_template('lorders.html')

@order.route('/lorder/',methods=['GET'])
def lorder():
    hlist = House.query.filter(House.user_id == session['user_id'])
    hid_list = [house.id for house in hlist]
    # 根据房屋编号查找订单
    order_list = Order.query.filter(Order.house_id.in_(hid_list)).order_by(Order.id.desc())
    # 构造结果
    olist = [order.to_dict() for order in order_list]
    return jsonify({'code': 200, 'msg': '获取页面成功', 'orders': olist})

@order.route('/lorders/',methods=['PUT'])
def my_lorders():
    status = request.form.get('status')

    order_id = request.form.get('order_id')
    order = Order.query.filter(Order.id==order_id).first()
    order.status = status
    order.add_update()

    return jsonify({'code':200,'msg':'修改接单状态成功'})