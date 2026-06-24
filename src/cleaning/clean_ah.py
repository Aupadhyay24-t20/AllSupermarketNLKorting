import pandas as pd

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
    date = df["date"].str.split(expand=True)
    start = date[0]
    end = date[1]
    month = date[2]
    start_date = start + " " + month
    end_date = end + " " + month
    df["start_date"] = start_date
    df["end_date"] = end_date
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