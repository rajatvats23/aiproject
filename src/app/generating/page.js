'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GeneratingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { text: 'Thinking...', duration: 2000 },
    { text: 'Generating your story...', duration: 3000 },
    { text: 'Creating beautiful pictures...', duration: 3000 },
    { text: 'Finalizing everything...', duration: 2000 }
  ]

  useEffect(() => {
    const user = localStorage.getItem('user')
    const answers = localStorage.getItem('storyAnswers')
    
    if (!user || !answers) {
      router.push('/')
      return
    }

    const parsedAnswers = JSON.parse(answers)
    if (!parsedAnswers.completed) {
      router.push('/questionnaire/step1')
      return
    }

    let currentStepIndex = 0
    const interval = setInterval(() => {
      currentStepIndex++
      if (currentStepIndex >= steps.length) {
        clearInterval(interval)
      } else {
        setCurrentStep(currentStepIndex)
      }
    }, steps[currentStepIndex]?.duration || 2000)

    return () => clearInterval(interval)
  }, [router])

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