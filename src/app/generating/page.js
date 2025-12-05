'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { io } from 'socket.io-client'
import { useCreateStory } from '@/hooks/useCreateStory'

const initialSteps = [
  { text: 'Preparing your story...', completed: false },
  { text: 'Generating your story with AI...', completed: false },
  { text: 'Creating Chapter 1 image...', completed: false },
  { text: 'Creating Chapter 2 image...', completed: false },
  { text: 'Creating Chapter 3 image...', completed: false },
  { text: 'Finalizing everything...', completed: false }
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
  const [steps, setSteps] = useState(initialSteps)
  const [error, setError] = useState(null)
  const [storyData, setStoryData] = useState(null)
  const [statusMessage, setStatusMessage] = useState('Starting story generation...')
  const socketRef = useRef(null)
  const requestIdRef = useRef(null)
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
    let userId = null

    const submitStory = async () => {
      try {
        console.log('[API] Starting story submission process...')
        const userData = JSON.parse(user)
        userId = userData.id || userData.email || 'user_123'
        console.log('[API] User ID:', userId)

        const formData = new FormData()
        formData.append('userId', userId)
        console.log('[API] FormData created, userId appended')

        // Check if mainCharacterImages is description object or image array
        let mainCharacterDescription = null
        if (parsedAnswers.mainCharacterImages && typeof parsedAnswers.mainCharacterImages === 'object' && !Array.isArray(parsedAnswers.mainCharacterImages)) {
          mainCharacterDescription = parsedAnswers.mainCharacterImages
          console.log('[API] Main character description found:', Object.keys(mainCharacterDescription))
        }

        // Check if storytellerImages is description object or image array
        let storytellerDescription = null
        if (parsedAnswers.storytellerImages && typeof parsedAnswers.storytellerImages === 'object' && !Array.isArray(parsedAnswers.storytellerImages)) {
          storytellerDescription = parsedAnswers.storytellerImages
          console.log('[API] Storyteller description found:', Object.keys(storytellerDescription))
        }

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
          additionalInfo: parsedAnswers.additionalInfo || '',
          mainCharacterDescription: mainCharacterDescription,
          storytellerDescription: storytellerDescription
        }

        formData.append('questionnaireData', JSON.stringify(questionnaireData))
        console.log('[API] Questionnaire data appended:', Object.keys(questionnaireData))

        if (parsedAnswers.mainCharacterImages && Array.isArray(parsedAnswers.mainCharacterImages)) {
          console.log('[API] Processing main character images:', parsedAnswers.mainCharacterImages.length)
          parsedAnswers.mainCharacterImages.forEach((image, index) => {
            if (image) {
              let file
              if (image.file instanceof File) {
                file = image.file
                console.log(`[API] Main character image ${index + 1}: Using existing File object`)
              } else if (image.preview) {
                const filename = image.name || `main-character-${index + 1}.jpg`
                file = base64ToFile(image.preview, filename)
                console.log(`[API] Main character image ${index + 1}: Converted from base64 to File`)
              }
              if (file) {
                formData.append('mainCharacterImages', file)
                console.log(`[API] Main character image ${index + 1} appended to FormData:`, file.name, file.size, 'bytes')
              }
            }
          })
        } else if (!mainCharacterDescription) {
          console.warn('[API] No main character images or description found')
        }

        if (parsedAnswers.storytellerImages && Array.isArray(parsedAnswers.storytellerImages)) {
          console.log('[API] Processing storyteller images:', parsedAnswers.storytellerImages.length)
          parsedAnswers.storytellerImages.forEach((image, index) => {
            if (image) {
              let file
              if (image.file instanceof File) {
                file = image.file
                console.log(`[API] Storyteller image ${index + 1}: Using existing File object`)
              } else if (image.preview) {
                const filename = image.name || `storyteller-${index + 1}.jpg`
                file = base64ToFile(image.preview, filename)
                console.log(`[API] Storyteller image ${index + 1}: Converted from base64 to File`)
              }
              if (file) {
                formData.append('storytellerImages', file)
                console.log(`[API] Storyteller image ${index + 1} appended to FormData:`, file.name, file.size, 'bytes')
              }
            }
          })
        } else if (!storytellerDescription) {
          console.warn('[API] No storyteller images or description found')
        }
        
        console.log('[API] FormData preparation complete')

        console.log('[API] Submitting story creation request...')
        const response = await createStory(formData)
        console.log('[API] Story creation response:', response)
        
        if (response.success && response.requestId) {
          requestIdRef.current = response.requestId
          console.log('[API] Story creation successful!')
          console.log('[API] Request ID:', response.requestId)
          console.log('[API] Status:', response.status)
          setStatusMessage('Story generation started!')
          setCurrentStep(1)

          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
          console.log('[Socket] Initializing Socket.IO connection...')
          console.log('[Socket] API Base URL:', API_BASE_URL)
          
          socketRef.current = io(API_BASE_URL, {
            transports: ['websocket', 'polling']
          })
          
          console.log('[Socket] Socket.IO instance created')

          socketRef.current.on('connect', () => {
            console.log('[Socket] Connected to server')
            console.log('[Socket] Socket ID:', socketRef.current.id)
            console.log('[Socket] Emitting join-room with userId:', userId)
            socketRef.current.emit('join-room', { userId })
            setStatusMessage('Connected. Waiting for story generation...')
          })

          socketRef.current.on('connect_error', (err) => {
            console.error('[Socket] Connection error:', err)
            console.error('[Socket] Error details:', {
              message: err.message,
              type: err.type,
              description: err.description
            })
            setStatusMessage('Connection issue. Will retry...')
          })

          socketRef.current.on('disconnect', (reason) => {
            console.log('[Socket] Disconnected from server')
            console.log('[Socket] Disconnect reason:', reason)
            if (reason === 'io server disconnect') {
              console.log('[Socket] Server initiated disconnect')
              setStatusMessage('Connection lost. Please refresh the page.')
            }
          })

          socketRef.current.on('error', (err) => {
            console.error('[Socket] Socket error:', err)
            console.error('[Socket] Error details:', {
              message: err.message,
              type: err.type
            })
            setStatusMessage('An error occurred. Please try again.')
          })

          socketRef.current.on('story-started', (data) => {
            console.log('[Socket] Received story-started event')
            console.log('[Socket] Event data:', data)
            if (data.requestId === requestIdRef.current) {
              console.log('[Socket] Story started confirmed!')
              setStatusMessage(data.message || 'Story generation process has started')
            }
          })

          socketRef.current.on('story-progress', (data) => {
            console.log('[Socket] Received story-progress event')
            console.log('[Socket] Event data:', data)
            if (data.requestId === requestIdRef.current) {
              console.log(`[Socket] Progress update: ${data.progress} (Step: ${data.step})`)
              setStatusMessage(data.progress)
              if (data.step) {
                setCurrentStep(Math.min(data.step, initialSteps.length - 1))
              }
            }
          })

          socketRef.current.on('story-complete', (data) => {
            console.log('[Socket] Received story-complete event')
            console.log('[Socket] Event data:', data)
            console.log('[Socket] Request ID from event:', data.requestId)
            console.log('[Socket] Current request ID:', requestIdRef.current)
            console.log('[Socket] Chapters count:', data.chapters?.length || 0)
            
            if (data.requestId === requestIdRef.current) {
              console.log('[Socket] Request ID matches! Processing story completion...')
              setStoryData(data)
              setStatusMessage(data.message || 'Story generation complete!')
              setSteps(prev => prev.map(step => ({ ...step, completed: true })))
              setCurrentStep(initialSteps.length - 1)
              console.log('[Socket] Story data set successfully')
            } else {
              console.warn('[Socket] Request ID mismatch. Ignoring event.')
            }
          })

          socketRef.current.on('story-failed', (data) => {
            console.error('[Socket] Received story-failed event')
            console.error('[Socket] Event data:', data)
            console.error('[Socket] Request ID from event:', data.requestId)
            console.error('[Socket] Current request ID:', requestIdRef.current)
            console.error('[Socket] Error message:', data.error)
            
            if (data.requestId === requestIdRef.current) {
              console.error('[Socket] Request ID matches! Processing story failure...')
              setError(data.error || 'Story generation failed. Please try again.')
            } else {
              console.warn('[Socket] Request ID mismatch. Ignoring failure event.')
            }
          })

          console.log('[Socket] All event listeners registered')
          console.log('[Socket] Waiting for connection...')
        }

        let currentStepIndex = 0
        let storyCompleted = false
        interval = setInterval(() => {
          if (currentStepIndex < initialSteps.length - 1 && !storyCompleted) {
            currentStepIndex++
            setCurrentStep(currentStepIndex)
            
            if (currentStepIndex === 1) {
              setStatusMessage('AI is writing your story...')
              console.log('[Progress] Step 1: AI is writing your story...')
            } else if (currentStepIndex >= 2 && currentStepIndex <= 4) {
              const chapterNum = currentStepIndex - 1
              setStatusMessage(`Creating beautiful image for Chapter ${chapterNum}...`)
              console.log(`[Progress] Step ${currentStepIndex}: Creating Chapter ${chapterNum} image...`)
            } else if (currentStepIndex === 5) {
              setStatusMessage('Putting everything together...')
              console.log('[Progress] Step 5: Finalizing everything...')
            }
          } else {
            console.log('[Progress] Progress interval stopped')
            clearInterval(interval)
          }
        }, 3000)
        
        socketRef.current?.on('story-complete', () => {
          storyCompleted = true
        })
      } catch (err) {
        console.error('[API] Error creating story:', err)
        console.error('[API] Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        })
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
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
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
              className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
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
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
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
              className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
            >
              View Story
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="inline-block relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full relative">
              <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Creating Your Story
        </h2>

        <p className="text-purple-600 font-medium mb-8">
          {statusMessage}
        </p>

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
                  step.completed || index < currentStep
                    ? 'bg-linear-to-br from-purple-500 to-pink-500'
                    : index === currentStep
                    ? 'bg-linear-to-br from-purple-500 to-pink-500 animate-pulse'
                    : 'bg-gray-300'
                }`}
              >
                {step.completed || index < currentStep ? (
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
          This may take a few minutes. Please don&apos;t close this page.
        </p>
      </div>
    </div>
  )
}