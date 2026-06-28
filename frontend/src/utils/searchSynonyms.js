// Multi-word phrases checked before token splitting
const PHRASES = {
  'ice cream':      ['ijs', 'roomijs', 'ijsje'],
  'whipped cream':  ['slagroom'],
  'sour cream':     ['zure room'],
  'peanut butter':  ['pindakaas'],
  'orange juice':   ['sinaasappelsap', 'jus'],
  'apple juice':    ['appelsap'],
  'ground beef':    ['gehakt'],
  'minced meat':    ['gehakt'],
  'chicken breast': ['kipfilet', 'kippenborst'],
  'chicken thigh':  ['kippendij'],
  'olive oil':      ['olijfolie'],
  'sunflower oil':  ['zonnebloemolie'],
  'toilet paper':   ['wc papier', 'toiletpapier'],
  'paper towel':    ['keukenpapier'],
  'washing powder': ['waspoeder', 'wasmiddel'],
  'dish soap':      ['afwasmiddel'],
  'brown bread':    ['volkoren', 'bruinbrood'],
  'white bread':    ['witbrood'],
  'cream cheese':   ['roomkaas', 'smeerkaas'],
  'cottage cheese': ['hüttenkäse'],
  'greek yogurt':   ['griekse yoghurt'],
  'oat milk':       ['havermelk'],
  'almond milk':    ['amandelmelk'],
  'coconut milk':   ['kokosmelk'],
  'sweet potato':   ['zoete aardappel'],
  'spring onion':   ['bosui', 'lente ui'],
  'bell pepper':    ['paprika'],
  'red wine':       ['rode wijn'],
  'white wine':     ['witte wijn'],
  'sparkling water':['bruisend water', 'spa rood'],
  'mineral water':  ['mineraalwater'],
  'energy drink':   ['energiedrank'],
  'potato chips':   ['chips', 'aardappelchips'],
  'dark chocolate': ['pure chocolade', 'pure chocola'],
  'milk chocolate': ['melkchocolade', 'melkchocola'],
  'ice tea':        ['ijsthee'],
  'iced tea':       ['ijsthee'],
}

const EN_TO_NL = {
  // Dairy
  cheese:      ['kaas'],
  milk:        ['melk'],
  butter:      ['boter'],
  yogurt:      ['yoghurt'],
  yoghurt:     ['yoghurt'],
  cream:       ['room', 'slagroom'],
  quark:       ['kwark'],
  custard:     ['vla'],
  // Meat
  chicken:     ['kip'],
  beef:        ['rund', 'biefstuk', 'gehakt'],
  pork:        ['vark', 'varken', 'ham'],
  ham:         ['ham'],
  sausage:     ['worst'],
  bacon:       ['spek'],
  lamb:        ['lam'],
  turkey:      ['kalkoen'],
  mince:       ['gehakt'],
  meat:        ['vlees'],
  steak:       ['biefstuk'],
  // Fish & seafood
  fish:        ['vis'],
  salmon:      ['zalm'],
  tuna:        ['tonijn'],
  shrimp:      ['garnaal'],
  prawn:       ['garnaal'],
  cod:         ['kabeljauw'],
  herring:     ['haring'],
  // Fruit & veg
  apple:       ['appel'],
  banana:      ['banaan'],
  orange:      ['sinaasappel', 'appelsien'],
  strawberry:  ['aardbei'],
  grape:       ['druif', 'druiven'],
  mango:       ['mango'],
  avocado:     ['avocado'],
  tomato:      ['tomaat', 'tomaten'],
  potato:      ['aardappel'],
  onion:       ['ui'],
  carrot:      ['wortel'],
  lettuce:     ['sla'],
  cucumber:    ['komkommer'],
  broccoli:    ['broccoli'],
  spinach:     ['spinazie'],
  mushroom:    ['champignon', 'paddenstoel'],
  pepper:      ['paprika', 'peper'],
  lemon:       ['citroen'],
  pear:        ['peer'],
  peach:       ['perzik'],
  melon:       ['meloen'],
  garlic:      ['knoflook'],
  vegetable:   ['groente'],
  vegetables:  ['groente'],
  fruit:       ['fruit'],
  // Bread & bakery
  bread:       ['brood'],
  roll:        ['broodje', 'bolletje'],
  cake:        ['taart', 'cake'],
  cookie:      ['koek', 'biscuit'],
  cookies:     ['koek', 'biscuit'],
  pastry:      ['gebak'],
  croissant:   ['croissant'],
  // Staples
  rice:        ['rijst'],
  pasta:       ['pasta'],
  flour:       ['bloem', 'meel'],
  sugar:       ['suiker'],
  salt:        ['zout'],
  oil:         ['olie'],
  egg:         ['ei', 'eieren'],
  eggs:        ['ei', 'eieren'],
  noodles:     ['noodles', 'noedels'],
  cereal:      ['muesli', 'cornflakes', 'granola'],
  oats:        ['havermout'],
  // Drinks
  beer:        ['bier'],
  wine:        ['wijn'],
  juice:       ['sap'],
  coffee:      ['koffie'],
  tea:         ['thee'],
  water:       ['water'],
  soda:        ['frisdrank', 'cola'],
  cola:        ['cola'],
  drink:       ['drank'],
  drinks:      ['dranken'],
  // Frozen & ice cream
  frozen:      ['diepvries'],
  ice:         ['ijs'],
  // Snacks & sweet
  chips:       ['chips'],
  chocolate:   ['chocola', 'chocolade'],
  candy:       ['snoep'],
  nuts:        ['noten', 'nootjes'],
  crisps:      ['chips'],
  popcorn:     ['popcorn'],
  // Condiments & spreads
  sauce:       ['saus'],
  mayo:        ['mayonaise'],
  ketchup:     ['ketchup'],
  mustard:     ['mosterd'],
  jam:         ['jam', 'confituur'],
  honey:       ['honing'],
  peanut:      ['pinda', 'pindakaas'],
  soup:        ['soep'],
  // Household & personal care
  household:   ['huishouden'],
  cleaning:    ['schoonmaak'],
  detergent:   ['wasmiddel', 'afwasmiddel'],
  shampoo:     ['shampoo'],
  soap:        ['zeep'],
  toilet:      ['wc', 'toilet'],
  toothpaste:  ['tandpasta'],
  // General
  organic:     ['bio', 'biologisch'],
  dairy:       ['zuivel'],
  snack:       ['snack'],
  tofu:        ['tofu'],
  vegan:       ['vegan', 'plantaardig'],
  vegetarian:  ['vegetarisch'],
  gluten:      ['gluten'],
  meat:        ['vlees'],
}

export function expandQuery(query) {
  const normalized = query.toLowerCase().trim()
  if (!normalized) return []

  const expanded = new Set()

  // Check full query and all sub-phrases against PHRASES map first
  for (const [phrase, translations] of Object.entries(PHRASES)) {
    if (normalized.includes(phrase)) {
      translations.forEach(t => expanded.add(t))
    }
  }

  // Token-level expansion
  const tokens = normalized.split(/\s+/).filter(Boolean)
  tokens.forEach(token => {
    expanded.add(token)
    const nlTerms = EN_TO_NL[token]
    if (nlTerms) nlTerms.forEach(t => expanded.add(t))
  })

  return [...expanded]
}
