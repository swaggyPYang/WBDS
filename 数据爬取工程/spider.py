# -*- coding: utf-8 -*-
# 爬取取某个位置(在一定经纬度范围下)周边的动态(user发布的微博详情)
from weibo import APIClient
import webbrowser
import urllib2
import urllib
import time
from china2Unix import datetime_timestamp
from distance import distance
import requests
import csv
import sys
import re
reload(sys)
sys.setdefaultencoding('utf-8')

def floatrange(start, stop, steps):
    return [round(start + float(i) * (stop - start) / (float(steps)), 6) for i in range(steps)]

APP_KEY = '2324300722'
APP_SECRET = '2155cf934da23cccc5d5af7ba158458e'
Redirect_url = 'https://api.weibo.com/oauth2/default.html'
count = 0

client = APIClient(app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=Redirect_url)
authorize_url = client.get_authorize_url()
# print(authorize_url)

headers ={
    'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36',
    'Cookie':'YF-Ugrow-G0=169004153682ef91866609488943c77f; login_sid_t=e73ee02ddf10d5aa093e7027d9fd2324; _s_tentry=-; YF-Page-G0=091b90e49b7b3ab2860004fba404a078; Apache=1405057325071.0442.1462858800756; SINAGLOBAL=1405057325071.0442.1462858800756; ULV=1462858800769:1:1:1:1405057325071.0442.1462858800756:; wvr=6; YF-V5-G0=bd9e74eeae022c6566619f45b931d426; wb_bub_hot_5599087091=1; wb_bub_hot_5927641595=1; WBtopGlobal_register_version=60539f809b40ed0d; SUS=SID-5599087091-1462873383-GZ-t9fig-2a0fa0b6685bc3e03c2a387e5356fe59; SUE=es%3Dd80b30445404883ac38113539675023a%26ev%3Dv1%26es2%3D6f11e9be1fa3dd939684a34ebd9976e4%26rs0%3DvCTpMTvDL%252FdZ2jkFVVrwB%252BaJ0%252BKGr5WygIRQz4Aq91bZO938mpJZrE1wL1xzvJaPIYQA%252FkuBkVxkeEO8Y5lkT1XCTMsCFXCu0Lgf5zeuiSBIlUytLF45oDqEBuY0YckcIHdN7FHN02EoAyHha4DCRkbb3ij3CF6Oz5%252BZMaRFDeE%253D%26rv%3D0; SUP=cv%3D1%26bt%3D1462873383%26et%3D1462959783%26d%3Dc909%26i%3Dfe59%26us%3D1%26vf%3D0%26vt%3D0%26ac%3D0%26st%3D0%26uid%3D5599087091%26name%3Dles_escargots%2540sina.com%26nick%3D%25E6%259D%258E%25E5%2586%25AC%26fmp%3D%26lcp%3D; SUB=_2A256Nd13DeTxGeNL4lsR-CnMwj2IHXVZQ0m_rDV8PUNbuNBeLVHjkW9LHesIwImElKAFRTKmkR6Lv0WXCuR0CQ..; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9WFbj-27dki.CnaRf7n4GBHx5JpX5K2hUgL.Fo-f1K.71hM71K2t; SUHB=05iqwXd7Q3aSld; ALF=1494409383; SSOLoginState=1462873383; un=les_escargots@sina.com; UOR=,,www.google.com.hk'
}
r = requests.get(authorize_url, headers=headers)
webbrowser.open_new(authorize_url)
code = raw_input('Please enter your code:').strip()
# print(r.text)
# html = r.text
# code = re.search('<input type=\"hidden\" name=\"verifyToken\" value=\"(.*?)\"', r.text, re.S).group(1)
# print code
# print r.url[-32:]
# code = r.url[-32:]

Request = client.request_access_token(code, Redirect_url)
access_token = Request.access_token
expires_in = Request.expires_in
client.set_access_token(access_token, expires_in)
#调用API
# start_time = raw_input('Please input start time:').strip()
# end_time = raw_input('Please input end time:').strip()
# start_utime = datetime_timestamp(start_time)
# end_utime = datetime_timestamp(end_time)
start_utime = datetime_timestamp('2016-06-01 00:00:00')
end_utime = datetime_timestamp('2016-06-21 20:00:00')
users_id = set([])#集合中的元素没有顺序且不会重复
#1°= 111.3195km≈111.32km≈11132m×10
#左下角：116.365175,39.906965
#右上角：116.439626,39.955267
#经度差值：798.614km
#纬度差值：413.6351km
#(35.659043, 36.659043),(36.859043, 37.859043),(38.059043, 39.059043),(39.259043, 40.259043)
#(100.372217, 101.372217),(101.572217, 102.572217),(102.772217, 103.772217),(103.972217, 104.972217),(105.172217, 106.172217),(106.372217, 107.372217)
with open('D:/userdata.csv', 'wb') as f:
    f.write('\xEF\xBB\xBF')
    writer = csv.writer(f)
    writer.writerow(['微博创建时间', '用户ID', '微博信息内容', '纬度', '经度', '地理标志类', '粉丝数', '关注数', '微博数', '用户所在地', '用户性别'])
    with open('D:/importantgeo.csv', 'ab') as g:
        g.write('\xEF\xBB\xBF')
        geo_writer = csv.writer(g)
        for x in floatrange(39.906965, 39.955267, 2):
            for y in floatrange(116.365175, 116.439626, 3):
                time.sleep(2)
                pnt = client.place.nearby_timeline.get(lat=x, long=y, range=2000, count=50, page=1, starttime=start_utime, endtime=end_utime, sort=0, offset=0)
                if hasattr(pnt, 'total_number'):
                    print pnt.total_number
                    if pnt.total_number > 50:
                        geo_writer.writerow([x, y, pnt.total_number])
                else:
                    continue
                if hasattr(pnt, 'statuses'):
                    print '坐标中心：'+'(%f, %f)' % (x, y)
                    for statuse in pnt.statuses:
                        count +=1
                        writer.writerow([statuse.created_at.decode('utf-8'), statuse.user.id.decode('utf-8'), statuse.text.decode('utf-8'), statuse.geo.coordinates[0], statuse.geo.coordinates[1], statuse.geo.type.decode('utf-8'), statuse.user.followers_count, statuse.user.friends_count, statuse.user.statuses_count, statuse.user.location.decode('utf-8'), statuse.user.gender.decode('utf-8')])
                        print statuse.created_at.decode('utf-8'), statuse.user.id, statuse.text.decode('utf-8'), statuse.geo.coordinates[0],statuse.geo.coordinates[1], statuse.geo.type, statuse.user.followers_count,statuse.user.friends_count, statuse.user.statuses_count,statuse.user.location.decode('utf-8'), statuse.user.gender.decode('utf-8')
                else:
                    continue
    g.close()
f.close()