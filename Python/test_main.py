#!/usr/bin/env python3
import runpy

try:
    runpy.run_module('oplop.tests', run_name='__main__', alter_sys=True)
except ImportError:  # Python 2.5 compat
    runpy.run_module('oplop.tests.__main__', run_name='__main__', alter_sys=True)
