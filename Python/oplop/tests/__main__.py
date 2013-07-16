from . import test_algorithm
from . import test_cli
import os.path
import test.support
import unittest

def test_main():
    for mod in (test_algorithm, test_cli):
        getattr(mod, 'test_main')()


if __name__ == '__main__':
    test_main()
