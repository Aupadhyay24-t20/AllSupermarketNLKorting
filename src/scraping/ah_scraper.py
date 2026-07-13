import time

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

from src.scraping.base_scraper import BaseScraper
from src.scraping.category_mapping import AH_CATEGORY_MAP

_JS_EXTRACT_PRODUCT = """
return [...document.querySelectorAll('[data-testid="product-card-vertical-container"]')].map(card => {
    const lane = card.closest('[class*="area-lane_root"]');
    return {
        title:     card.querySelector('[data-testid="product-card-text-container"] p')?.innerText || null,
        ariaLabel: card.querySelector('[data-testid="product-card-promotion-label"]')?.innerText || '',
        href:      card.querySelector('a[href]')?.href || null,
        imgSrc:    card.querySelector('img[src]')?.src || null,
        laneId:    lane?.id || null,
        newFormat: true,
    };
});
"""


class AHScraper(BaseScraper):
    STORE_NAME = "Albertijn"
    BASE_URL = "https://www.ah.nl/bonus"
    PRODUCT_SELECTOR = '[data-testid="promotion-card"]'

    def scrape(self) -> list[dict]:
        driver = self._build_driver()
        try:
            driver.get(self.BASE_URL)

            # Do NOT click the cookie consent button before extracting. Clicking it triggers
            # React's consent handler which fast-rerenders promotion-cards (~275 items) into
            # the 56-card featured layout before we can capture them. Without clicking,
            # promotion-cards appear at ~11s and remain stable.
            # Wait up to 25s for promotion-cards to appear, polling every 200ms.
            driver.set_script_timeout(30)
            raw = driver.execute_async_script("""
                const done = arguments[0];
                const giveUp = setTimeout(() => done([]), 25000);
                (function poll() {
                    const cards = [...document.querySelectorAll('[data-testid="promotion-card"]')];
                    if (cards.length > 0) {
                        clearTimeout(giveUp);
                        done(cards.map(card => {
                            const lane = card.closest('[class*="area-lane_root"]');
                            return {
                                title:     card.querySelector('[data-testid="card-title"]')?.innerText || null,
                                ariaLabel: card.getAttribute('aria-label') || '',
                                href:      card.getAttribute('href') || null,
                                imgSrc:    card.querySelector('[class*="promotion-card-image_img"]')?.getAttribute('src') || null,
                                laneId:    lane?.id || null,
                            };
                        }));
                    } else {
                        setTimeout(poll, 200);
                    }
                })();
            """)

            print(f"AH: {len(raw)} promotion-cards found")

            if not raw:
                # Fallback: promotion-cards never appeared. Accept cookies and wait for
                # product-card-vertical-container (56 featured items).
                print("AH: falling back to React product cards")
                wait = WebDriverWait(driver, 10)
                self._accept_cookies(driver, wait)
                last = -1
                while True:
                    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                    time.sleep(2)
                    count = len(driver.find_elements(
                        By.CSS_SELECTOR, '[data-testid="product-card-vertical-container"]'
                    ))
                    print(f"AH product cards: {count}")
                    if count == last:
                        break
                    last = count
                raw = driver.execute_script(_JS_EXTRACT_PRODUCT)
                print(f"AH: {len(raw)} product-card-vertical-containers found")

            # date is server-rendered and available immediately
            date = "Unknown"
            try:
                date = driver.find_element(
                    By.CSS_SELECTOR, '[data-testid="period-toggle-button"] p'
                ).text
            except Exception:
                print("WARNING: Could not find date element")

            products = []
            for item in raw:
                title = item.get('title')
                if not title:
                    continue

                raw_lane = item.get('laneId')
                category = AH_CATEGORY_MAP.get(raw_lane) if raw_lane else None

                aria = item.get('ariaLabel', '')
                if item.get('newFormat'):
                    discount = aria
                else:
                    # promotion-card aria: "Klikbaar: PRODUCT_NAME DEAL_TEXT"
                    discount = aria.split(':', 1)[1].strip() if ':' in aria else aria

                href = item.get('href') or ''
                if href.startswith('/'):
                    href = 'https://www.ah.nl' + href

                print(f"Product: {title} | Category: {category} (raw: {raw_lane})")
                products.append({
                    'product':   title,
                    'discount':  [discount] if discount else [],
                    'link':      href,
                    'store':     self.STORE_NAME,
                    'date':      date,
                    'image_url': item.get('imgSrc'),
                    'category':  category,
                })

            return products
        finally:
            driver.quit()

    def _extract_product(self, element, context: dict) -> dict | None:
        # Not used — AHScraper overrides scrape() with JS batch extraction
        return None
