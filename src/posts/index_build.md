--- yaml | extend://call://root://tools/basecontext/metadata_base.js

title: Posts

nav_current: posts

breadcrumbs:
  - Home|/blog
  - Posts|/blog/posts

post_glob: root://src/posts/*/index_build.md

$template:
  file: ./index_template.html
  
  builder: root://tools/nunjucks/nunjucks_builder.js

$output: chroot://path=./index.html&from=root://src&to=root://build

--- ./index_builder.js | template | output
