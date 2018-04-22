--- yaml | ss
# The `---` above is the start delimiter of the head section.
#
# After the `---` delimiter is the chain of protocol URIs.
# E.g. `yaml` is shorthand for the protocol URI `yaml://`.
#
# The metadata builder specified in config `METADATA_BUILDER_URI` will resolve
# the chain of protocol URIs using resolvers provided in directory
# `root://tools/protocol/`. These resolvers should return builders, and these
# builders will be called one after another to build the metadata head section
# into a metadata dict. This metadata dict is used as context dict when
# building the body section using the `nunjucks` builder below.
#
index_file: index.json

title: JSON demo

create_time: 2018-04-20 10:00:00

tags:
    - json

# Use `root` protocol to get `src` diretory path.
src_dir: ss://root://src

# Use `path` protocol to get upper diretory path.
# Paths starting with `./` or `../` will be resolved to absolute path.
upper_dir: ss://path://../

# Use `self` protocol to get this file's diretory path.
file_dir: ss://self://$$file_dir

# Use `self` protocol to get this file's path.
file_path: ss://self://$$file_uri
    
# Output file URI.
# Used by the `output` builder below.
$output: chroot://path=./index.json&from=root://src&to=root://build

# The `---` below is the start delimiter of the body section.
#
# After the `---` delimiter is the chain of protocol URIs.
# E.g. `nunjucks` is shorthand for the protocol URI `nunjucks://`.
#
# The metadata builder specified in config `METADATA_BUILDER_URI` will resolve
# the chain of protocol URIs using resolvers provided in directory
# `root://tools/protocol/`. These resolvers should return builders, and these
# builders will be called one after another to build the metadata body section
# into output.
#
# The nunjucks builder uses the metadata dict obtained by building the metadata
# head section above as the context dict. This is why the keys in the metadata
# head section can be used in the metadata body section.
#
--- nunjucks | json | json_dump | output
{
	"index_file": "{{index_file}}",
	"title": "{{title}}",
	"create_time": "{{create_time}}",
	"src_dir": "{{src_dir}}",
	"upper_dir": "{{upper_dir}}",
	"file_dir": "{{file_dir}}",
	"file_path": "{{file_path}}"
}
