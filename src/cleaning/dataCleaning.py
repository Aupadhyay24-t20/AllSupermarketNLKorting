import json
import src.scraping.webScrapper

print("Pick either or both to webscrap! Jumbo or AH?")
supermarket = input("")
if supermarket == "AH":
    all_products = src.scraping.webScrapper.albertijn_data()
    with open('../scraping/new_raw_deals.json', 'w') as f:
        json.dump(all_products, f)
elif supermarket == "Jumbo":
    all_j_products = src.scraping.webScrapper.jumbo_data()
    with open('../scraping/j_raw_deals_2.json', 'w') as f:
        json.dump(all_j_products, f)

