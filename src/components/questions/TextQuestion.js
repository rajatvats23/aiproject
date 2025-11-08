'use client'

export default function TextQuestion({ value, onChange, placeholder, onEnter }) {
  return (
    <div className="mb-8">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-4 text-lg border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onEnter) {
            onEnter()
          }
        }}
      />
    </div>
  )
}
