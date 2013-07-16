from distutils.core import setup
import sys


if sys.version_info[:2] < (2, 6):
    raise SystemExit("Oplop requires Python 3.1 or newer "
                        "(or Python 2.6 or newer)")


packages = ['oplop']
# Tests run under Python 3 only.
if sys.version_info[:2] >= (3, 1):
    packages.append('oplop.tests')

with open('README', 'r') as file:
    long_description = file.read()


setup(name="Oplop",
        version='1.6',
        description="Generate account passwords based on account nicknames and "
                    "a master password.",
        long_description=long_description,
        author="Brett Cannon",
        author_email="brett@python.org",
        url="http://oplop.googlecode.com",
        download_url="http://pypi.python.org/pypi/Oplop",
        classifiers=[
            'Development Status :: 5 - Production/Stable',
            'Environment :: Console',
            'License :: OSI Approved :: Apache Software License',
            'Natural Language :: English',
            'Operating System :: OS Independent',
            'Topic :: Security',
            'Programming Language :: Python :: 2',
            'Programming Language :: Python :: 2.6',
            'Programming Language :: Python :: 2.7',
            'Programming Language :: Python :: 3',
            # Python 3.0 probably works, but it's untested.
            'Programming Language :: Python :: 3.1',
            'Programming Language :: Python :: 3.2',
            'Programming Language :: Python :: 3.3',
        ],
        packages=packages,
        scripts=['bin/oplop'] if sys.platform != 'win32' else None,
)
