--- yaml | ss

index_file: index.yml

title: YAML demo

create_time: 2018-04-21 10:00:00

tags:
    - yaml

src_dir: ss://root://src

upper_dir: ss://path://../

file_dir: ss://self://$$file_dir

file_path: ss://self://$$file_uri

$output: chroot://path=./index.yml&from=root://src&to=root://build

--- nunjucks | yaml | yaml_dump | output
index_file: {{index_file}}
title: {{title}}
create_time: {{create_time}}
src_dir: {{src_dir}}
upper_dir: {{upper_dir}}
file_dir: {{file_dir}}
file_path: {{file_path}}
