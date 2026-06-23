// DB has a typo in the Albert Heijn store row ("Albertijn") — normalize here
// so every consumer (filters, cards, logos) keys off the canonical name.
const ALIASES = { Albertijn: 'Albert Heijn' }

export function normalizeStoreName(name) {
  return ALIASES[name] ?? name
}
