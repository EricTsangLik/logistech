from shapely.geometry import MultiPoint
import numpy as np
import math
from shapely import speedups
import matplotlib.pyplot as plt
import io
import base64
    
def order_points(pts: np.ndarray):
    rect = np.zeros((4, 2), dtype = "float32")
    s = pts.sum(axis = 1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]
    diff = np.diff(pts, axis = 1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
    return rect

def distance_between_two_point(p1: list[int], p2: list[int])->float:
    distance = math.sqrt(((p1[0]-p2[0])**2)+((p1[1]-p2[1])**2))
    return distance

def rounding2Threshold(value, steps):
    return round(float(value) / steps) * steps

def multiplyResolution(pt: list[int | float], 
                       xResolution: float | int = 1,
                       yResolution: float | int = 1):
        return (pt[0] * xResolution, pt[1] * yResolution)
    
def measureHorizontal(pts: list[list[int | float]],steps: float | int = 5, 
                      xResolution: float | int = 1,
                       yResolution: float | int = 1, 
                      xOffset: float | int = 0, yOffset: float | int = 0) -> list[float, float, str]:
    # pts: array of Points coordinate (x,y)
    pts = list(map(multiplyResolution, pts, xResolution, yResolution))
    points = MultiPoint(pts)
    result = points.minimum_rotated_rectangle
    array=order_points(np.unique( np.array(list(result.exterior.coords)), axis = 0))
    x1,y1=array[0][0], array[0][1]
    x2,y2=array[1][0], array[1][1]
    x3,y3=array[2][0], array[2][1]
    x4,y4=array[3][0], array[3][1]
    distance1 = rounding2Threshold(distance_between_two_point((x1, y1), (x2, y2))+xOffset,steps)
    distance2 = rounding2Threshold(distance_between_two_point((x1, y1), (x4, y4))+yOffset,steps)
    img = gen2Dshape(result)
    return round(distance1,2), round(distance2,2), img

def measureVertical(pts: list[list[int | float]],steps: float | int = 5, zResolution: float | int = 1, zOffset: float | int = 0)->float:
    maxPts = max(pts)
    return rounding2Threshold((maxPts * zResolution)+zOffset, steps)

def gen2Dshape(pts):
    x,y = pts.exterior.xy
    plt.cla()
    plt.plot(x,y)
    temp_stringIObytes = io.BytesIO()
    plt.savefig(temp_stringIObytes, format='jpg')
    temp_stringIObytes.seek(0)
    return base64.b64encode(temp_stringIObytes.read()).decode('utf-8')
    # return temp_stringIObytes.read()