import urllib2, urllib
import random
import time

i = 0
while True:
    url = 'https://nginx0.pncapix.com/security/v1.0.0/login'
    data = urllib.urlencode({'username' : 'mayduncan310',
                             'password'  : 'mayduncan310'})
    # request = urllib2.Request(url, data=data, headers={'Authorization': 'Bearer 531c2321-bfa8-3431-822e-72bb39df933b'})
    # code = urllib2.urlopen(request).getcode()
    request = urllib2.Request(url, data=data, headers={'Authorization': 'Bearer ce55b399-6880-30ec-8503-7c02f789da69'})
    code = urllib2.urlopen(request).getcode()
    # print(code)
    # time.sleep(random.randint(1, 1))
    print i
    i += 1
