import time

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

from src.scraping.base_scraper import BaseScraper
from src.scraping.category_mapping import JUMBO_CATEGORY_MAP

_JS_EXTRACT = """
const results = [];
for (const section of document.querySelectorAll('section.category-section')) {
    const category = section.querySelector('[data-testid="category-title"]')?.textContent?.trim() || null;
    for (const card of section.querySelectorAll('[data-testid="promotion-card"]')) {
        const a = card.querySelector('a.title-link');
        const img = card.querySelector('[data-testid="jum-card-image"] img');
        const validity = card.querySelector('.content .subtitle');
        const tagEl = card.querySelector('.image-container [data-testid="jum-tag"]');
        let discount = 'No discount';
        if (tagEl) {
            const lower = tagEl.querySelector('.lower')?.textContent?.trim() || '';
            const upper = tagEl.querySelector('.upper')?.textContent?.trim() || '';
            discount = (upper + ' ' + lower).trim() || tagEl.textContent?.trim() || 'No discount';
        }
        results.push({
            title:     a?.getAttribute('data-dd-action-name') || null,
            href:      a?.href || null,
            date:      validity?.textContent?.trim() || null,
            image_url: img?.src || null,
            discount:  discount,
            category:  category,
        });
    }
}
// Orphan cards outside category sections — captured with null category
for (const card of document.querySelectorAll('[data-testid="promotion-card"]')) {
    if (!card.closest('section.category-section')) {
        const a = card.querySelector('a.title-link');
        const img = card.querySelector('[data-testid="jum-card-image"] img');
        const validity = card.querySelector('.content .subtitle');
        const tagEl = card.querySelector('.image-container [data-testid="jum-tag"]');
        let discount = 'No discount';
        if (tagEl) {
            const lower = tagEl.querySelector('.lower')?.textContent?.trim() || '';
            const upper = tagEl.querySelector('.upper')?.textContent?.trim() || '';
            discount = (upper + ' ' + lower).trim() || tagEl.textContent?.trim() || 'No discount';
        }
        results.push({
            title:     a?.getAttribute('data-dd-action-name') || null,
            href:      a?.href || null,
            date:      validity?.textContent?.trim() || null,
            image_url: img?.src || null,
            discount:  discount,
            category:  null,
        });
    }
}
return results;
"""


class JumboScraper(BaseScraper):
    STORE_NAME = "Jumbo"
    BASE_URL = "https://www.jumbo.com/aanbiedingen/nu"
    PRODUCT_SELECTOR = '[data-testid="promotion-card"]'

    def _load_more(self, driver) -> None:
        time.sleep(3)
        last_count = 0
        while True:
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
            current_count = len(driver.find_elements(By.CSS_SELECTOR, self.PRODUCT_SELECTOR))
            print(f"Products found so far: {current_count}")
            if current_count == last_count:
                break
            last_count = current_count

    def scrape(self) -> list[dict]:
        driver = self._build_driver()
        try:
            driver.get(self.BASE_URL)
            wait = WebDriverWait(driver, 10)
            self._accept_cookies(driver, wait)
            self._load_more(driver)

            raw = driver.execute_script(_JS_EXTRACT)
            print(f"Jumbo: {len(raw)} promotion-cards found")

            products = []
            for item in raw:
                if not item.get('title'):
                    continue
                raw_category = item.get('category')
                category = JUMBO_CATEGORY_MAP.get(raw_category) if raw_category else None
                print(f"Product: {item['title']} | {item.get('discount')} | Category: {category} (raw: {raw_category})")
                products.append({
                    'product':   item['title'],
                    'discount':  item.get('discount', 'No discount'),
                    'link':      item.get('href'),
                    'store':     self.STORE_NAME,
                    'date':      item.get('date'),
                    'image_url': item.get('image_url'),
                    'category':  category,
                })
            return products
        finally:
            driver.quit()

    def _extract_product(self, element, context: dict) -> dict | None:
        # Not used — JumboScraper overrides scrape() with JS batch extraction
        return None
