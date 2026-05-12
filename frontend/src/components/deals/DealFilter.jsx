function FilterRow({ options, selected, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {['Alle', ...options].map((option) => {
        const isSelected = option === 'Alle' ? !selected : selected === option
        return (
          <button
            key={option}
            onClick={() => onChange(option === 'Alle' ? null : option)}
            className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors"
            style={
              isSelected
                ? { backgroundColor: '#00833E', borderColor: '#00833E', color: '#fff' }
                : { backgroundColor: '#374151', borderColor: '#4B5563', color: '#9CA3AF' }
            }
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

export default function DealFilter({
  stores,
  selectedStore,
  onStoreChange,
  discountTypes,
  selectedDiscountType,
  onDiscountTypeChange,
}) {
  return (
    <div className="flex flex-col gap-3">
      <FilterRow options={stores} selected={selectedStore} onChange={onStoreChange} />
      <FilterRow options={discountTypes} selected={selectedDiscountType} onChange={onDiscountTypeChange} />
    </div>
  )
}
