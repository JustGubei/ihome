"""__author__ =侯晨皓"""
import os
import re

from flask import Blueprint, render_template, request, jsonify, session
from flask_login import login_required
from utils.settings import MEDIA_DIR
from app.models import Area, User, House, db, Facility, HouseImage, Order

house = Blueprint('house',__name__)

#主页
@house.route('/index/',methods=['GET'])
def index():
    #主页的城区


    return render_template('index.html')

@house.route('/hindex/',methods=['GET'])
def my_index():
    #
    a = Area.query.all()
    area = []
    for i in a:
        area.append(i.to_dict())



    user_id = session.get('user_id')

    user = User.query.filter(User.id==user_id).first()

    house_list = House.query.filter(House.user_id == user_id).order_by(House.id.desc())[-3:]
    house_list2 = []
    for house in house_list:
        house_list2.append(house.to_dict())

    if user:
        return jsonify({'code':200,'msg':'登陆成功','data':user.name,'house':house_list2,'area':area})
    else:
        return jsonify({'code':1007,'msg':'未登录，请登陆','area':area})








#房屋详情
@house.route('/detail/',methods=['GET'])
def detail():
    return render_template('detail.html')

@house.route('/detail_by_id/<int:id>/',methods=['GET'])
def detail_by_id(id):
    user_id = session['user_id']
    user = User.query.filter(User.id == user_id).first()

    house = House.query.filter(House.id==id).first()

    facility_list = house.facilities
    facility_dict_list = [facility.to_dict() for facility in facility_list]
    # house_image_list = house.images
    # house_image_dict_lsit = [house_image.to_dict() for house_image in house_image_list]

    return jsonify({'code':200,'msg':'成功','house':house.to_full_dict(),'facility_list':facility_dict_list})


# /home/booking/《int:id>/
# /home/booking/id/
#预定页
@house.route('/booking/',methods=['GET'])
def booking():
    request.args.get('id')
    return render_template('booking.html')


@house.route('/lbooking/<int:id>/',methods=['GET'])
def lbooking(id):
    house = House.query.filter(House.id == id).first()
    return jsonify({'code': 200, 'house': house.to_dict()})

@house.route('/booking/',methods=['POST'])
def my_booking():
    data = request.form
    user_id = session['user_id']

    if 'house_id' in data:
        order = Order()
        order.house_id= data.get('house_id')
        order.user_id = user_id
        order.begin_date = data.get('sd')
        order.end_date = data.get('ed')
        order.days = data.get('days')
        order.house_price = data.get('price')
        order.amount = data.get('amount')
        order.add_update()



        return jsonify({'code':200,'msg':'订单信息提交成功',})

    return jsonify({'code':1000})


@house.route('/myhouse/',methods=['GET'])
@login_required
def myhouse():
    id = session['user_id']

    return render_template('myhouse.html')

@house.route('/myhouses/',methods=['GET'])
def myhouses():
    user_id = session['user_id']
    user = User.query.filter(User.id==user_id).first()

    house_list = House.query.filter(House.user_id == user_id).order_by(House.id.desc())
    house_list2 = []
    for house in house_list:
        house_list2.append(house.to_dict())
    if all([user.id_name,user.id_card]):
        return jsonify({'code':200,'msg':'用户已实名认证','hlist':house_list2})
    else:
        return jsonify({'code':1014,'msg':'用户未实名认证'})







#我的爱家
@house.route('/my/',methods=['GET'])
@login_required
def my():
    return render_template('my.html')




#发布新房源
@house.route('/newhouse/',methods=['GET'])
@login_required
def newhouse():
    return render_template('newhouse.html')

@house.route('/read_house_info/',methods=['GET'])
@login_required
def read_house_info():
    user_id = session['user_id']
    house = House.query.filter(House.user_id==user_id).first()

    if house:
        return jsonify({'code':200,'msg':'用户房源信息读取成功'})
    else:
        return jsonify({'code':1016,'msg':'用户还没有房源信息'})


@house.route('/newhouse/',methods=['POST'])
def my_newhouse():
    house = House()
    dict = request.form
    dict_house = dict.getlist('facility')

    #多对多给房间添加设施信息
    facilities = Facility.query.all()
    for i in dict_house:
        fac = Facility.query.filter(Facility.id==i).first()
        house.facilities.append(fac)

    house.user_id = session['user_id']
    house.title = dict.get('title')
    house.price = dict.get('price')
    house.area_id = dict.get('area_id')
    house.address = dict.get('address')
    house.room_count = dict.get('room_count')
    house.acreage = dict.get('acreage')
    house.unit = dict.get('unit')
    house.capacity = dict.get('capacity')
    house.beds = dict.get('beds')
    house.deposit = dict.get('deposit')
    house.min_days = dict.get('min_days')
    house.max_days = dict.get('max_days')
    house.add_update()

    return jsonify({'code':'200','msg':'添加成功','house_id':house.id})

