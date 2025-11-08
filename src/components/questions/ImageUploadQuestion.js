'use client'

import { useRef } from 'react'
import ClickSpark from '@/components/ClickSpark'

export default function ImageUploadQuestion({ value = [], onChange, minImages = 3 }) {
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newImage = {
          id: Date.now() + Math.random(),
          file: file,
          preview: reader.result,
          name: file.name
        }
        
        onChange([...value, newImage])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveImage = (id) => {
    onChange(value.filter((img) => img.id !== id))
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <ClickSpark>
        <div
          onClick={handleUploadClick}
          className="border-4 border-dashed border-purple-300 rounded-3xl p-12 sm:p-16 text-center cursor-pointer hover:border-purple-400 transition-colors mb-6"
        >
          <svg
            className="w-16 h-16 sm:w-20 sm:h-20 text-purple-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Click to upload pictures
          </p>
          <p className="text-gray-600">
            Minimum {minImages} images required
          </p>
        </div>
      </ClickSpark>

      {value.length > 0 && (
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {value.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => handleRemoveImage(image.id)}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-sm">
            {value.length} image{value.length !== 1 ? 's' : ''} uploaded
          </p>
        </div>
      )}
    </div>
  )
}
