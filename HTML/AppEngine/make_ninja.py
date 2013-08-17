#!/usr/bin/env python2.7
from __future__ import absolute_import, print_function

import os
import re

import yaml

MAKE_NINJA_SCRIPT = __file__
MAKE_MANIFEST_SCRIPT = 'make_manifest.py'
MANIFEST_FILENAME = 'cache.manifest'

NINJA_TEMPLATE = """
rule make_ninja
  generator = {make_ninja_script}
  command = python2.7 {make_ninja_script}

build build.ninja: make_ninja | {make_ninja_script} app.yaml


rule make_manifest
  command = python2.7 make_manifest.py --output $out $in

build {cache_manifest_filename}: make_manifest {served} | {make_manifest_script} app.yaml

default {cache_manifest_filename}
"""


def in_static_dir(filepath, static_dirs):
    """See if filepath is contained within a directory contained in
    static_dirs."""
    for directory in static_dirs:
        if filepath.startswith(directory):
            return True
    else:
        return False


if __name__ == '__main__':
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
                print('Skipped', filepath)
            elif filepath in static_files or in_static_dir(filepath, static_dirs):
                served.add(filepath)
                print('Added', filepath)
            else:
                raise RuntimeError('{!r} is not handled'.format(filepath))

    print()
    print('Skipped:')
    for path in sorted(skipped):
        print('  ', path)

    # Cache manifest cannot depend on itself.
    try:
        served.remove(MANIFEST_FILENAME)
    except KeyError:
        pass

    with open('build.ninja', 'w') as file:
        file.write(NINJA_TEMPLATE.format(make_ninja_script=MAKE_NINJA_SCRIPT,
                make_manifest_script=MAKE_MANIFEST_SCRIPT,
                cache_manifest_filename=MANIFEST_FILENAME,
                served=' '.join(served)))