@house.route('/newhouse_pic/',methods=['POST'])
def newhouse_pic():

    dict = request.files #.get('house_image')
    house_id = request.form.get('house_id')

    if 'house_image' in dict:
        # 获取项目根路径
        file = dict['house_image']
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        # 获取媒体文件的路径
        STATIC_DIR = os.path.join(BASE_DIR, 'static')
        STATIC_DIR1 = os.path.join(STATIC_DIR, 'media')
        MEDIA_DIR = os.path.join(STATIC_DIR1, 'house_image')

        url = os.path.join(MEDIA_DIR, file.filename)
        file.save(url)

        house = House.query.filter(House.id == house_id).first()
        url = 'house_image/'+file.filename

        houseimage = HouseImage()
        houseimage.url = url
        houseimage.house_id = house_id
        houseimage.add_update()

        if not(house.index_image_url):
            house.index_image_url = url
            house.add_update()
        return jsonify({'code': 200, 'msg': '房屋图片上传成功','image_url':url})

    else:
        return jsonify({'code': 1017, 'msg': '房屋图片上传成功'})





#修改个人信息
@house.route('/profile/',methods=['GET'])
@login_required
def profile():
    return render_template('profile.html')


@house.route('/profile/',methods=['PATCH'])
@login_required
def my_profile():

    # 获取用户
    user_id = session['user_id']
    user = User.query.filter(User.id==user_id).first()
    #获取输入的内容
    dict_file = request.files
    dict = request.form

    #存在头像则修改头像
    if 'avatar' in dict:
        return jsonify({'code': 1011, 'msg': '参数有误'})

    if 'avatar' in dict_file:

        try:
            file = dict_file['avatar']
            # mime-type:国际规范，表示文件的类型，如text/html,text/xml,image/png,image/jpeg..
            if not re.match('image/.*', file.mimetype):
                return jsonify({'code':1010,'msg':'图片格式有误'})
        except:
            return jsonify({'code':1011,'msg':'参数有误'})



        url = os.path.join(MEDIA_DIR, file.filename)
        file.save(url)
        user.avatar = file.filename
        user.add_update()
        return jsonify({'code':200,'msg':'头像修改成功','url':file.filename})

    #存在名字则修改名字
    elif 'name' in dict:


        name = dict['name']


        if User.query.filter(User.name==name).count():
            return jsonify({'code':1012,'msg':'名字已经存在'})
        else:
            user.name = name
            user.add_update()
            return jsonify({'code':200,'msg':'修改姓名成功'})









@house.route('/search/',methods=['GET'])
def search():
    return render_template('search.html')

@house.route('/my_search/',methods=['GET'])
def my_search():
    dict = request.args


    a_id = dict.get('aid') #区域id
    a_name = dict.get('aname')  # 区域
    sd = dict.get('sd')  # 入住时间
    sk = dict.get('sk')  # 排序
    ed = dict.get('ed')  # 离店时间
    print(sd, ed, sk)

    houses = House.query.filter_by(area_id=a_id)



    # 不能查询自己发布的房源，排除当前用户发布的房屋
    if session['user_id']:
        hlist = houses.filter(House.user_id != (session['user_id']))
    #只能查询订单状态为待接单的
    order_list = Order.query.filter(Order.status == 'WAIT_ACCEPT')

    # 情况一：
    order_list1 = Order.query.filter(Order.begin_date >= sd, Order.end_date <= ed).all()
    # 情况二：
    order_list2 = order_list.filter(Order.begin_date < sd, Order.end_date > ed).all()
    # 情况三：
    order_list3 = order_list.filter(Order.end_date >= sd, Order.end_date <= ed).all()
    # 情况四：
    order_list4 = order_list.filter(Order.begin_date >= sd, Order.begin_date <= ed).all()

    house_ids = [order.house_id for order in order_list2]

    for order in order_list3:
        if order.house_id not in house_ids:
            house_ids.append(order.house_id)

    for order in order_list4:
        if order.house_id not in house_ids:
            house_ids.append(order.house_id)

    print(house_ids)

    # # 查询入住时间和离店时间在预约订单内的房屋信息
    hlist = hlist.filter(House.id.notin_(house_ids))

    hh = []
    for h in hlist:
        hh.append(h.to_dict())

    print(hh)
    #
    # print(hh)



    # 排序规则,默认根据最新排列

    sort = House.id.desc()
    if sk == 'booking':
        sort = House.order_count.desc()
    elif sk == 'price-inc':
        sort = House.price.asc()
    elif sk == 'price-des':
        sort = House.price.desc()
    hlist = hlist.order_by(sort)
    hlist = [house.to_dict() for house in hlist]





    area_list = Area.query.all()
    area_dict_list = [area.to_dict() for area in area_list]


    return jsonify({'code':200,'house':hlist,'areas':area_dict_list})