import requests
import json

r = requests.get("https://route.api.here.com/routing/7.2/calculateroute.json?app_id=WN5ptdhYoHgYROta4bQZ&app_code=7XTPif-nqp4BmHlX5CJzsg&waypoint0=geo!39.28681,-76.61866&waypoint1=geo!39.43959,-76.698608&mode=balanced;car;traffic:disabled&alternatives=0&language=en&routeAttributes=summary,shape&requestId=44564506625241654")
j = r.json()
print(j)