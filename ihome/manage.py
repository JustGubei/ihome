"""__author__ =侯晨皓"""

from flask import Flask, request
from flask_script import Manager

from app.models import db
from app.order_views import order
from app.house_views import house
from app.user_views import user, login_manager

from flask_migrate import Migrate,MigrateCommand


app = Flask(__name__)

app.register_blueprint(blueprint=house,url_prefix='/house')
app.register_blueprint(blueprint=order,url_prefix='/order')
app.register_blueprint(blueprint=user,url_prefix='/user')

manage = Manager(app)

app.secret_key = '12345678sdfghjkxcvbnm'
# 初始化数据库的配置
# mysql+pymysql://root:123456@127.0.0.1:3306/flask8
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456@127.0.0.1:3306/lovehouse'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# #配置数据库
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456@127.0.0.1:3306/lovehouse'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db.init_app(app)

login_manager.init_app(app)



#添加迁移脚本的命令到manager中
manage.add_command('db',MigrateCommand)

#使用migrate绑定app和db
migrate = Migrate(app,db)


if __name__ == '__main__':
    manage.run()