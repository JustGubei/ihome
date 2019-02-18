"""__author__ =侯晨皓"""
import re
import random

from flask import Blueprint, render_template, request, make_response, session, url_for, redirect, jsonify,sessions
from flask_login import login_user,logout_user, login_required, LoginManager
from werkzeug.security import generate_password_hash, check_password_hash

from app.models import User, db
from utils.auth import checkIdcard
#配置蓝图
user = Blueprint('user',__name__)

#配置flask_login
login_manager = LoginManager()

#设置登陆视图，用于未授权操作的跳转
login_manager.login_view = 'user.login'

#注册
@user.route('/register/',methods=['GET'])
def register():
    if request.method == 'GET':
        return render_template('register.html')

@user.route('/register/',methods=['POST'])
def my_register():
    if request.method == 'POST':
        # 获取参数

        mobile = request.form.get('mobile')
        imagecode = request.form.get('imagecode')
        print(session['img_code'])
        passwd = request.form.get('passwd')
        passwd2 = request.form.get('passwd2')

        # 1.验证参数是否必填
        if not all([mobile,imagecode,passwd,passwd2]):
            return jsonify({'code':200,'msg':'请填写完整参数'})

        # 2.验证手机号是否正确
        if not re.match(r'^1[345789]\d{9}$', mobile):
            return jsonify({'code': 1001, 'msg': '手机号不正确'})

        # 3.验证图片验证码
        if session['img_code'] != imagecode:
            return jsonify({'code': 1002, 'msg': '验证码不正确'})

        # 4.密码和确认密码是否一致
        if passwd != passwd2:
            return jsonify({'code': 1003, 'msg': '验证码不正确'})

        # 验证手机号是否被注册
        user = User.query.filter_by(phone=mobile).first()
        if user:
            return jsonify({'code': 1004, 'msg': '手机号已被注册，请重新注册'})

        # 创建注册信息
        user = User()
        user.phone = mobile
        user.password = passwd
        user.name = mobile
        user.add_update()


        return jsonify({'code':200,'msg':'请求成功'})


#登陆
@user.route('/login/',methods=['GET'])
def login():
    if request.method == 'GET':
        return render_template('login.html')

@user.route('/login/', methods=['POST'])
def my_login():
    if request.method == 'POST':
        phone = request.form.get('mobile')
        password = request.form.get('password')
        #获取登陆的用户对象
        user = User.query.filter(User.phone==phone).first()


        if user:
            if user.check_pwd(password):
                login_user(user)
                return jsonify({'code':200,'msg':'登陆成功'})
            else:
                return jsonify({'code':1005,'msg':'密码错误'})
        else:
            return jsonify({'code':1006,'msg':'该用户不存在，请注册'})





@user.route('/code/',methods=['GET'])
def get_code():
    #获取验证码
    #方式1,后端生成图片，并返回验证码图片的地址，不推荐
    #方式2，后端只生成随机参数，返回给页面，在页面中再生成图片（前端做）
    s='1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    code = ''
    for i in range(4):
        code += random.choice(s)

    session['img_code'] = code


    return jsonify({'code':200,'msg':'验证码生成成功','data':code})


@login_manager.user_loader
def load_user(user_id):

    return User.query.filter(User.id == user_id).first()


@user.route("/logout/")
@login_required
def logout():
    logout_user()

    return render_template('login.html')


#实名认证
@user.route('/auth/',methods=['GET'])
@login_required
def auth():
    return render_template('auth.html')

@user.route('/auths/',methods=['GET'])
def auths():
    user_id = session.get('user_id')
    user = User.query.filter(User.id == user_id).first()
    if user.id_name:
        return jsonify({'code': 200, 'msg': '数据请求成功', 'data': user.to_auth_dict()})
    else:
        return jsonify({'code':1013})



@user.route('/auth/',methods=['POST'])
@login_required
def my_auth():
    real_name = request.form.get('real_name')
    id_card = request.form.get('id_card')
    # (r'^1[345789]\d{9}$', mobile)
    # 131 182 19961229 2616
    # if re.match(r'^[1-9]\d{16}[1-9,X]$',id_card):
    msg = ['验证通过!']

    if checkIdcard(id_card) == msg[0]:
        print('=====')
        user_id = session.get('user_id')
        user = User.query.filter(User.id == user_id).first()
        user.id_name=real_name
        user.id_card=id_card
        user.add_update()
        return jsonify({'code': 200, 'msg': '认证成功'})
    else:
        return jsonify({'code':1015, 'msg':'您的输入有误，请重新输入'})

    return jsonify({'code': 1013, 'msg': '未认证'})