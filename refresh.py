import urllib2, urllib
import random
import time

i = 0
while True:
    url = 'https://nginx0.pncapix.com/security/v1.0.0/login'
    data = urllib.urlencode({'username' : 'mayduncan310',
                             'password'  : 'mayduncan310'})
    request = urllib2.Request(url, data=data, headers={'Authorization': 'Bearer 531c2321-bfa8-3431-822e-72bb39df933b'})
    code = urllib2.urlopen(request).getcode()
    # request = urllib2.Request(url, data=data, headers={'Authorization': 'Bearer c7d8d430-b950-38ce-b66b-012a0bc5b2c8'})
    # code = urllib2.urlopen(request).getcode()
    # print(code)
    # time.sleep(random.randint(1, 1))
    print i
    i += 1
