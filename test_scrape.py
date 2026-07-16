import json
from collections import Counter
from src.scraping.ah_scraper import AHScraper

print("Running AH scraper...")
data = AHScraper().scrape()

print()
print(f"Total products scraped: {len(data)}")
print()
print(f"{'PRODUCT':<50} {'CATEGORY':<25} {'DISCOUNT'}")
print("-" * 100)
for d in data:
    prod = (d.get("product") or "N/A")[:48]
    cat  = (d.get("category") or "UNMAPPED")[:23]
    disc = str(d.get("discount", ""))[:20]
    print(f"{prod:<50} {cat:<25} {disc}")

cats = Counter(d.get("category") or "UNMAPPED" for d in data)
print()
print("--- CATEGORY BREAKDOWN ---")
for cat, n in sorted(cats.items(), key=lambda x: -x[1]):
    print(f"  {n:3d}  {cat}")

with open("src/scraping/new_raw_deals.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
print()
print("Saved to src/scraping/new_raw_deals.json")
