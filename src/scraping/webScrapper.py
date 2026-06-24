import json
import os

from src.scraping.ah_scraper import AHScraper
from src.scraping.jumbo_scraper import JumboScraper

_DIR = os.path.dirname(__file__)


def albertijn_data() -> list[dict]:
    data = AHScraper().scrape()
    with open(os.path.join(_DIR, "new_raw_deals.json"), "w") as f:
        json.dump(data, f)
    return data


def jumbo_data() -> list[dict]:
    data = JumboScraper().scrape()
    with open(os.path.join(_DIR, "j_raw_deals_2.json"), "w") as f:
        json.dump(data, f)
    return data

if __name__ == '__main__':
    jumbo_data()