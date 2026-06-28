const GA_ID = import.meta.env.VITE_GA_ID

export function initGA() {
  if (!GA_ID) return
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
  window.dataLayer = window.dataLayer || []
  window.gtag = function () { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { anonymize_ip: true })
}

export function trackPageView(path) {
  window.gtag?.('event', 'page_view', { page_path: path })
}

export function trackSearch(query) {
  window.gtag?.('event', 'search', { search_term: query })
}

export function trackDealClick(product, store) {
  window.gtag?.('event', 'select_item', { item_name: product, item_brand: store })
}
