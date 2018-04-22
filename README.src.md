[:var_set('', """
# Compile command
aoikdyndocdsl -s README.src.md -n aoikdyndocdsl.ext.all::nto -g README.md
""")
]\
[:HDLR('heading', 'heading')]\
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
- Node.js 8.11.1
- Python 3.6.5, 2.7.14

## Table of Contents
[:toc(beg='next', indent=-1)]

## Usage

### Set up the static site generator

#### Set up JavaScript dependency packages
Run in the project directory:
```
npm install
```

This is the only time `npm install` needs be run manually. This project's gulp
tasks can detect changes in package.json and run `npm install` automatically.

#### Build static files
Run in the project directory:
```
node node_modules/gulp/bin/gulp.js
```

The result static files are inside the "build" directory. They can be served
by a web server such as Nginx.

An exmaple nginx.conf file:
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

Then open "http://localhost/blog" in a browser.

For the comment function to work, the API server needs be set up.

### Set up the API server

#### Create database and user
Run in a MySQL client:
```
CREATE DATABASE aoiksss DEFAULT CHARACTER SET utf8mb4;

CREATE USER aoiksss@'%' IDENTIFIED BY 'aoiksss';

GRANT ALL ON aoiksss.* TO aoiksss@'%';
```

#### Set up Python dependency packages
Run in the project directory:
```
pip install -r api/requirements.txt
```

#### Edit the API server's config file
Edit "api/src/aoikseldomstaticsiteapi/config.py".

#### Run the API server
Run in the project directory:
```
python api/src/aoikseldomstaticsiteapi/__main__.py
```

Now the comment function should work.

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
