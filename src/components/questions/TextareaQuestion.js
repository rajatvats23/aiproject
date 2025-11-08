'use client'

export default function TextareaQuestion({ value, onChange, placeholder, rows = 4 }) {
  return (
    <div className="mb-8">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-4 text-lg border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
        autoFocus
      />
    </div>
  )
}
