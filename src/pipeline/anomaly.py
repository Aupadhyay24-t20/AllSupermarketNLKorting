import os
import pandas as pd
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))


def check_anomalies(store: str, cleaned_df: pd.DataFrame,
                    clean_fn_anomalies: list[str]) -> list[str]:
    anomalies = list(clean_fn_anomalies)

    # Get store_id
    store_result = supabase.table('stores').select('id').eq('name', store).execute()
    if not store_result.data:
        anomalies.append(f"{store}: store not found in Supabase stores table.")
        return anomalies
    store_id = store_result.data[0]['id']

    # Get latest week_scraped for this store
    week_result = (supabase.table('deals')
                   .select('week_scraped')
                   .eq('store_id', store_id)
                   .order('week_scraped', desc=True)
                   .limit(1)
                   .execute())

    if not week_result.data:
        # No previous data — skip row count check
        return anomalies

    latest_week = week_result.data[0]['week_scraped']

    # Count rows from that week
    count_result = (supabase.table('deals')
                    .select('id', count='exact')
                    .eq('store_id', store_id)
                    .eq('week_scraped', latest_week)
                    .execute())

    prev_count = count_result.count
    curr_count = len(cleaned_df)

    if prev_count and curr_count < prev_count * 0.65:
        drop_pct = round((1 - curr_count / prev_count) * 100)
        anomalies.append(
            f"{store}: row count dropped {drop_pct}% vs last run "
            f"({prev_count} → {curr_count}). Scraper may be blocked or page partially loaded."
        )

    return anomalies
