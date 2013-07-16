"Generate account passwords based on an account name and a master password."
from __future__ import print_function

try:
    import argparse
except ImportError:
    from . import argparse
try:
    import win32clipboard
except ImportError:
    win32clipboard = None

from . import create
from getpass import getpass
import subprocess
import sys


# Python 2.6 compat along with ease of mocking.
try:
    from builtins import input
except ImportError:
    input = raw_input


def get_account_name():
    print("Nickname = ", end="", file=sys.stderr)
    return input()


def get_master_password(verifying=False):
    return getpass('Master password {}(not echoed) ... '.format(
                                                    ['', 'again '][verifying]))


def print_account_password(account_password):
    """Print the account password to stdout."""
    print('', file=sys.stderr)
    sys.stderr.flush()
    print(account_password, end="", file=sys.stdout)
    sys.stdout.flush()
    print('', file=sys.stderr)
    sys.stderr.flush()
    return True


def clipboard(command, account_password):
    try:
        clipboard = subprocess.Popen(command, stdin=subprocess.PIPE)
    except OSError as exc:
        if exc.errno == 2:
            print("{0} does not exist.".format(command[0]), file=sys.stderr)
        else:
            raise
        return False
    account_password_bytes = account_password.encode(sys.stdin.encoding)
    out, err = clipboard.communicate(account_password_bytes)
    if out or err:
        print("Unexpected output when using {0!r}:".format(' '.join(command)),
                file=sys.stderr)
        if out:
            print("stdout:\n", out, sep="    ", file=sys.stderr)
        if err:
            print("stderr:\n", err, sep="    ", file=sys.stderr)
        return False
    else:
        print("\nAccount password copied to the clipboard "
                "using {0!r}".format(' '.join(command)), file=sys.stderr)
        return True


def osx_clipboard(account_password):
    """Set the clipboard to the account password under OS X."""
    return clipboard(['pbcopy'], account_password)


def x11_clipboard(account_password):
    """Use the X11 clipboard through xclip to set the account password."""
    return clipboard(['xclip', '-selection', 'clipboard'], account_password)


def win32_clipboard(account_password):
    win32clipboard.OpenClipboard()
    win32clipboard.EmptyClipboard()
    win32clipboard.SetClipboardText(account_password)
    win32clipboard.CloseClipboard()
    print("\nAccount password copied to the clipboard", file=sys.stderr)
    return True


def set_account_password(account_password, clipboard=True, stdout=True):
    if clipboard:
        if sys.platform == 'darwin':
            if osx_clipboard(account_password):
                return True
        elif sys.platform == 'win32' and win32clipboard is not None:
            if win32_clipboard(account_password):
                return True
        elif x11_clipboard(account_password):
            return True
    if stdout:
        # Fallback if no clipboard works.
        print_account_password(account_password)
        return True
    else:
        return False


def main(cmd_line_args=[]):
    parser = argparse.ArgumentParser(prog="oplop", description=__doc__)
    parser.add_argument("--stdout", "-o", action='store_true',
            help="Print account password to stdout; do not use the clipboard")
    parser.add_argument("--clipboard", "-c", action='store_true',
                        help="Only use the clipboard")
    parser.add_argument("--verify", "-v", action='store_true',
                help='Double-check the master password by entering it twice')
    parser.add_argument("nickname", nargs='?', help="Account nickname")
    parser.add_argument("master_password", nargs='?', help="Master password")
    args = parser.parse_args(cmd_line_args)
    if args.nickname:
        label = args.nickname
    else:
        label = get_account_name()
    if args.master_password:
        master = args.master_password
    else:
        master = get_master_password()
        if args.verify:
            master_again = get_master_password(verifying=True)
            if master != master_again:
                print("\nMaster password verification failed!", file=sys.stderr)
                sys.exit(1)
    password = create(label, master)
    use_clipboard = not args.stdout
    use_stdout = not args.clipboard
    if not set_account_password(password, clipboard=use_clipboard,
                                stdout=use_stdout):
        sys.exit(1)


if __name__ == '__main__':
    main(sys.argv[1:])
