import json
import webScrapper

print("Pick either or both to webscrap! Jumbo or AH?")
supermarket = input("")
if supermarket == "AH":
    all_products = webScrapper.albertijn_data()
    with open('../new_raw_deals.json', 'w') as f:
        json.dump(all_products, f)
elif supermarket == "Jumbo":
    all_j_products = webScrapper.jumbo_data()
    with open('../j_raw_deals.json', 'w') as f:
        json.dump(all_j_products, f)

