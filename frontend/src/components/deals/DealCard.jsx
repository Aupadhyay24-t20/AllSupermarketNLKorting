export default function DealCard({ product, discountRaw, discountType, store, startDate, endDate, link }) {
  return (
    <div className="bg-[#1F2937] rounded-2xl border border-[#374151] p-4 flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-[#F9FAFB] leading-snug">
        {product}
      </h3>

      <div className="flex flex-col gap-1">
        {discountRaw && (
          <span
            className="text-2xl font-extrabold leading-none tracking-tight"
            style={{ color: '#FF6B00' }}
          >
            {discountRaw}
          </span>
        )}
        {discountType && (
          <span
            className="self-start text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ color: '#FF6B00', backgroundColor: '#FF6B0026' }}
          >
            {discountType}
          </span>
        )}
      </div>

      <span
        className="self-start text-xs font-medium px-2 py-0.5 rounded-full"
        style={{ color: '#00833E', backgroundColor: '#00833E26' }}
      >
        {store}
      </span>

      {(startDate || endDate) && (
        <p className="text-xs text-[#6B7280]">
          {startDate && endDate
            ? `${startDate} – ${endDate}`
            : startDate ?? endDate}
        </p>
      )}

      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto text-center text-xs font-semibold text-white py-2 rounded-xl transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#00833E' }}
        >
          Bekijk aanbieding
        </a>
      )}
    </div>
  )
}
