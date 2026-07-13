import { useTranslation } from 'react-i18next'

export const CAT_DEFS = [
  { value: 'all',                  key: 'all' },
  { value: 'Vegetables & Fruits',  key: 'vegetables_fruits' },
  { value: 'Meat & Fish',          key: 'meat_fish' },
  { value: 'Dairy & Eggs',         key: 'dairy_eggs' },
  { value: 'Cheese',               key: 'cheese' },
  { value: 'Bakery',               key: 'bakery' },
  { value: 'Ready Meals & Salads', key: 'ready_meals' },
  { value: 'Snacks & Chocolates',  key: 'snacks' },
  { value: 'Pantry & World Foods', key: 'pantry' },
  { value: 'Frozen',               key: 'frozen' },
  { value: 'Coffee & Tea',         key: 'coffee_tea' },
  { value: 'Soft Drinks',          key: 'soft_drinks' },
  { value: 'Beer & Wine',          key: 'beer_wine' },
  { value: 'Drugstore & Health',   key: 'drugstore' },
  { value: 'Household',            key: 'household' },
  { value: 'Animals',              key: 'animals' },
  { value: 'Home & Kitchenware',   key: 'home_kitchenware' },
  { value: 'Home Goods & Seasonal',key: 'home_goods' },
  { value: 'Other',                key: 'other' },
]

export const CAT_KEY_MAP = Object.fromEntries(CAT_DEFS.map(d => [d.value, d.key]))

export function CategoryStrip({ active, onChange }) {
  const { t } = useTranslation()

  return (
    <div
      style={{
        background: 'var(--c-bg)',
        borderBottom: '1px solid var(--c-border)',
        position: 'sticky',
        top: 'var(--header-height)',
        zIndex: 99,
      }}
    >
      <div
        className="cat-strip-scroll"
        style={{
          maxWidth: 'var(--layout-max)',
          margin: '0 auto',
          padding: '10px var(--layout-pad)',
        }}
      >
        <div className="cat-strip-pills">
          {CAT_DEFS.map(def => {
            const isActive = def.value === active
            return (
              <button
                key={def.value}
                type="button"
                onClick={() => onChange(def.value)}
                style={{
                  padding: '7px 17px',
                  borderRadius: 'var(--r-pill)',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 600 : 500,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all var(--dur-base) var(--ease-out)',
                  color: isActive ? '#fff' : 'var(--c-text-muted)',
                  background: isActive ? 'var(--c-brand)' : 'var(--c-surface)',
                  border: `1.5px solid ${isActive ? 'var(--c-brand)' : 'var(--c-border-strong)'}`,
                  boxShadow: isActive ? '0 2px 8px rgba(30,107,60,0.22)' : 'none',
                }}
              >
                {t(`cats.${def.key}`)}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
