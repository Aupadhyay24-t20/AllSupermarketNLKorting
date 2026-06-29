import pandas as pd
import re

def clean(raw_df: pd.DataFrame) -> tuple[pd.DataFrame, list[str]]:
    raw_df["date"] = raw_df["date"].str.replace(" t/m ", " ")
    df = date_fixer(raw_df)
    df = df.drop("date", axis=1)
    df, anomalies = remove_klikbaar(df)
    df = df[~df["product"].str.contains("bezorging", case=False, na=False)]
    df = df[~df["product"].str.contains("Online", case=True, na=False)]
    df, anomalies = remove_OP(df, anomalies)
    df_new = df.copy()
    df_new["discount"] = df_new.apply(discount_name_cleaner, axis=1)
    df_new["discount"] = df_new["discount"].apply(winkel)
    return df_new, anomalies


def date_fixer(df):
    def parse_date_range(date_str):
        if not isinstance(date_str, str):
            return None, None

        cleaned = date_str.strip()

        same_month = re.match(r'(\d+)\s+(\d+)\s+(\w+)', cleaned)
        if same_month:
            day1, day2, month = same_month.groups()
            return f"{day1} {month}", f"{day2} {month}"

        diff_month = re.match(r'(\d+)\s+(\w+)\s+(\d+)\s+(\w+)', cleaned)
        if diff_month:
            day1, month1, day2, month2 = diff_month.groups()
            return f"{day1} {month1}", f"{day2} {month2}"

        print(f"[date_fixer] Unrecognised format: '{cleaned}'")
        return None, None

    df[["start_date", "end_date"]] = df["date"].apply(
        lambda x: pd.Series(parse_date_range(x))
    )
    return df

def remove_klikbaar(df) -> tuple[pd.DataFrame, list[str]]:
    anomalies = []
    df["discount"] = df["discount"].str[0]
    df["discount"] = df["discount"].str.split(":")
    df["discount"] = df["discount"].str[1]
    null_count = df["discount"].isna().sum()
    if null_count > len(df) * 0.1:
        anomalies.append(
            f"AH: {null_count}/{len(df)} discounts are null after removing 'Klikbaar:' — "
            f"AH may have changed the aria-label format."
        )
    return df, anomalies

def remove_OP(df, anomalies) -> tuple[pd.DataFrame, list[str]]:
    op_rows = df[df["product"].str.contains("OP=OP", case=True, na=False)]
    if op_rows.empty:
        anomalies.append(
            "AH: OP=OP marker not found — page structure may have changed. Keeping all rows."
        )
    else:
        df = df.loc[:op_rows.index[0] - 1]
    return df, anomalies

def discount_name_cleaner(row):
    discount = str(row["discount"])
    product = str(row["product"])
    if(product in discount):
        return discount.replace(product, "").strip()
    return discount

def winkel(text):
    wink = "Alleen in de winkel"
    if wink in text:
        return text.replace(wink, "").strip()
    return text