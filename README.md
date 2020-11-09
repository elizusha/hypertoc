# HyperToc

This repository contains a demo that demonstrates potential functionality of a schema that expresses the structure of media files, e.g. characters in the book. For example, such a schema could allow to simplify voice control over the structured data.


## How to use

1. Navigate to https://elizusha.github.io/hypertoc/
1. Choose a media file
    * [Single file](docs/data/single_file.json) - an artificial example of a single media file where hypertoc entries contain information about time offsets in the file.
    * [Several files](docs/data/1411.json) - a real-world example where each hypertoc entry contains a link to its own media file.
    * [Russian single file](docs/data/russian.json) - a real-world example of a single media file where hypertoc entries contain information about time offsets in the file.
1. Use the navigational panel on the right to select a chapter.
1. Use the speech panel below to navigate the content. Currently only "next" command is supported.


## Additional tools

[converter.py](scripts/converter.py) - python script that converts RSS files with media content information to JSON-LD with hypertoc schema.
