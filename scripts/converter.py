#!/usr/bin/env python3

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
