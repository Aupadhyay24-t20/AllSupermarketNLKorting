import time

from selenium.webdriver.common.by import By

from src.scraping.base_scraper import BaseScraper
from src.scraping.category_mapping import JUMBO_CATEGORY_MAP


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

    def _extract_product(self, element, context: dict) -> dict | None:
        driver = element.parent
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
        time.sleep(0.5)

        try:
            section = element.find_element(
                By.XPATH, "ancestor::section[contains(@class, 'category-section')]"
            )
            raw_category = section.find_element(By.CSS_SELECTOR, '[data-testid="category-title"]').text
            category = JUMBO_CATEGORY_MAP.get(raw_category)
        except Exception:
            category = None

        content = element.find_element(By.CSS_SELECTOR, '.content')
        validity = content.find_element(By.CSS_SELECTOR, '.subtitle')
        date = validity.text
        main_title = content.find_element(By.CSS_SELECTOR, '[data-testid="jum-heading"]')
        a_tag = main_title.find_element(By.CSS_SELECTOR, "a.title-link")
        title = a_tag.get_attribute("data-dd-action-name")
        href = a_tag.get_attribute("href")

        discount_info = "No discount"
        image_container = element.find_element(By.CSS_SELECTOR, '.image-container')
        jum_tags = image_container.find_elements(By.CSS_SELECTOR, '[data-testid="jum-tag"]')
        if jum_tags:
            tag = jum_tags[0]
            lower_els = tag.find_elements(By.CSS_SELECTOR, '.lower')
            upper_els = tag.find_elements(By.CSS_SELECTOR, '.upper')
            if lower_els or upper_els:
                lower = lower_els[0].text.strip() if lower_els else ""
                upper = upper_els[0].text.strip() if upper_els else ""
                discount_info = f"{upper} {lower}".strip()
            else:
                discount_info = tag.text.strip()

        try:
            img_element = element.find_element(By.CSS_SELECTOR, '[data-testid="jum-card-image"] img')
            image_url = img_element.get_attribute("src")
        except Exception:
            image_url = None

        print(f"Product: {title}")
        print(f"     Discount: {discount_info}")
        print(f"     Link: {href}")
        print(f"     Date: {date}")
        print(f"     Image: {image_url}")

        return {
            "product": title,
            "discount": discount_info,
            "link": href,
            "store": self.STORE_NAME,
            "date": date,
            "image_url": image_url,
            "category": category,
        }
