#!/usr/bin/env python3

# Copyright 2020 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import feedparser
import json
import argparse
from typing import Any, Dict


def convert_rss_item(item) -> Dict[str, Any]:
    return {
        "@type": "HyperTocEntry",
        "name": item["title"],
        "url": item["links"][1]["href"],
        "utterances": [item["title"]]
    }


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("input_file", help="rss file")
    parser.add_argument("output_file", help="json file")
    return parser.parse_args()


def main():
    args = parse_args()
    rss_data = feedparser.parse(args.input_file)
    json_data: Dict[str, Any] = {
        "@context": "https://schema.org/",
        "@type": "HyperToc",
        "associatedMedia": {
            "@type": "AudioObject",
            "encodingFormat": "audio/mpeg",
            "contentUrl": "",
        },
        "tocEntry": [
            convert_rss_item(item)
            for item in rss_data["items"]
        ]
    }

    with open(args.output_file, "w") as f:
        print(json.dumps(json_data, indent=4), file=f)


if __name__ == "__main__":
    main()
