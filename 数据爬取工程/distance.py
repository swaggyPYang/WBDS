# -*- coding: utf-8 -*-
#根据地球上任意两点的经纬度计算两点的距离
import math
def rad(d):
    return d * math.pi / 180.0
def distance(lat1,lng1,lat2,lng2):
    radlat1=rad(lat1)
    radlat2=rad(lat2)
    a=radlat1-radlat2
    b=rad(lng1)-rad(lng2)
    s=2*math.asin(math.sqrt(math.pow(math.sin(a/2),2)+math.cos(radlat1)*math.cos(radlat2)*math.pow(math.sin(b/2),2)))
    earth_radius=6378.137
    s=s*earth_radius
    if s<0:
        return -s
    else:
        return s
# print distance(32.102926, 118.602319, 32.102926, 118.685106)
