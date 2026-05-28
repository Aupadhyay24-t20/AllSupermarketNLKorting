# SuperDeal NL 🛒

> Track, compare, and understand supermarket deals across the Netherlands — powered by automated data collection and machine learning.

SuperDeal NL aggregates weekly in-store discount deals from major Dutch supermarkets (Albert Heijn and Jumbo), stores them in a structured database, and surfaces them through a clean, searchable interface. The project is evolving from a deal aggregator into an intelligent deal intelligence platform — scoring discounts based on historical patterns and predicting when products are likely to go on sale.

---

## 🚀 Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Automated scraping, data cleaning pipeline, and database | ✅ Complete |
| Phase 2 | Frontend design, UI/UX, and public-facing product | 🔄 In Progress |
| Phase 3 | ML-powered deal scoring and discount prediction | 📋 Planned |
| Phase 4 | User accounts, personalised alerts, and recommendations | 📋 Planned |

---

## 🛠️ Tech Stack

### Data Collection & Processing
- **Python**: core language across the entire stack
- **Selenium**: browser automation for scraping JavaScript-rendered supermarket pages
- **Pandas**: data cleaning, transformation, and exploratory analysis
- **Jupyter Notebooks**: cleaning pipeline and data analysis workflows

### Backend
- **FastAPI**: REST API serving deal data to the frontend
- **PostgreSQL / Supabase**: structured relational database storing deals, stores, and discount types
- **Claude code**: AI-assisted data enrichment and discount categorisation
- **Gemini**: supporting ML feature development and data analysis

### Frontend
- **React**: component-based UI
- **Tailwind CSS**: utility-first styling for a clean, responsive interface

---

## ⚙️ How It Works

```
Scraper → Cleaning Pipeline → Database → API → Frontend
```

**1. Scraping**
Selenium scrapers run weekly against Albert Heijn and Jumbo's promotions pages, capturing in-store deals including product names, discount types, validity dates, and product images. Online-only deals are intentionally excluded to keep the data relevant for in-store shoppers.

**2. Cleaning Pipeline**
Raw scraped data passes through a Pandas-based cleaning pipeline in Jupyter notebooks. This handles Dutch date parsing (e.g. "ma t/m zo"), discount type standardisation (percentage discounts, 2-for-1 deals, combination discounts), and deduplication before database insertion.

**3. Database**
Cleaned deals are stored in a PostgreSQL database (hosted on Supabase) with a normalised schema separating deals, stores, and discount types. Every deal is timestamped with its validity window, enabling historical tracking per product over time.

**4. API**
A FastAPI backend exposes deal data through a REST API, with endpoints filtering by store, discount type, category, and date range.

**5. Frontend**
A React and Tailwind CSS frontend consumes the API, displaying deal cards with product images, discount details, and store information in a clean, searchable interface.

---

## 📊 Dataset

- **Supermarkets covered:** Albert Heijn, Jumbo
- **Deal types tracked:** Percentage discounts, 2nd product free, combination discounts, fixed price deals
- **Data scope:** In-store deals only, updated weekly
- **History:** 6+ weeks of AH data, 4+ weeks of Jumbo data and growing

---

## 🤖 Machine Learning (Phase 2)

The ML layer is being designed around three core features:

**Deal Scoring**
Score each deal against that product's historical discount baseline — surfacing whether a current discount is better, worse, or average compared to previous appearances.

**Discount Categorisation**
A text classification model trained on discount strings to automatically categorise deal types — handling the wide variety of Dutch promotional formats consistently.

**Discount Frequency Analysis**
Identifying products on regular discount cycles to predict when a product is likely to go on sale next — giving users a reason to return beyond just browsing current deals.

---

## 📌 Background

This project started as a practical attempt to solve a real problem — keeping track of supermarket deals across multiple stores is time-consuming and fragmented. It has since evolved into a deeper exploration of data engineering, machine learning pipeline design, and product development.

Built independently as a first startup attempt and data science learning project during the second year of a Computer Science degree.
