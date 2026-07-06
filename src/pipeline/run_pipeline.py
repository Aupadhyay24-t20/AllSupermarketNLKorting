import argparse
import json
import os
import sys
from datetime import date, datetime, timezone

import pandas as pd
from dotenv import load_dotenv

load_dotenv()

from src.scraping.webScrapper import albertijn_data, jumbo_data
from src.cleaning.clean_ah import clean as clean_ah
from src.cleaning.clean_jumbo import clean_jumbo
from src.pipeline.anomaly import check_anomalies
from src.cleaning.cleaned_data import load_to_supabase, already_loaded_today

_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_RAW_DIR = os.path.join(_REPO_ROOT, 'data', 'raw')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--store', required=True, choices=['ah', 'jumbo'])
    args = parser.parse_args()

    store_slug = args.store
    ts = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    os.makedirs(_RAW_DIR, exist_ok=True)

    week = date.today().isoformat()
    store_name = 'Albertijn' if store_slug == 'ah' else 'Jumbo'

    if already_loaded_today(store_name, week):
        print(f"[pipeline] {store_name} data for {week} already in DB. Skipping.")
        sys.exit(0)

    # --- Scrape ---
    print(f"[pipeline] Scraping {store_slug}...")
    if store_slug == 'ah':
        raw_data = albertijn_data()
    else:
        raw_data = jumbo_data()

    raw_path = os.path.join(_RAW_DIR, f'{store_slug}_{ts}.json')
    with open(raw_path, 'w', encoding='utf-8') as f:
        json.dump(raw_data, f, ensure_ascii=False, indent=2)
    print(f"[pipeline] Raw saved: {raw_path} ({len(raw_data)} items)")


    print(f"[pipeline] Cleaning...")
    raw_df = pd.DataFrame(raw_data)
    if store_slug == 'ah':
        cleaned_df, clean_anomalies = clean_ah(raw_df)
    else:
        cleaned_df, clean_anomalies = clean_jumbo(raw_df)
    print(f"[pipeline] Cleaned: {len(cleaned_df)} rows")

    # --- Anomaly check ---
    all_anomalies = check_anomalies(store_name, cleaned_df, clean_anomalies)

    if all_anomalies:
        cleaned_path = os.path.join(_RAW_DIR, f'{store_slug}_{ts}_cleaned.json')
        report_path = os.path.join(_RAW_DIR, f'{store_slug}_{ts}_anomaly_report.txt')

        cleaned_df.to_json(cleaned_path, orient='records', indent=2, force_ascii=False)

        report = '\n'.join(f'- {a}' for a in all_anomalies)
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(f"Anomaly report — {store_slug} — {ts}\n\n{report}\n")

        print(f"\n[pipeline] ANOMALIES DETECTED — halting before Supabase insert.")
        print(report)
        print(f"\nCleaned data: {cleaned_path}")
        print(f"Report:       {report_path}")
        sys.exit(42)

    # --- Load ---
    cleaned_path = os.path.join(_RAW_DIR, f'{store_slug}_{ts}_cleaned.json')
    cleaned_df.to_json(cleaned_path, orient='records', indent=2, force_ascii=False)

    count = load_to_supabase(cleaned_path, week)
    print(f"[pipeline] Done! Inserted {count} deals for week {week}.")
    sys.exit(0)


if __name__ == '__main__':
    main()
