#!/usr/bin/env python2.6
import runpy

try:
    runpy.run_module('oplop', run_name='__main__', alter_sys=True)
except ImportError:  # Python 2.5 compat
    runpy.run_module('oplop.__main__', run_name='__main__', alter_sys=True)
