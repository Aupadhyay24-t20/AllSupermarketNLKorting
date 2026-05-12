import DealCard from './DealCard'

export default function DealGrid({ deals }) {
  if (!deals?.length) {
    return (
      <p className="text-center text-[#6B7280] py-16">Geen aanbiedingen gevonden</p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {deals.map((deal, i) => (
        <DealCard
          key={deal.id ?? i}
          product={deal.product}
          discountRaw={deal.discount_raw ?? deal.discountRaw}
          discountType={deal.discount_types?.label ?? deal.discount}
          store={deal.stores?.name ?? deal.store}
          startDate={deal.start_date}
          endDate={deal.end_date}
          link={deal.link}
        />
      ))}
    </div>
  )
}