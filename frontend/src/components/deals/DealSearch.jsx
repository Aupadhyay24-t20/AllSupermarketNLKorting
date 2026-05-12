export default function DealSearch({ value, onChange }) {
  return (
    <div className="relative w-full">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder="Zoek een product..."
        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#374151] bg-[#1F2937] text-sm text-[#F9FAFB] placeholder-[#6B7280] outline-none transition-shadow focus:border-[#00833E] focus:ring-2 focus:ring-[#00833E]/20"
      />
    </div>
  )
}
