--- yaml

nav_current: home

breadcrumbs:
  - Home|/blog

$template:
  file: ./index_template.html
  
  builder: root://tools/nunjucks/nunjucks_builder.js

$output: chroot://path=./index.html&from=root://src&to=root://build
  
--- template | output
