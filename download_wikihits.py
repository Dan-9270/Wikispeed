#! /usr/bin/env python3
"""
Download latest hits for Wikipedia articles
"""

import os, sys, shutil, requests, datetime, gzip

def get_hits_url(year, month, day, hour):
    return f"https://dumps.wikimedia.org/other/pageviews/{year}/{year}-{month:02d}/pageviews-{year}{month:02d}{day:02d}-{hour:02d}0000.gz"

def merge(a, b):
    for (k, v) in b.items():
        a[k] = a.get(k, 0) + v
    return a

def download_hour(year, month, day, hour, language):
    print(f"Download for {year}-{month}-{day} {hour}h for language {language}", file=sys.stderr)
    articles = {}
    with requests.get(get_hits_url(year, month, day, hour), stream=True) as r0:
        with gzip.open(r0.raw, mode='rt', encoding="utf8") as r:
            for line in r:
                elements = line.split()
                if len(elements) == 4 and (elements[0] == language or elements[0] == f"{language}.m") and (elements[3] == '0') and not elements[1].startswith("\"") and not elements[1].startswith("'") and not elements[1].startswith("Wikipédia:") and not elements[1].startswith("Fichier:") and not elements[1].startswith("Discussion") and not elements[1].startswith("Utilisateur"):
                    articles[elements[1]] = articles.get(elements[1], 0) + int(elements[2])
    return articles

def download_day(year, month, day, language):
    print(f"Download for {year}-{month}-{day} for language {language}", file=sys.stderr)
    result = {}
    for hour in range(1):
        result = merge(result, download_hour(year, month, day, hour, language))
    return result

def download_day_range(year, month, day, day_number, language):
    print(f"Download {day_number} days from {year}-{month}-{day} for language {language}", file=sys.stderr)
    result = {}
    current = datetime.date(year, month, day)
    for i in range(day_number):
        result = merge(result, download_day(current.year, current.month, current.day, language))
        current += datetime.timedelta(days=1)
    return result

def print_result(result):
    sorted_keys = sorted(result, key=lambda x: result[x], reverse=True)
    for k in sorted_keys:
        print(f"{k}\t{result[k]}")

def main():
    try:
        day_spec = list(map(int, sys.argv[1].split("-")))
        day_number = int(sys.argv[2])
        language = sys.argv[3]
    except:
        print(f"Usage: {sys.argv[0]} year-month-day day_number language", file=sys.stderr)
        sys.exit(-1)
    data = download_day_range(day_spec[0], day_spec[1], day_spec[2], day_number, language)
    print_result(data)


if __name__ == "__main__":
    main()
