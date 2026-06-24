import os
from abc import ABC, abstractmethod

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait


class BaseScraper(ABC):
    """Shared Selenium scrape lifecycle. Subclass per supermarket:
    set STORE_NAME / BASE_URL / PRODUCT_SELECTOR, implement _extract_product,
    override _load_more / _accept_cookies / _before_extract only if that site needs it.
    Each instance owns its own driver — safe to instantiate multiple scrapers
    (same or different store) independently, e.g. on separate cron schedules.
    """

    STORE_NAME: str
    BASE_URL: str
    PRODUCT_SELECTOR: str

    def __init__(self, headless: bool | None = None):
        if headless is None:
            headless = os.environ.get("HEADLESS", "1") == "1"
        self.headless = headless

    def _build_driver(self) -> webdriver.Chrome:
        options = Options()
        if self.headless:
            options.add_argument("--headless=new")
            options.add_argument("--window-size=1920,1080")
            options.add_argument("--disable-blink-features=AutomationControlled")
            options.add_argument(
                "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            )
            options.add_experimental_option("excludeSwitches", ["enable-automation"])
            options.add_experimental_option("useAutomationExtension", False)

        driver = webdriver.Chrome(options=options)
        if self.headless:
            driver.execute_cdp_cmd(
                "Page.addScriptToEvaluateOnNewDocument",
                {"source": "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"},
            )
        return driver

    def _accept_cookies(self, driver, wait: WebDriverWait) -> None:
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support import expected_conditions as EC

        try:
            cookie_button = wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="accept-cookies"]'))
            )
            cookie_button.click()
            print("Cookies accepted")
        except Exception:
            print("No cookie popup found, continuing...")

    def _load_more(self, driver) -> None:
        """No-op by default. Override for sites that need scroll-to-load (e.g. Jumbo)."""

    def _before_extract(self, driver, wait: WebDriverWait) -> dict:
        """Override to gather page-level context (e.g. a global validity date) before the product loop."""
        return {}

    def _wait_for_products(self, driver, wait: WebDriverWait) -> list:
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support import expected_conditions as EC

        try:
            return wait.until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, self.PRODUCT_SELECTOR))
            )
        except Exception:
            print(f"WARNING: Could not find products for {self.STORE_NAME}")
            return []

    @abstractmethod
    def _extract_product(self, element, context: dict) -> dict | None:
        """Parse one product element into the standard dict shape, or None to skip it."""

    def scrape(self) -> list[dict]:
        driver = self._build_driver()
        try:
            driver.get(self.BASE_URL)
            wait = WebDriverWait(driver, 10)
            self._accept_cookies(driver, wait)
            self._load_more(driver)

            wait_longer = WebDriverWait(driver, 20)
            context = self._before_extract(driver, wait_longer)
            products = self._wait_for_products(driver, wait_longer)

            all_products = []
            for i, element in enumerate(products):
                try:
                    product = self._extract_product(element, context)
                    if product is not None:
                        all_products.append(product)
                except Exception as e:
                    print(f"[{i + 1}] Skipped: {e}")
            return all_products
        finally:
            driver.quit()
