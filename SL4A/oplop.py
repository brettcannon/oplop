"""Implementation of Oplop (http://www.oplop.mobi) on SL4A
(http://code.google.com/p/android-scripting/)."""
import base64
import hashlib as l
import re
import android as a

# Re-used string (pre|suf)fixes.
P = " password"
A = "Account" + P


def r(o):
    """Get the UTF-8 representation in bytes of a string returned from a popup
    window."""
    return o.result.encode('utf8')


# User input.
d = a.Android()
n = r(d.dialogGetInput('Nickname', 'Enter nickname'))
m = r(d.dialogGetPassword('Master'+P, 'Enter master'+P))
# Generate account password.
h = base64.urlsafe_b64encode(l.md5(m+n).digest()).decode('ascii')
f = re.search(r'\d+', h)
if not f:
    h = '1' + h
elif f.start() > 7:
    h = f.group() + h
p = h[:8]
# Copy to the clipboard and notify the user.
d.setClipboard(p)
d.dialogCreateAlert(A, A+' (copied to clipboard): '+p)
d.dialogSetPositiveButtonText('Continue')
d.dialogShow()
d.dialogGetResponse()
