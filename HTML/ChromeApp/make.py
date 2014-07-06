#!/usr/bin/env python2.7
"""Generate a build.ninja file to make up for the lack of symlink support in
Chrome when working with an unpackaged app.

Re-build any time files are added/removed from the base implementation.

"""
from __future__ import absolute_import, print_function

import json
import os
import sys
import zipfile


SYMLINKS = ['index.html', 'assets']
ZIPFILE_EXTRAS = ['manifest.json', 'background.js', 'impl.js']
ZIPFILE_TARGET = os.path.join('..', 'oplop-chrome_app.zip')


def find_files(paths):
    """Find all files, starting at '..', as specified by 'paths'.

    If something in 'paths' is a directory, then recursively find all files in
    that directory.
    """
    rel_paths = []
    for path in paths:
        root_path = os.path.join('..', path)
        if not os.path.exists(root_path):
            raise ValueError(root_path + ' does not exist')
        elif os.path.isfile(root_path):
            rel_paths.append(path)
        else:
            for dirpath, dirnames, filenames in os.walk(root_path,
                    followlinks=True):
                for filename in filenames:
                    if filename.startswith('.'):
                        continue
                    path = os.path.join(dirpath, filename)[3:]  # Skip ../
                    rel_paths.append(path)
    return rel_paths


def check_gitignore(*check_for):
    """Check that .gitignore has rules for ignoring the files specified."""
    repo_root = os.path.abspath('../..')
    cwd = os.getcwd()[len(repo_root)+len(os.sep):]
    with open('../../.gitignore') as file:
        gitignore = file.read()
    for path in check_for:
        rel_path = os.path.normpath('/'.join([cwd, path]))
        if rel_path not in gitignore:
            raise ValueError(rel_path + ' not in .gitignore')


def see_what_is_missing(have_so_far):
    """Alert the user to what files are not being included in the zip file."""
    for dirpath, dirnames, filenames in os.walk('.'):
        for filename in filenames:
            path = os.path.join(dirpath, filename)[2:]
            if path not in all_files:
                print('Ignoring', path)


def make_zipfile(input, output):
    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_STORED, allowZip64=True) as file:
        for path in input:
            print('Zipping', path)
            file.write(path)


def sync_versions(main_path, mobile_path):
    """Set versionCode and CFBundleVersion to meet version in manifest.json."""
    with open(main_path) as file:
        main_data = json.load(file)
    with open(mobile_path) as file:
        mobile_data = json.load(file)
    version = main_data['version']
    mobile_data['versionCode'] = int(version)
    # Statically setting '{version}.1.1' so Oplop seems stable. =)
    mobile_data['CFBundleVersion'] = version + '.1.1'
    with open(mobile_path, 'w') as file:
        json.dump(mobile_data, file, indent=2)
        file.write('\n')
    print('manifest.json/manifest.mobile.json synced')


if __name__ == '__main__':
    to_ignore = [ZIPFILE_TARGET, 'build.ninja']
    check_gitignore(*to_ignore)
    rel_paths = find_files(SYMLINKS)
    all_files = list(sorted(ZIPFILE_EXTRAS[:]+rel_paths))
    see_what_is_missing(all_files)
    make_zipfile(all_files, ZIPFILE_TARGET)

    sync_versions('manifest.json', 'manifest.mobile.json')
