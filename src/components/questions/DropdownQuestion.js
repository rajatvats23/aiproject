'use client'

export default function DropdownQuestion({ value, onChange, options, placeholder }) {
  return (
    <div className="mb-8 relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-4 pr-12 text-lg border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white appearance-none cursor-pointer"
        autoFocus
      >
        <option value="" disabled>
          {placeholder || 'Select an option'}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  )
}
