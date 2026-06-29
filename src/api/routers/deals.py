from datetime import date
from fastapi import APIRouter, Query
from src.api.database import supabase

router = APIRouter(prefix="/deals", tags=["deals"])

_NL_MONTHS = {
    "jan": 1, "feb": 2, "mrt": 3, "apr": 4, "mei": 5, "jun": 6,
    "jul": 7, "aug": 8, "sep": 9, "okt": 10, "nov": 11, "dec": 12,
    # English full/abbreviated names — AH sometimes outputs these
    "january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6,
    "july": 7, "august": 8, "september": 9, "october": 10, "november": 11, "december": 12,
    # Full Dutch names
    "januari": 1, "februari": 2, "maart": 3, "mei": 5, "juni": 6,
    "juli": 7, "augustus": 8, "oktober": 10,
}


def _parse_nl_date(s: str, year: int) -> date | None:
    if not s:
        return None
    parts = s.strip().split()
    if len(parts) != 2:
        return None
    try:
        day = int(parts[0])
        month = _NL_MONTHS.get(parts[1].lower())
        if not month:
            return None
        return date(year, month, day)
    except (ValueError, TypeError):
        return None


def _is_active(deal: dict, today: date) -> bool:
    year = today.year
    start = _parse_nl_date(deal.get("start_date"), year)
    end = _parse_nl_date(deal.get("end_date"), year)
    if start is None or end is None:
        return False
    # year-boundary: deal starts in Dec, ends in Jan
    if end < start:
        end = date(year + 1, end.month, end.day)
    return today <= end


def _recent_week_scraped_values(n: int = 3) -> list[str]:
    rows = (
        supabase.table("deals")
        .select("week_scraped")
        .order("week_scraped", desc=True)
        .limit(n * 200)
        .execute()
        .data
    )
    seen: list[str] = []
    for r in rows:
        w = r["week_scraped"]
        if w not in seen:
            seen.append(w)
        if len(seen) == n:
            break
    return seen


@router.get("/")
def get_deals(
    store_id: int = None,
    discount_type_id: int = None,
    limit: int = 2000,
):
    today = date.today()
    recent_weeks = _recent_week_scraped_values(3)

    query = (
        supabase.table("deals")
        .select("*, stores(name, logo_url), discount_types(label)")
        .in_("week_scraped", recent_weeks)
        .limit(limit)
    )
    if store_id:
        query = query.eq("store_id", store_id)
    if discount_type_id:
        query = query.eq("discount_type_id", discount_type_id)

    all_data = query.execute().data
    data = [d for d in all_data if _is_active(d, today)]
    return {"data": data, "total": len(data)}


@router.get("/search")
def search_deals(q: str = Query(..., min_length=2)):
    today = date.today()
    recent_weeks = _recent_week_scraped_values(3)

    all_data = (
        supabase.table("deals")
        .select("*, stores(name, logo_url), discount_types(label)")
        .in_("week_scraped", recent_weeks)
        .ilike("product", f"%{q}%")
        .execute()
        .data
    )
    data = [d for d in all_data if _is_active(d, today)]
    return {"data": data, "total": len(data)}
