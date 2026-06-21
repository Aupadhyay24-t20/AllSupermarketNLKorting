from selenium import webdriver
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def albertijn_data() -> list[dict]:
    all_products = []
    driver = webdriver.Chrome()
    driver.get("https://www.ah.nl/bonus")
    time.sleep(2)

    wait = WebDriverWait(driver, 10)
    try:
        validity = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="period-toggle-button"] p'))
        )
        date = validity.text
    except:
        date = "Unknown"
        print("WARNING: Could not find date element")
    try:
        cookie_button = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="accept-cookies"]'))
        )
        cookie_button.click()
        print("Cookies accepted")
    except:
        print("No cookie popup found, continuing...")
    wait_longer = WebDriverWait(driver, 20)
    try:
        products = wait_longer.until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, '[data-testid="promotion-card"]'))
        )
    except:
        print("WARNING: Could not find products")
        driver.quit()
        return []
    iteration = 1
    for product in products:
        title = product.find_element(By.CSS_SELECTOR, '[data-testid="card-title"]').text
        discount_label = product.get_attribute("aria-label")
        href = product.get_attribute("href")
        discount_info = [discount_label]

        try:
            img_element = product.find_element(By.CSS_SELECTOR, '[class*="promotion-card-image_img"]')
            image_url = img_element.get_attribute("src")
        except:
            image_url = None

        print(f"[{iteration}]Product: {title}")
        print(f"Deal: {discount_info}")
        print(f"Link: {href}")
        print(f"Image: {image_url}")
        print("---")
        product_date = {
            "product": title,
            "discount": discount_info,
            "link": href,
            "store": "Albertijn",
            "date": date,
            "image_url": image_url
        }
        all_products.append(product_date)
        iteration += 1
    driver.quit()
    return all_products

def jumbo_data() -> list[dict]:
    all_jproducts = []
    jdriver = webdriver.Chrome()
    jdriver.get("https://www.jumbo.com/aanbiedingen/nu")
    time.sleep(3)
    last_count = 0
    while True:
        jdriver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
        current_count = len(jdriver.find_elements(By.CSS_SELECTOR, '[data-testid="promotion-card"]'))
        print(f"Products found so far: {current_count}")
        if current_count == last_count:
            break
        last_count = current_count

    j_products = jdriver.find_elements(By.CSS_SELECTOR, '[data-testid="promotion-card"]')
    print(f"Total: {len(j_products)}")

    for i, j_product in enumerate(j_products):
        try:
            jdriver.execute_script("arguments[0].scrollIntoView({block: 'center'});", j_product)
            time.sleep(0.5)
            content = j_product.find_element(By.CSS_SELECTOR, '.content')
            validity = content.find_element(By.CSS_SELECTOR, '.subtitle')
            date = validity.text
            main_title = content.find_element(By.CSS_SELECTOR, '[data-testid="jum-heading"]')
            a_tag = main_title.find_element(By.CSS_SELECTOR, "a.title-link")
            title = a_tag.get_attribute("data-dd-action-name")
            href = a_tag.get_attribute("href")
            discount_info = "No discount"
            image_container = j_product.find_element(By.CSS_SELECTOR, '.image-container')
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
                img_element = j_product.find_element(By.CSS_SELECTOR, '[data-testid="jum-card-image"] img')
                image_url = img_element.get_attribute("src")
            except:
                image_url = None

            print(f"[{i + 1}] Product: {title}")
            print(f"     Discount: {discount_info}")
            print(f"     Link: {href}")
            print(f"     Date: {date}")
            print(f"     Image: {image_url}")
            product_date = {
                "product": title,
                "discount": discount_info,
                "link": href,
                "store": "Jumbo",
                "date": date,
                "image_url": image_url
            }
            all_jproducts.append(product_date)
        except Exception as e:
            print(f"[{i + 1}] Skipped: {e}")
    jdriver.quit()
    return all_jproducts