# coding: utf-8
from __future__ import absolute_import

from setuptools import find_packages
from setuptools import setup


with open('requirements.txt') as requirements_file:
    install_requires = requirements_file.read().splitlines()

setup(
    name='AoikSeldomStaticSiteAPI',

    version='0.0.1',

    description='AoikSeldomStaticSite\'s API server.',

    long_description="""`Documentation on Github
<https://github.com/AoiKuiyuyou/AoikSeldomStaticSite>`_""",

    url='https://github.com/AoiKuiyuyou/AoikSeldomStaticSite',

    author='Aoi.Kuiyuyou',

    author_email='aoi.kuiyuyou@google.com',

    license='MIT',

    classifiers=[
        'Development Status :: 3 - Alpha',
        'Environment :: Console',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: POSIX :: Linux',
        'Operating System :: Microsoft :: Windows',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
    ],

    keywords='static site generator api',

    package_dir={
        '': 'src'
    },

    packages=find_packages('src'),

    install_requires=install_requires,

    entry_points={
        'console_scripts': [
            'aoikseldomstaticsiteapi=aoikseldomstaticsiteapi.__main__:main',
        ],
    },
)
