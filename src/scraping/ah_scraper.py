import time

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

from src.scraping.base_scraper import BaseScraper
from src.scraping.category_mapping import AH_CATEGORY_MAP


class AHScraper(BaseScraper):
    STORE_NAME = "Albertijn"
    BASE_URL = "https://www.ah.nl/bonus"
    # AH serves different card types: new UI → product-card-vertical-container,
    # old UI (headless/fresh sessions) → promotion-card. Support both.
    PRODUCT_SELECTOR = '[data-testid="product-card-vertical-container"], [data-testid="promotion-card"]'

    def _load_more(self, driver) -> None:
        time.sleep(5)
        last_count = -1
        while True:
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
            current_count = len(driver.find_elements(By.CSS_SELECTOR, self.PRODUCT_SELECTOR))
            print(f"AH products found so far: {current_count}")
            if current_count == last_count:
                break
            last_count = current_count

    def _before_extract(self, driver, wait) -> dict:
        try:
            validity = wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="period-toggle-button"] p'))
            )
            date = validity.text
        except Exception:
            date = "Unknown"
            print("WARNING: Could not find date element")
        return {"date": date}

    def _extract_product(self, element, context: dict) -> dict | None:
        card_type = element.get_attribute("data-testid")

        raw_category = None
        category = None
        try:
            lane = element.find_element(By.XPATH, "ancestor::div[contains(@class, 'area-lane_root')]")
            raw_category = lane.get_attribute("id")
            category = AH_CATEGORY_MAP.get(raw_category)
        except Exception:
            pass

        if card_type == "promotion-card":
            try:
                title = element.find_element(By.CSS_SELECTOR, '[data-testid="card-title"]').text
            except Exception:
                title = None

            aria = element.get_attribute("aria-label") or ""
            discount = aria

            href = element.get_attribute("href") or ""
            if href.startswith("/"):
                href = "https://www.ah.nl" + href

            try:
                image_url = element.find_element(
                    By.CSS_SELECTOR, '[class*="promotion-card-image_img"]'
                ).get_attribute("src")
            except Exception:
                image_url = None

        else:
            try:
                title = element.find_element(
                    By.CSS_SELECTOR, '[data-testid="product-card-text-container"] p:first-child'
                ).text
            except Exception:
                title = None

            try:
                discount = element.find_element(
                    By.CSS_SELECTOR, '[data-testid="product-card-promotion-label"]'
                ).text
            except Exception:
                discount = None

            try:
                href = element.find_element(By.CSS_SELECTOR, "a[href]").get_attribute("href")
            except Exception:
                href = None

            try:
                image_url = element.find_element(By.CSS_SELECTOR, "img[src]").get_attribute("src")
            except Exception:
                image_url = None

        print(f"Product: {title} | Category: {category} (raw: {raw_category}) | card: {card_type}")
        print(f"Deal: {discount}")
        print("---")

        return {
            "product": title,
            "discount": [discount] if discount else [],
            "link": href,
            "store": self.STORE_NAME,
            "date": context["date"],
            "image_url": image_url,
            "category": category,
        }
