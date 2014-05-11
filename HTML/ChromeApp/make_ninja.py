"""Generate a build.ninja file to make up for the lack of symlink support in
Chrome when working with an unpackaged app.

Re-build any time files are added/removed from the base implementation.

"""
import os
import sys
sys.path.append('..')

import ninja_syntax


SYMLINKS = ['index.html', 'assets']
ZIPFILE_EXTRAS = ['manifest.json', 'background.js', 'impl.js']
ZIPFILE_TARGET = os.path.join('../oplop-chrome_app.zip')


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


if __name__ == '__main__':
    to_ignore = [ZIPFILE_TARGET, 'build.ninja'] + SYMLINKS
    check_gitignore(*to_ignore)
    rel_paths = find_files(SYMLINKS)
    all_files = list(sorted(ZIPFILE_EXTRAS[:]+rel_paths))
    see_what_is_missing(all_files)

    with open('build.ninja', 'w') as file:
        ninja = ninja_syntax.Writer(file)

        ninja.rule('make_zipfile', 'zip $out $in')
        ninja.rule('sync_versions', 'python sync_versions.py $in $out')
        ninja.newline()
        ninja.newline()

        ninja.comment("Keep version numbers in sync")
        ninja.build('manifest.mobile.json', 'sync_versions', 'manifest.json',
                    implicit=['sync_versions.py', 'make_ninja.py'])
        ninja.newline()

        ninja.build(ZIPFILE_TARGET, 'make_zipfile', all_files,
                    implicit=['make_ninja.py'])
