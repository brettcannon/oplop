#!/usr/bin/env python2.7
from __future__ import absolute_import, print_function

import argparse
import datetime
import hashlib
import os
import re

import yaml


MANIFEST_FILE_PATH = 'cache.manifest'

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

class UTC(datetime.tzinfo):
    """UTC"""

    def utcoffset(self, dt):
        return ZERO

    def tzname(self, dt):
        return "UTC"

    def dst(self, dt):
        return ZERO

utc = UTC()


def in_static_dir(filepath, static_dirs):
    """See if filepath is contained within a directory contained in
    static_dirs."""
    for directory in static_dirs:
        if filepath.startswith(directory):
            return True
    else:
        return False


def find_files(manifest_path=MANIFEST_FILE_PATH):
    """Discover files to (not) use in the manifest file.

    The manifest file itself is left out.
    """
    with open('app.yaml') as file:
        gae_config = yaml.load(file)

    skip_re = re.compile('|'.join('({})'.format(regex)
                         for regex in gae_config['skip_files']))

    static_files = set()
    static_dirs = set()
    for handler in gae_config['handlers']:
        if 'secure' not in handler or handler['secure'] != 'always':
            RuntimeError('handler rule for {!r} does not force SSL'.format(
                    handler['url']))

        if 'static_files' in handler:
            static_files.add(handler['static_files'])
        elif 'static_dir' in handler:
            static_dirs.add(handler['static_dir'])

    skipped = set()
    served = set()
    cwd = os.getcwd()
    for dirpath, dirnames, filenames in os.walk(cwd, followlinks=True):
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)[len(cwd)+len(os.sep):]
            if skip_re.match(filepath):
                skipped.add(filepath)
            elif filepath in static_files or in_static_dir(filepath, static_dirs):
                served.add(filepath)
            else:
                raise RuntimeError('{!r} is not handled'.format(filepath))
    served.discard(manifest_path)
    skipped.add(manifest_path)
    return sorted(served), sorted(skipped)


def create_manifest(file_paths, manifest_path=MANIFEST_FILE_PATH):
    file_paths = sorted(file_paths)
    md5_hash = hashlib.md5()
    for input_path in file_paths:
        with open(input_path, 'rb') as file:
            md5_hash.update(file.read())

    with open(manifest_path, 'w') as file:
        file.write(manifest_template.format(
                timestamp=datetime.datetime.now(utc).isoformat(),
                md5_hash=md5_hash.hexdigest(),
                filepaths='\n'.join(file_paths)))


if __name__ == '__main__':
    use, skip = find_files()
    print('USED:')
    for used in use:
        print('  ', used)
    print()
    print('SKIPPED:')
    for skipped in skip:
        print('  ', skipped)
    create_manifest(use)
