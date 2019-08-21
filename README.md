# AoikSeldomStaticSite
A static site generator written in JavaScript, plus an API server written in
Python.

Features:
- Write a post in markdown, render to Github-style html automatically.
- Generate table of contents of a post automatically.
- Add tags to posts. View posts by tag.
- Add comments to posts.
- Highlight code in posts.
- Be responsive to different screen sizes.

Tested woring with:
- Node.js 10.16.0
- Python 3.6.5, 2.7.14

## Table of Contents
- [Usage](#usage)
  - [Download the demo project](#download-the-demo-project)
  - [Set up the static site generator](#set-up-the-static-site-generator)
    - [Install JavaScript dependency packages](#install-javascript-dependency-packages)
    - [Build static files](#build-static-files)
  - [Set up the API server](#set-up-the-api-server)
    - [Create database and user](#create-database-and-user)
    - [Install Python dependency packages](#install-python-dependency-packages)
    - [Edit the API server's config file](#edit-the-api-servers-config-file)
    - [Run the API server](#run-the-api-server)
  - [Serve static files](#serve-static-files)
- [Developer Usage](#developer-usage)
  - [Tidy JS files](#tidy-js-files)
  - [Lint JS files](#lint-js-files)
  - [Tidy JSON files](#tidy-json-files)
  - [Tidy CSS files](#tidy-css-files)
  - [Tidy Python files](#tidy-python-files)
  - [Lint Python files](#lint-python-files)

## Usage

### Download the demo project
Download [the demo project](https://github.com/AoiKuiyuyou/AoikMeSiteSource).

### Set up the static site generator

#### Install JavaScript dependency packages
Run in the project directory:
```
npm install
```

This is the only time `npm install` needs to be run manually. This project's
gulp tasks can detect changes in `package.json` and run `npm install`
automatically.

#### Build static files
Run in the project directory:
```
node node_modules/gulp/bin/gulp.js
```
The result static files are inside the `release` directory.

They can be served by a web server such as Nginx. An example Nginx config is
provided below.

For the comment function to work, the API server needs to be set up.

### Set up the API server

#### Create database and user
Run in a MySQL client:
```
CREATE DATABASE aoiksss DEFAULT CHARACTER SET utf8mb4;

CREATE USER aoiksss@'%' IDENTIFIED BY 'aoiksss';

GRANT ALL ON aoiksss.* TO aoiksss@'%';
```

#### Install Python dependency packages
Run in the project directory:
```
pip install -r api/requirements.txt
```

#### Edit the API server's config file
Edit `api/src/aoikseldomstaticsiteapi/config.py`.

#### Run the API server
Run in the project directory:
```
python api/src/aoikseldomstaticsiteapi/__main__.py
```

Now the comment function should work.

### Serve static files
An exmaple `nginx.conf` file:
```
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include mime.types;
    default_type application/octet-stream;
    sendfile on;
    gzip on;

    server {
        listen       80;
        server_name  localhost;

        location = / {
            rewrite ^ /blog redirect;
        }

        location ^~ /blog/api/ {
            proxy_pass_header Server;
            proxy_set_header Host $http_host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_redirect off;
            proxy_pass http://127.0.0.1:8080;
        }

        location /blog {
            # Change this to the project directory's path.
            alias /AoikSeldomStaticSite/build;

            index index.html;

            rewrite ^(.+)/+$ $1 permanent;
            rewrite ^(.+)/index.html$ $1 permanent;

            try_files $uri $uri/index.html =404;
        }
    }
}
```

Reload nginx config:
```
nginx -s reload
```

Open `http://localhost/blog` in a browser.

## Developer Usage

### Tidy JS files
Run:
```
node node_modules/gulp/bin/gulp.js tidy_js
```

### Lint JS files
Run:
```
node node_modules/gulp/bin/gulp.js lint_js
```

### Tidy JSON files
Run:
```
node node_modules/gulp/bin/gulp.js tidy_json
```

### Tidy CSS files
Run:
```
node node_modules/gulp/bin/gulp.js tidy_css
```

### Tidy Python files
Run:
```
cd api/tools/waf

python waf.py tidy
```

### Lint Python files
Run:
```
cd api/tools/waf

python waf.py lint
```
