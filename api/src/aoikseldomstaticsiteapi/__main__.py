# coding: utf-8
from __future__ import absolute_import

import os.path
import sys
from traceback import format_exc


def setup_syspath(package_root, current_dir=None):
    """
    Set up `sys.path` for import resolution.

    :param package_root: Package root directory path. Will be added to \
        `sys.path`. In the repository the package root directory is `src`. \
        After installation the package root directory is `site-packages`.

    :param current_dir: Current directory path. If given, will be removed \
        from `sys.path`.

    :return: None.
    """
    removing_dir_s = ['', '.']

    if current_dir is not None:
        current_dir = os.path.abspath(current_dir)

        removing_dir_s.append(current_dir)

    for path in removing_dir_s:
        while True:
            try:
                sys.path.remove(path)
            except ValueError:
                break

    package_root = os.path.abspath(package_root)

    assert os.path.isabs(package_root), package_root

    assert os.path.isdir(package_root), package_root

    if package_root not in sys.path:
        sys.path.insert(0, package_root)

    pythonpath = os.environ.get('PYTHONPATH', '')

    pythonpath_dir_s = pythonpath.split(os.pathsep)

    pythonpath_dir_s = [os.path.abspath(p) for p in pythonpath_dir_s]

    if package_root not in pythonpath_dir_s:
        pythonpath_dir_s.insert(0, package_root)

    new_pythonpath = os.pathsep.join(pythonpath_dir_s)

    os.environ['PYTHONPATH'] = new_pythonpath


def main(args=None):
    try:
        setup_syspath(
            package_root=os.path.dirname(
                os.path.dirname(os.path.abspath(__file__))
            ),
            current_dir=os.path.dirname(os.path.abspath(__file__)),
        )

        from aoikseldomstaticsiteapi.server import main as main2

        return main2(args)

    except SystemExit:
        raise

    except KeyboardInterrupt:
        return 0

    except BaseException:
        exc_msg = format_exc()

        error_msg = 'Traceback:\n---\n{0}---\n'.format(exc_msg)

        sys.stderr.write(error_msg)

        return -1


if __name__ == '__main__':
    exit(main())
