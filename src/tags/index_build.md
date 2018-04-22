--- yaml | extend://call://root://tools/basecontext/metadata_base.js

title: Tags

nav_current: tags

breadcrumbs:
  - Home|/blog
  - Tags|/blog/tags

$template:
  file: ./index_template.html
  
  builder: root://tools/nunjucks/nunjucks_builder.js

$output: chroot://path=./index.html&from=root://src&to=root://build

--- ./index_builder.js | template | output
