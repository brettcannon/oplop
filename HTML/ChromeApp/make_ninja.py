"""Generate a build.ninja file to make up for the lack of symlink support in
Chrome when working with an unpackaged app."""

import os


SYMLINKS = ['index.html', 'assets']
ZIPFILE_EXTRAS = ['manifest.json', 'impl.js']
ZIPFILE_TARGET = os.path.join('../oplop-chrome_app.zip')
NINJA_HEADER = """
rule copy_file
  command = cp $in $out

rule make_zipfile
  command = zip $out $in

"""


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


def create_copy_rule(path):
    """Create a ninja rule for copying the specified file from .. to the cwd."""
    return 'build {path}: copy_file ../{path}'.format(path=path)


def create_zip_rule(target, paths):
    """Create a ninja rule for generating a zip file from the files in the
    Chrome app directory."""
    return 'build {}: make_zipfile {}'.format(target, ' '.join(paths))


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
    build_file = [NINJA_HEADER]
    for path in rel_paths:
        build_file.append(create_copy_rule(path))
    all_files = ZIPFILE_EXTRAS[:]+rel_paths
    see_what_is_missing(all_files)
    zipfile_rule = create_zip_rule(ZIPFILE_TARGET, all_files)
    build_file.append(zipfile_rule)
    with open('build.ninja', 'w') as file:
        file.write('\n'.join(build_file))
        file.write('\n')

