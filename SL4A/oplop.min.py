import base64,hashlib as l,re,android as a
P=' password'
A='Account'+P
r=lambda o:o.result.encode('utf8')
d=a.Android()
n=r(d.dialogGetInput('Nickname','Enter nickname'))
m=r(d.dialogGetPassword('Master'+P,'Enter master'+P))
h=base64.urlsafe_b64encode(l.md5(m+n).digest()).decode('ascii')
f=re.search('\\d+',h)
if not f:h='1'+h
elif f.start()>7:h=f.group()+h
p=h[:8]
d.setClipboard(p)
d.dialogCreateAlert(A,A+' (copied to clipboard): '+p)
d.dialogSetPositiveButtonText('Continue')
d.dialogShow()
d.dialogGetResponse()
