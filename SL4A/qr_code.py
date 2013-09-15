"""Generate the QR code for the SL4A script using the Google Chart API.

The docs on the chart API can be found at
http://code.google.com/apis/chart/docs/gallery/qr_codes.html

The zxing project's online QR code generator is at
http://zxing.appspot.com/generator/

"""
import sys
try:
    from urllib.parse import urlencode
except ImportError:
    from urllib import urlencode
try:
    from urllib.request import urlopen
except ImportError:
    from urllib2 import urlopen


google_charts_api = 'http://chart.apis.google.com/chart'
args = {'cht': 'qr', 'chs': '350x350'}

source_path = sys.argv[1]
qr_path = sys.argv[2]

with open(source_path, 'rb') as file:
    args['chl'] = b'oplop.py\n' + file.read()
query = urlencode(args)
url = urlopen('?'.join([google_charts_api, query]))

with open(qr_path, 'wb') as file:
    file.write(url.read())
