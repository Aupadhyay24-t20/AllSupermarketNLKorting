import { normalizeStoreName } from '../../utils/storeName'

// Parses the real /deals API's discount_raw string into the badge/price
// shape the Fresco DealCard renders. Ported from the Fresco prototype's
// parseDiscount(); the "N voor X" pattern there was missing its /i flag,
// which would silently never match the real API's uppercase strings
// ("2 VOOR 4.49") — fixed here, everything else ported verbatim.
const CORNER_GRADIENT = 'linear-gradient(135deg,#f97316,#dc2626)'

// "*M.u.v. ..." exclusion notes can sit before OR after the real discount
// text ("*M.u.v. partypacks 1+1 gratis" vs "2 voor 4.49 *M.u.v. wijnen boven
// 6 euro"). Stop stripping as soon as a recognizable discount phrase starts,
// instead of eating to end-of-string — that previously swallowed the real
// discount whenever the note led.
const MUV_STOP_AHEAD = /\*M\.u\.v\.[\s\S]*?(?=\d+\+\d+\s*gratis\b|2e halve prijs\b|\d+\s*stuks\s*\d+%|\d+%|\d+\s+voor\s+[\d.,]+|(?:Bonus\s+)?voor\s+[\d.,]+|€?\d[\d.,]*\s?korting\b|$)/gi

const DUTCH_MONTHS = { jan: 0, feb: 1, mrt: 2, apr: 3, mei: 4, jun: 5, jul: 6, aug: 7, sep: 8, okt: 9, nov: 10, dec: 11 }

// AH sometimes embeds a delayed activation in the free-text discount field
// itself ("1+1 gratis vanaf 25 jun ...") — there's no structured start date
// for it, the whole week-long listing's start_date stays the same. Parse it
// out so we don't advertise a discount as live before it actually kicks in.
function parseVanafDate(raw) {
  const m = raw.match(/vanaf\s+(\d{1,2})\s+(jan|feb|mrt|apr|mei|jun|jul|aug|sep|okt|nov|dec)\b/i)
  if (!m) return null
  const month = DUTCH_MONTHS[m[2].toLowerCase()]
  const day = parseInt(m[1], 10)
  const now = new Date()
  let date = new Date(now.getFullYear(), month, day)
  if (now - date > 30 * 24 * 60 * 60 * 1000) date = new Date(now.getFullYear() + 1, month, day)
  return { date, label: `${day} ${m[2].toLowerCase()}` }
}

function parseDiscount(discount_raw) {
  const rawFull = discount_raw || ''
  const vanaf = parseVanafDate(rawFull)
  if (vanaf && vanaf.date > new Date()) {
    const promoLabel = rawFull.split(/\s*vanaf\s+\d/i)[0].trim()
    return {
      corner: ['Vanaf', vanaf.label], cornerBg: 'linear-gradient(135deg,#38bdf8,#2563eb)',
      other: promoLabel || 'Binnenkort',
    }
  }

  const raw = rawFull
    .replace(MUV_STOP_AHEAD, '')
    .replace(/^(Los |uitgelicht |Diepvries |Vers uit onze oven )/i, '')
    .trim()

  let m = raw.match(/^(\d+)\+(\d+) gratis/i)
  if (m) {
    return {
      corner: [m[1] + '+' + m[2], 'gratis'], cornerBg: CORNER_GRADIENT,
      bottom: 'Extra artikel gratis', botBg: '#dcfce7', botClr: '#15803d',
    }
  }
  if (/2e halve prijs/i.test(raw)) {
    return {
      corner: ['½', '2e prijs'], cornerBg: CORNER_GRADIENT,
      bottom: '50% op 2e artikel', botBg: '#ede9fe', botClr: '#5b21b6',
    }
  }
  m = raw.match(/^(\d+) stuks (\d+)%/i)
  if (m) {
    return {
      corner: [m[2] + '%', 'korting'], cornerBg: CORNER_GRADIENT,
      bottom: m[2] + '% korting', botBg: '#fef0e6', botClr: '#c2400c',
    }
  }
  m = raw.match(/^(\d+)%/)
  if (m) {
    return {
      corner: [m[1] + '%', 'korting'], cornerBg: CORNER_GRADIENT,
      bottom: m[1] + '% korting', botBg: '#fef0e6', botClr: '#c2400c',
    }
  }
  m = raw.match(/^(\d+) voor ([\d.,]+)/i)
  if (m) {
    return {
      corner: [m[1] + ' voor', '€' + m[2].replace('.', ',')],
      cornerBg: 'linear-gradient(135deg,#f97316,#dc2626)', cornerPriceSub: true,
      multi: m[1] + ' voor €' + m[2].replace('.', ','),
    }
  }
  m = raw.match(/^(?:Bonus\s+)?voor ([\d.,]+)/i)
  if (m) {
    return { price: '€' + m[1].replace('.', ','), bottom: 'Aanbiedingsprijs', botBg: '#fef3c7', botClr: '#92400e' }
  }
  m = raw.match(/^€(\d[\d.,]*)\s?korting/i) || raw.match(/^(\d[\d,]+) korting$/i)
  if (m) {
    return {
      corner: ['€' + m[1], 'korting'], cornerBg: CORNER_GRADIENT,
      bottom: '€' + m[1] + ' korting', botBg: '#fef0e6', botClr: '#c2400c',
    }
  }
  if (/per \d+ gram|per kilo/i.test(raw)) {
    return { bottom: raw, botBg: '#fef0e6', botClr: '#c2400c' }
  }
  return { other: raw }
}

function formatEndDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  if (isNaN(d.getTime())) return dateStr
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short' }).format(d)
}

export function mapDealToCardProps(deal) {
  return {
    product: deal.product,
    imageUrl: deal.image_url,
    store: normalizeStoreName(deal.stores?.name),
    endDate: formatEndDate(deal.end_date),
    link: deal.link,
    discount: parseDiscount(deal.discount_raw),
  }
}
