'use client'

import ClickSpark from '@/components/ClickSpark'

export default function RadioQuestion({ value, onChange, options }) {
  return (
    <div className="space-y-3 mb-8">
      {options.map((option) => (
        <ClickSpark key={option.value}>
          <button
            onClick={() => onChange(option.value)}
            className={`w-full p-4 rounded-xl transition-all duration-200 flex items-center gap-4 text-left ${
              value === option.value
                ? 'bg-gray-50'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              value === option.value
                ? 'border-purple-500'
                : 'border-gray-300'
            }`}>
              {value === option.value && (
                <div className="w-3 h-3 rounded-full bg-linear-to-br from-purple-500 to-pink-500"></div>
              )}
            </div>
            <span className="text-lg text-gray-900">{option.label}</span>
          </button>
        </ClickSpark>
      ))}
    </div>
  )
}
