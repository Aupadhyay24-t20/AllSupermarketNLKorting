import json
import re
import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

store_cache = {}
discount_type_cache = {}

def get_store_id(store_name):
    if store_name in store_cache:
        return store_cache[store_name]
    result = supabase.table('stores').select('id').eq('name', store_name).execute()
    store_id = result.data[0]['id'] if result.data else None
    store_cache[store_name] = store_id
    return store_id

def get_discount_type_id(discount_text):
    if not discount_text:
        return None
    d = discount_text.lower()

    if re.search(r'\d+\+\d+ gratis', d):                   label = 'X+Y Gratis'
    elif '2e gratis' in d or 'uitgelicht 2e gratis' in d:  label = '2e Gratis'
    elif '2e halve prijs' in d:                             label = '2e Halve Prijs'
    elif 'super friday' in d:                               label = 'Super Friday'
    elif 'combikorting' in d:                               label = 'Combikorting'
    elif re.search(r'\d+%', d) or 'korting' in d:          label = '% Korting'
    elif re.search(r'\d+ voor \d+', d):                     label = 'X voor Prijs'
    elif re.search(r'van \d+', d):                          label = 'Van/Voor Prijs'
    elif re.search(r'voor \d+[\.,]', d):                    label = 'Vaste Prijs'
    elif re.search(r'per \d+ gram|\d+ gram voor', d):       label = 'Per Gewicht'
    elif '€' in d or re.search(r'\d+,\d+ korting', d):     label = 'Bedrag Korting'
    elif 'gratis' in d:                                     label = 'Gratis Actie'
    else:                                                   label = 'Overig'

    if label in discount_type_cache:
        return discount_type_cache[label]

    result = supabase.table('discount_types').select('id').eq('label', label).execute()
    type_id = result.data[0]['id'] if result.data else None
    discount_type_cache[label] = type_id
    return type_id

def extract_discount_pct(discount_text):
    if not discount_text:
        return None
    match = re.search(r'(\d+)%', discount_text)
    return float(match.group(1)) if match else None


def load_to_supabase(filepath: str, week: str) -> int:
    with open(filepath, encoding='utf-8') as f:
        deals = json.load(f)

    print(f"Loading {filepath} — {len(deals)} deals")

    rows = []
    for deal in deals:
        rows.append({
            'product':          deal.get('product'),
            'discount_raw':     deal.get('discount'),
            'discount_pct':     extract_discount_pct(deal.get('discount')),
            'link':             deal.get('link'),
            'store_id':         get_store_id(deal.get('store')),
            'discount_type_id': get_discount_type_id(deal.get('discount')),
            'start_date':       deal.get('start_date'),
            'end_date':         deal.get('end_date'),
            'week_scraped':     week,
            'image_url':        deal.get('image_url')
        })

    supabase.table('deals').insert(rows).execute()
    return len(rows)


if __name__ == '__main__':
    _REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    files = [
        (os.path.join(_REPO_ROOT, 'data', 'J_cleaned_9.json'), '2026-07-01'),
    ]

    total = 0
    for filepath, week in files:
        total += load_to_supabase(filepath, week)

    print(f"\nDone! Inserted {total} deals total.")
