# SuperDeal NL 🛒

> Track, compare, and search supermarket deals across the Netherlands powered by automated weekly data collection and machine learning.

SuperDeal NL aggregates weekly in-store discount deals from Albert Heijn and Jumbo, stores them in a structured database, and surfaces them through a clean, searchable interface. The core value proposition is cross-store product search and comparison, something neither supermarket's own app provides.

---

## Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Scrapers, automated ETL pipeline, anomaly detection, database | Complete |
| Phase 2 | Frontend (React), REST API, DigitalOcean deployment | Complete |
| Phase 3 | ML-powered product category classification | In Progress |
| Phase 4 | Cross-store product matching, user accounts, personalised alerts | Planned |

---

## Tech Stack

### Data Collection & Pipeline
- **Python** — core language across the entire stack
- **Selenium** — browser automation for scraping JavaScript-rendered supermarket pages
- **Pandas** — data cleaning, transformation, and normalisation
- **GitHub Actions** — scheduled weekly scraping (AH on Mondays, Jumbo on Wednesdays), anomaly detection, and human approval workflow before database insertion

### Backend
- **FastAPI** — REST API serving deal data to the frontend
- **PostgreSQL / Supabase** — relational database storing deals with full weekly history
- **Uvicorn** — ASGI server

### Frontend
- **React 19 + Vite** — component-based UI with fast build tooling
- **Tailwind CSS** — utility-first styling
- **React Router** — client-side routing
- **i18next** — static UI translations (NL/EN)

### Machine Learning
- **scikit-learn** — TF-IDF vectorisation and Logistic Regression classifier

---


## How It Works

**1. Scraping**
Selenium scrapers run automatically via GitHub Actions on a weekly schedule, AH every Monday, Jumbo every Wednesday. Each run captures in-store deals including product names, discount types, validity dates, and product images. Online-only deals are intentionally excluded.

**2. Cleaning Pipeline**
Raw scraped data passes through a Pandas-based cleaning pipeline handling Dutch date parsing, discount type standardisation, and deduplication.

**3. Anomaly Detection & Approval**
Before any data reaches the database, the pipeline runs anomaly checks on deal counts, discount magnitudes, and structural integrity. If anomalies are detected, the pipeline halts with a hold signal (exit code 42), uploads the flagged data as a GitHub Actions artifact, and sends an email alert. A separate manual approval workflow (`approve_load.py`) loads the held data after human review.

**4. Database**
Cleaned deals are stored in PostgreSQL (Supabase) with a normalised schema. Every deal is timestamped with its validity window, enabling historical tracking per product over time.

**5. API**
A FastAPI backend exposes deal data through a REST API with endpoints filtering by store, discount type, category, and date range.

**6. Frontend**
A React + Vite frontend consumes the API, displaying deal cards with product images, discount details, and store information in a searchable, cross-store interface.

---

## Dataset

- **Supermarkets covered:** Albert Heijn, Jumbo
- **Deal types tracked:** Percentage discounts, 2nd product free, combination discounts, fixed price deals
- **Data scope:** In-store deals only, updated weekly
- **History:** Multiple weeks of AH and Jumbo data and growing

---

## Machine Learning (Phase 3)

Neither Albert Heijn nor Jumbo supply structured category data with their promotions. Product names arrive as raw Dutch strings like "Verse aardappelen", "Alle Lenor wasverzachter", "Combikorting groente" with no taxonomy attached.

The ML layer addresses this with a **supervised text classification pipeline**:

**Category Classifier**
A Logistic Regression model trained on TF-IDF vectors of Dutch product name strings, mapping each deal to a fixed product category taxonomy. Logistic Regression was chosen over alternatives (KNN, neural approaches) because it performs well on high-dimensional sparse text vectors, is interpretable, and establishes a solid baseline before adding complexity.

**Training Data**
Manual labelling of a representative subset of scraped product names, with deliberate strategy around class imbalance across the taxonomy.