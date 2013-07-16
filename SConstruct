from __future__ import print_function, with_statement

import os.path
import sys
import zipfile


vars = Variables()
vars.Add(EnumVariable('DEPLOY', 'Deploy an implementation', '',
                        allowed_values=('', 'AppEngine', 'ChromeExtension',
                                        'ChromeWebApp')))

env = Environment(variables=vars)


def CopyFile(target, source):
    """Copy the file to its destination."""
    if target is None:
        target = os.path.basename(source)
    return Command(target, source, Copy('$TARGET', '$SOURCE'))


def CopyIcons(*sizes):
    """Copy the icons in the specified sizes."""
    for size in sizes:
        filename = "icon" + str(size).zfill(3) + ".png"
        CopyFile(None, "#/icons/" + filename)


def ZipFiles(zip_path, *contents):
    """Zip contents into a file."""
    def archive(target, source, env):
        zip_path = str(target[0])
        zip_dir = os.path.dirname(zip_path) + '/'
        print("Creating zip file", zip_path, ':')
        zip_file = zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED)
        try:
            for path in source:
                path = str(path)
                rel_path = path[len(zip_dir):]
                print('  ', rel_path)
                zip_file.write(path, rel_path)
        finally:
            zip_file.close()

    paths = []
    for path in contents:
        if '*' in path:
            path = Glob(path)
        paths.append(path)
    Command(zip_path, paths, archive)


try:
    import jinja2
except ImportError:
    def RenderTemplate(*args, **kwargs):
        print("*** Jinja2 required to render HTML templates", file=sys.stderr)
else:
    def RenderTemplate(rendered, *templates, **template_args):
        """Render a Django template.

        The first template listed is expected to be the explicit template which
        should be rendered in the end.

        """
        def render_django_template(target, source, env):
            # Convert paths with construction variables to absolute paths.
            rendered_path = str(target[0])
            template_paths = map(str, source)
            template_dirs = list(map(os.path.dirname, template_paths))
            # Pull together all the directories containing templates.
            loader = jinja2.FileSystemLoader(template_dirs)
            jinja_env = jinja2.Environment(loader=loader)
            # Render the template.
            template_name = os.path.basename(template_paths[0])
            template = jinja_env.get_template(template_name)
            # Write out the rendered template.
            with open(rendered_path, 'w') as file:
                file.write(template.render(**template_args))

        return Command(rendered, templates, render_django_template)

CLOSURE_COMPILER = File('#/compiler.jar')

Export('env', 'CopyFile')
Export('env', 'CopyIcons')
Export('env', 'RenderTemplate')
Export('env', 'ZipFiles')
Export('env', 'CLOSURE_COMPILER')




SConscript([os.path.join(directory, 'SConscript')
            for directory in ('AppEngine',
                              'Chrome',
                              'JavaScript',
                              'HTML5',
                              'Python',
                              'SL4A',
                              )])
