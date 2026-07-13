import pandas as pd
import re

def clean_jumbo(raw_df) -> tuple[pd.DataFrame, list[str]]:
    anomalies = []
    raw_df["date"] = raw_df["date"].apply(wo_remove)
    raw_df["date"] = raw_df["date"].str.split("t/m")
    raw_df[['start_date', 'end_date']] = raw_df['date'].apply(
        lambda x: pd.Series(split_date(x))
    )

    unparseable = raw_df[raw_df['start_date'] == raw_df['end_date']]
    if not unparseable.empty:
        anomalies.append(
            f"Jumbo: {len(unparseable)} row(s) have unparseable date format — "
            f"site date structure may have changed. Samples: {unparseable['start_date'].unique().tolist()[:3]}"
        )

    raw_df = raw_df.drop("date", axis=1)
    raw_df["product"] = raw_df["product"].apply(product_clean)
    raw_df = raw_df[~raw_df["discount"].str.contains("Alleen online", case=True, na=False)]
    raw_df = raw_df[~raw_df["discount"].str.contains("slijterij", case=True, na=False)]
    raw_df = raw_df[raw_df['product'] != 'Welke biermerken zijn bij jouw Jumbo in de aanbieding?']
    raw_df["discount"] = raw_df["discount"].apply(winkel)
    df = discount_filter(raw_df)
    if 'category' in df.columns:
        df['category'] = df['category'].fillna('Other')
    return df, anomalies



def wo_remove(text):
    remove = "wo"
    remove_2 = "di"
    text = text.replace(remove, "")
    text = text.replace(remove_2, "").strip()
    return text

DUTCH_DAYS = {'ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'}

def split_date(date_val):
    if isinstance(date_val, list):
        cleaned = ' '.join(str(x) for x in date_val)
    else:
        cleaned = str(date_val)

    cleaned = cleaned.replace('\xa0', ' ').replace('NBSP', '').strip()
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()

    # Strip Dutch day-of-week prefix if present
    parts = cleaned.split()
    if parts and parts[0].lower() in DUTCH_DAYS:
        cleaned = ' '.join(parts[1:])

    # Existing regex patterns unchanged below
    same_month = re.match(r'(\d+)\s+(\d+)\s+(\w+)', cleaned)
    if same_month:
        day1, day2, month = same_month.groups()
        return f"{day1} {month}", f"{day2} {month}"

    diff_month = re.match(r'(\d+)\s+(\w+)\s+(\d+)\s+(\w+)', cleaned)
    if diff_month:
        day1, month1, day2, month2 = diff_month.groups()
        return f"{day1} {month1}", f"{day2} {month2}"

    print(f"[split_date] Unrecognised format: '{cleaned}'")
    return None, None

def product_clean(text):
    word = "[Kompas JumRouterLink]"
    text = text.replace(word, "").strip()
    return text

def winkel(text):
    wink = "Alleen in de winkel"
    if wink in text:
        return text.replace(wink, "").strip()
    return text

def discount_filter(df):
    remover = 'Gratis emblemen'
    rows_to_drop = []
    for idx in df.index:
        cell_value = str(df.loc[idx, 'discount'])
        if remover.lower() in cell_value.lower():
            rows_to_drop.append(idx)

    return df.drop(index=rows_to_drop)