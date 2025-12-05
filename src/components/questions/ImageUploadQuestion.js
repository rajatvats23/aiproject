'use client'

import { useRef, useState, useEffect } from 'react'
import ClickSpark from '@/components/ClickSpark'
import CharacterDescriptionQuestionnaire from './CharacterDescriptionQuestionnaire'

export default function ImageUploadQuestion({ value = [], onChange, minImages = 3 }) {
  const fileInputRef = useRef(null)
  const [mode, setMode] = useState('upload') // 'upload' or 'description'
  const [images, setImages] = useState([])
  const [description, setDescription] = useState({})

  useEffect(() => {
    // If value is explicitly an array, it's upload mode
    if (Array.isArray(value)) {
      setMode('upload')
      setImages(value)
      setDescription({})
    } 
    // If value is an object (not array), it's description mode (even if empty)
    else if (value && typeof value === 'object' && !Array.isArray(value)) {
      setMode('description')
      setDescription(value)
      setImages([])
    } 
    // Default to upload mode for null/undefined/empty
    else {
      setMode('upload')
      setImages([])
      setDescription({})
    }
  }, [value])

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
        
        const newImages = [...images, newImage]
        setImages(newImages)
        onChange(newImages)
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveImage = (id) => {
    const newImages = images.filter((img) => img.id !== id)
    setImages(newImages)
    onChange(newImages)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleDescriptionChange = (desc) => {
    setDescription(desc)
    onChange(desc)
  }

  const handleSwitchToDescription = () => {
    setMode('description')
    setImages([])
    setDescription({})
    onChange({})
  }

  const handleSwitchToUpload = () => {
    setMode('upload')
    setDescription({})
    onChange([])
  }

  if (mode === 'description') {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleSwitchToUpload}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Upload Image Instead
          </button>
        </div>
        <CharacterDescriptionQuestionnaire
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
    )
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
          className="border-4 border-dashed border-purple-300 rounded-3xl p-8 sm:p-12 md:p-16 text-center cursor-pointer hover:border-purple-400 transition-colors mb-4"
        >
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-purple-500 mx-auto mb-3 sm:mb-4"
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
          <p className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            Click to upload pictures
          </p>
          <p className="text-sm sm:text-base text-gray-600">
            Minimum {minImages} image{minImages !== 1 ? 's' : ''} required
          </p>
        </div>
      </ClickSpark>

      <div className="text-center mt-2 -mb-1">
        <span className="text-gray-500 font-bold italic">Or</span>
      </div>

      <ClickSpark>
        <button
          onClick={handleSwitchToDescription}
          className="w-full text-purple-400 font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300  text-base sm:text-lg"
        >
          Describe Person
        </button>
      </ClickSpark>

      {images.length > 0 && (
        <div className="mb-6 mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => handleRemoveImage(image.id)}
                  className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                  aria-label="Remove image"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
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
          <p className="text-gray-600 text-sm sm:text-base">
            {images.length} image{images.length !== 1 ? 's' : ''} uploaded
          </p>
        </div>
      )}
    </div>
  )
}
