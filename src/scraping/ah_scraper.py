from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

from src.scraping.base_scraper import BaseScraper


class AHScraper(BaseScraper):
    STORE_NAME = "Albertijn"
    BASE_URL = "https://www.ah.nl/bonus"
    PRODUCT_SELECTOR = '[data-testid="promotion-card"]'

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
        title = element.find_element(By.CSS_SELECTOR, '[data-testid="card-title"]').text
        discount_label = element.get_attribute("aria-label")
        href = element.get_attribute("href")
        discount_info = [discount_label]

        try:
            img_element = element.find_element(By.CSS_SELECTOR, '[class*="promotion-card-image_img"]')
            image_url = img_element.get_attribute("src")
        except Exception:
            image_url = None

        print(f"Product: {title}")
        print(f"Deal: {discount_info}")
        print(f"Link: {href}")
        print(f"Image: {image_url}")
        print("---")

        return {
            "product": title,
            "discount": discount_info,
            "link": href,
            "store": self.STORE_NAME,
            "date": context["date"],
            "image_url": image_url,
        }
