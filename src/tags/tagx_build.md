--- yaml

breadcrumbs:
  - Home|/blog
  - Tags|/blog/tags
  - This|

nav_current: tags

$tagx_builder:
  template: ./tagx_template.html
  output_dir: chroot://path=./&from=root://src&to=root://build

--- ./tagx_builder.js
