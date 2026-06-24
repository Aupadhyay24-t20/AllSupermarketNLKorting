"""
CLI for manually approving and loading a held cleaned JSON file.
Usage: python -m src.pipeline.approve_load --file data/raw/ah_20260624T070012Z_cleaned.json --week 2026-06-24
"""
import argparse
from datetime import date
from dotenv import load_dotenv

load_dotenv()

from src.cleaning.cleaned_data import load_to_supabase


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', required=True, help='Path to the held _cleaned.json file')
    parser.add_argument('--week', default=date.today().isoformat(), help='week_scraped date (YYYY-MM-DD)')
    args = parser.parse_args()

    count = load_to_supabase(args.file, args.week)
    print(f"Done! Inserted {count} deals for week {args.week}.")


if __name__ == '__main__':
    main()
