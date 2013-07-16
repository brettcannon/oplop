from .. import create
from . import testdata
import unittest

class AlgorithmTest(unittest.TestCase):

    def test(self):
        for data in testdata:
            label = data['label']
            master = data['master']
            expected_password = data['password']
            created = create(label, master)
            self.assertEqual(created, expected_password)


def test_main():
    from test.support import run_unittest
    run_unittest(AlgorithmTest)


if __name__ == '__main__':
    test_main()
