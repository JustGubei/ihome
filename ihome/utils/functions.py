"""__author__ =侯晨皓"""
from functools import wraps

from flask import session,redirect,url_for



def login_required(func):
    @wraps(func)
    def check(*args,**kwargs):
        if 'user_id':
            # 判断session中是否存在user_id的标识
            return  func
        else:
            return redirect(url_for('user.login'))

    return check

def get_db_uri(DATABASE):

    user = DATABASE.get('USER')
    passoword = DATABASE.get('PASSWORD')
    host = DATABASE.get('HOST')
    port = DATABASE.get('PORT')
    name = DATABASE.get('NAME')
    db = DATABASE.get('DB')
    driver = DATABASE.get('DRIVER')


    return '{}+{}://{}:{}@{}:{}/{}'.format(db, driver,
                                           user, passoword,
                                           host, port, name)


if __name__ == '__main__':
    pass