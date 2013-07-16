from .. import __main__
from . import testdata

import contextlib
import io
import subprocess
import sys
import unittest


@contextlib.contextmanager
def temp_setattr(ob, attr, new_value):
    sentinel = object()
    old_value = getattr(ob, attr, sentinel)
    setattr(ob, attr, new_value)
    yield old_value
    if old_value is sentinel:
        delattr(ob, attr)
    else:
        setattr(ob, attr, old_value)


class CLITests(unittest.TestCase):

    """Test that the CLI works properly."""

    tester = testdata[0]

    def capture_args(self):
        args = []
        kwargs = {}
        def capture(*arguments, **kw_arguments):
            nonlocal args, kwargs
            args[:] = arguments
            kwargs.update(kw_arguments)
            return True

        return args, kwargs, capture

    def test_algorithm(self):
        # Make sure that everything is properly calculated.
        for data in testdata:
            account_name = temp_setattr(__main__, 'get_account_name',
                                        lambda: data['label'])
            master_password = temp_setattr(__main__, 'get_master_password',
                                            lambda: data['master'])
            account_password, kwargs, capture = self.capture_args()
            account_password_context = temp_setattr(__main__,
                                                    'set_account_password',
                                                    capture)
            with account_name, master_password, account_password_context:
                __main__.main()
            self.assertEquals(data['password'], account_password[0])
            account_password = None

    def test_account_name_from_terminal(self):
        # Make sure that the account name is taken from the terminal.
        account_name = temp_setattr(__main__, 'input',
                                    lambda *args: self.tester['label'])
        mock_stderr = io.StringIO()
        stderr_ = temp_setattr(sys, 'stderr', mock_stderr)
        master_password = temp_setattr(__main__, 'get_master_password',
                                        lambda: self.tester['master'])
        arg, kwargs, capture = self.capture_args()
        account_password = temp_setattr(__main__, 'set_account_password',
                                        capture)
        with account_name, master_password, account_password, stderr_:
            __main__.main()
        self.assertEquals(arg[0], self.tester['password'])

    def test_command_line(self):
        # Make sure that the account name can be taken from the command-line.
        def error():
            raise Exception
        account_name = temp_setattr(__main__, 'get_account_name', error)
        master_password = temp_setattr(__main__, 'get_master_password',
                                        lambda: self.tester['master'])
        args, kwargs, capture = self.capture_args()
        account_password = temp_setattr(__main__, 'set_account_password',
                                        capture)
        with account_name, master_password, account_password:
            __main__.main([self.tester['label']])
        self.assertEquals(args[0], self.tester['password'])
        with self.assertRaises(BaseException):
            __main__.main([0,1])

    def test_master_password(self):
        # The master password should be grabbed using getpass.getpass().
        account_name = temp_setattr(__main__, 'get_account_name',
                                    lambda: self.tester['label'])
        master_password = temp_setattr(__main__, 'getpass',
                                        lambda *args: self.tester['master'])
        args, kwargs, capture = self.capture_args()
        account_password = temp_setattr(__main__, 'set_account_password',
                                        capture)
        with account_name, master_password, account_password:
            __main__.main()
        self.assertEquals(args[0], self.tester['password'])

    def test_verify_master_password(self):
        # One can verify the master password.
        account_name = temp_setattr(__main__, 'get_account_name',
                                    lambda: self.tester['label'])
        call_count = 0
        master_passwords = [self.tester['master']] * 2
        def count_calls(*args):
            nonlocal call_count
            call_count += 1
            return_ = master_passwords.pop()
            return return_
        master_password = temp_setattr(__main__, 'getpass', count_calls)
        args, kwargs, capture = self.capture_args()
        account_password = temp_setattr(__main__, 'set_account_password',
                                        capture)
        with account_name, master_password, account_password:
            # Success
            __main__.main(['--verify'])
            self.assertEquals(args[0], self.tester['password'])
            self.assertEquals(call_count, 2)
            # Failure
            call_count = 0
            master_passwords = ['a', 'b']
            with self.assertRaises(SystemExit):
                __main__.main(['--verify'])
            self.assertEquals(call_count, 2)

    @unittest.skipIf(sys.platform != "darwin", "requires OS X")
    def test_osx_clipboard(self):
        # Under OS X, the account password should be copied to the clipboard.
        account_name = temp_setattr(__main__, 'get_account_name',
                                    lambda: self.tester['label'])
        master_password = temp_setattr(__main__, 'get_master_password',
                                        lambda: self.tester['master'])
        silence_print = temp_setattr(__main__, 'print', lambda *args, **kwargs:
                                        None)
        with account_name, master_password, silence_print:
            __main__.main()
        pasteboard = subprocess.check_output('pbpaste')
        expected_bytes = self.tester['password'].encode(sys.stdout.encoding)
        self.assertEquals(pasteboard, expected_bytes)

    def test_output_stderr(self):
        # All output should go to stderr so it goes to a single location.
        # Also implicitly tests the case where the account password is printed
        # to stdout.
        input_arg = None
        def mock_input(prompt=None):
            nonlocal input_arg
            input_arg = prompt
            return ''
        # input prints to stdout; should be empty.
        input_ = temp_setattr(__main__, 'input', mock_input)
        # getpass outputs to stderr.
        getpass_ = temp_setattr(__main__, 'getpass', lambda *args: '')
        # Nothing should end up in stdout but the account password.
        mock_stdout = io.StringIO()
        stdout_ = temp_setattr(sys, 'stdout', mock_stdout)
        mock_stderr = io.StringIO()
        stderr_ = temp_setattr(sys, 'stderr', mock_stderr)
        account_password = __main__.create('', '')
        output = temp_setattr(__main__, 'set_account_password',
                    lambda a_p, **kwargs: __main__.print_account_password(a_p))
        with input_, getpass_, stdout_, stderr_, output:
            __main__.main()
        self.assertIs(input_arg, None)
        self.assertEqual(mock_stdout.getvalue(), account_password)

    def test_cmdline_args(self):
        # Test that the command line arguments work appropriately.
        nickname = temp_setattr(__main__, 'get_account_name', lambda: '')
        master = temp_setattr(__main__, 'get_master_password', lambda: '')
        args, kwargs, capture = self.capture_args()
        account = temp_setattr(__main__, 'set_account_password', capture)
        with nickname, master, account:
            expect = __main__.create('a', '')
            __main__.main(['a'])
            self.assertEqual(args[0], expect)
            self.assertEqual(list(kwargs.values()), [True, True])
            args[:] = []
            expect = __main__.create('a', 'b')
            __main__.main(['a', 'b'])
            self.assertEqual(args[0], expect)
            args[:] = []
            kwargs.clear()
            __main__.main(['-o'])
            self.assertTrue(kwargs['stdout'])
            self.assertFalse(kwargs['clipboard'])
            kwargs.clear()
            __main__.main(['-c'])
            self.assertFalse(kwargs['stdout'])
            self.assertTrue(kwargs['clipboard'])

    @unittest.skipIf(sys.platform != "darwin", "requires OS X")
    def test_clipboard_failure(self):
        # If clipboard-only usage is specified then call sys.exit, else print
        # it to the screen.
        print_args, _, print_capture = self.capture_args()
        print_ = temp_setattr(__main__, 'print_account_password',
                                print_capture)
        clipboard = temp_setattr(__main__, 'clipboard', lambda *args: False)
        exit_args, _, exit_capture = self.capture_args()
        exit = temp_setattr(sys, 'exit', exit_capture)
        with print_, clipboard, exit:
            __main__.main(['a', 'a'])
            self.assertTrue(print_args)
            self.assertFalse(exit_args)
            print_args[:] = []
            __main__.main(['-c', 'a', 'a'])
            self.assertFalse(print_args)
            self.assertTrue(exit_args)


def test_main():
    from test.support import run_unittest
    run_unittest(CLITests)



if __name__ == '__main__':
    test_main()
