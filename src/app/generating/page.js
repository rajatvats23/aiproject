'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { io } from 'socket.io-client'
import { useCreateStory } from '@/hooks/useCreateStory'

const steps = [
  { text: 'Thinking...', duration: 2000 },
  { text: 'Generating your story...', duration: 3000 },
  { text: 'Creating beautiful pictures...', duration: 3000 },
  { text: 'Finalizing everything...', duration: 2000 }
]

const base64ToFile = (base64String, filename) => {
  const arr = base64String.split(',')
  const mimeMatch = arr[0].match(/:(.*?);/)
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const base64Data = arr[1] || base64String
  const byteCharacters = atob(base64Data)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: mimeType })
  return new File([blob], filename, { type: mimeType })
}

export default function GeneratingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState(null)
  const [storyData, setStoryData] = useState(null)
  const socketRef = useRef(null)
  const { createStory, isLoading } = useCreateStory()

  useEffect(() => {
    const user = localStorage.getItem('user')
    const answers = localStorage.getItem('storyAnswers')
    
    if (!user || !answers) {
      router.push('/')
      return
    }

    const parsedAnswers = JSON.parse(answers)
    if (!parsedAnswers.completed) {
      router.push('/questionnaire/1')
      return
    }

    let interval = null

    const submitStory = async () => {
      try {
        const userData = JSON.parse(user)
        const userId = userData.id || userData.email || 'user_123'

        const formData = new FormData()
        formData.append('userId', userId)

        const questionnaireData = {
          storyAbout: parsedAnswers.storyAbout || '',
          gender: parsedAnswers.gender || '',
          name: parsedAnswers.name || '',
          age: parsedAnswers.age || '',
          relationship: parsedAnswers.relationship || '',
          nickname: parsedAnswers.nickname || '',
          storyteller: parsedAnswers.storyteller || '',
          storytellerNames: parsedAnswers.storytellerNames || '',
          storytellerRelationship: parsedAnswers.storytellerRelationship || '',
          characterDescription: parsedAnswers.characterDescription || '',
          backgroundInfo: parsedAnswers.backgroundInfo || '',
          hobbies: parsedAnswers.hobbies || '',
          specialQualities: parsedAnswers.specialQualities || '',
          admiration: parsedAnswers.admiration || '',
          feelings: parsedAnswers.feelings || '',
          wishes: parsedAnswers.wishes || '',
          specialStory: parsedAnswers.specialStory || '',
          additionalInfo: parsedAnswers.additionalInfo || ''
        }

        formData.append('questionnaireData', JSON.stringify(questionnaireData))

        if (parsedAnswers.mainCharacterImages && Array.isArray(parsedAnswers.mainCharacterImages)) {
          parsedAnswers.mainCharacterImages.forEach((image, index) => {
            if (image) {
              let file
              if (image.file instanceof File) {
                file = image.file
              } else if (image.preview) {
                const filename = image.name || `main-character-${index + 1}.jpg`
                file = base64ToFile(image.preview, filename)
              }
              if (file) {
                formData.append('mainCharacterImages', file)
              }
            }
          })
        }

        if (parsedAnswers.storytellerImages && Array.isArray(parsedAnswers.storytellerImages)) {
          parsedAnswers.storytellerImages.forEach((image, index) => {
            if (image) {
              let file
              if (image.file instanceof File) {
                file = image.file
              } else if (image.preview) {
                const filename = image.name || `storyteller-${index + 1}.jpg`
                file = base64ToFile(image.preview, filename)
              }
              if (file) {
                formData.append('storytellerImages', file)
              }
            }
          })
        }

        const response = await createStory(formData)
        
        if (response.success && response.requestId) {
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
          
          socketRef.current = io(API_BASE_URL, {
            transports: ['websocket', 'polling']
          })

          socketRef.current.on('story-complete', (data) => {
            if (data.requestId === response.requestId) {
              setStoryData(data)
              setCurrentStep(steps.length - 1)
            }
          })

          socketRef.current.on('connect_error', (err) => {
            console.error('Socket connection error:', err)
            setError('Connection error. Please refresh the page.')
          })
        }

        let currentStepIndex = 0
        interval = setInterval(() => {
          currentStepIndex++
          if (currentStepIndex >= steps.length) {
            clearInterval(interval)
          } else {
            setCurrentStep(currentStepIndex)
          }
        }, steps[currentStepIndex]?.duration || 2000)
      } catch (err) {
        console.error('Error creating story:', err)
        setError(err.message || 'Failed to create story. Please try again.')
      }
    }

    submitStory()

    return () => {
      if (interval) {
        clearInterval(interval)
      }
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [router, createStory])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 max-w-lg w-full text-center">
          <div className="mb-6">
            <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/questionnaire/1')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (storyData && storyData.chapters) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 max-w-lg w-full text-center">
          <div className="mb-6">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Your Story is Ready!
            </h2>
            <p className="text-gray-600 mb-6">
              Your story has been generated with {storyData.chapters.length} chapters.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
            >
              View Story
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="inline-block relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full relative">
              <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Creating Your Story
        </h2>

        <div className="space-y-4 mb-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-500 ${
                index <= currentStep
                  ? 'bg-purple-50'
                  : 'bg-gray-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  index < currentStep
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                    : index === currentStep
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse'
                    : 'bg-gray-300'
                }`}
              >
                {index < currentStep ? (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className={`text-base font-medium ${
                index <= currentStep ? 'text-purple-700' : 'text-gray-500'
              }`}>
                {step.text}
              </span>
            </div>
          ))}
        </div>

        <p className="text-gray-500 text-sm">
          This may take a few moments. Please don&apos;t close this page.
        </p>
      </div>
    </div>
  )
}