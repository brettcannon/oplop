#!/usr/bin/env python2.7
import argparse
import datetime
import hashlib


manifest_template="""CACHE MANIFEST
# Created on {timestamp}
# MD5 hash of files in hexidecimal: {md5_hash}
CACHE:
{filepaths}

NETWORK:
*
"""

# UTC implementation snagged from datetime docs.
ZERO = datetime.timedelta(0)
HOUR = datetime.timedelta(hours=1)

# A UTC class.

class UTC(datetime.tzinfo):
    """UTC"""

    def utcoffset(self, dt):
        return ZERO

    def tzname(self, dt):
        return "UTC"

    def dst(self, dt):
        return ZERO

utc = UTC()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
            description='Create an HTML5 cache manifest file')
    parser.add_argument('--output', dest='output')
    parser.add_argument('input', nargs='+')
    args = parser.parse_args()

    # Don't accidentally list the manifest file itself.
    try:
        args.input.remove(args.output)
    except ValueError:
        pass

    md5_hash = hashlib.md5()
    for input_path in args.input:
        with open(input_path, 'rb') as file:
            md5_hash.update(file.read())

    with open(args.output, 'w') as file:
        file.write(manifest_template.format(
                timestamp=datetime.datetime.now(utc).isoformat(),
                md5_hash=md5_hash.hexdigest(),
                filepaths='\n'.join(sorted(args.input))))
