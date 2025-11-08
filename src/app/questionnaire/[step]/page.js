'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ClickSpark from '@/components/ClickSpark'
import RadioQuestion from '@/components/questions/RadioQuestion'
import TextQuestion from '@/components/questions/TextQuestion'
import TextareaQuestion from '@/components/questions/TextareaQuestion'
import ImageUploadQuestion from '@/components/questions/ImageUploadQuestion'
import DropdownQuestion from '@/components/questions/DropdownQuestion'
import { 
  getQuestionByStep, 
  getNextStep, 
  getPreviousStep, 
  calculateProgress, 
  getTotalSteps 
} from '@/config/questions'

export default function QuestionnairePage() {
  const router = useRouter()
  const params = useParams()
  const currentStep = parseInt(params.step)
  
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(true)
  
  const question = getQuestionByStep(currentStep)
  const progress = calculateProgress(currentStep)
  const totalSteps = getTotalSteps()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/')
      return
    }

    if (!question) {
      router.push('/questionnaire/1')
      return
    }

    const savedAnswers = localStorage.getItem('storyAnswers')
    if (savedAnswers) {
      const answers = JSON.parse(savedAnswers)
      if (answers[question.id]) {
        setTimeout(() => {
          setAnswer(answers[question.id])
        }, 100)
      }
    }
    
    setTimeout(() => {
      setLoading(false)
    }, 100)
  }, [currentStep, router, question])

  const validateAnswer = () => {
    if (!question.required) return true
    
    if (question.type === 'image-upload') {
      return Array.isArray(answer) && answer.length >= (question.minImages || 1)
    }
    
    if (typeof answer === 'string') {
      return answer.trim().length > 0
    }
    
    return !!answer
  }

  const saveAnswer = () => {
    const savedAnswers = localStorage.getItem('storyAnswers')
    const answers = savedAnswers ? JSON.parse(savedAnswers) : {}
    
    answers[question.id] = answer
    answers.currentStep = currentStep
    
    localStorage.setItem('storyAnswers', JSON.stringify(answers))
  }

  const handleNext = () => {
    if (!validateAnswer()) return
    
    saveAnswer()
    
    const nextStep = getNextStep(currentStep)
    if (nextStep) {
      router.push(`/questionnaire/${nextStep}`)
    } else {
      const savedAnswers = localStorage.getItem('storyAnswers')
      const answers = savedAnswers ? JSON.parse(savedAnswers) : {}
      answers.completed = true
      answers.completedAt = new Date().toISOString()
      localStorage.setItem('storyAnswers', JSON.stringify(answers))
      router.push('/generating')
    }
  }

  const handleBack = () => {
    const prevStep = getPreviousStep(currentStep)
    if (prevStep) {
      router.push(`/questionnaire/${prevStep}`)
    } else {
      router.push('/')
    }
  }

  const getDynamicQuestionText = () => {
    if (question.type === 'image-upload' && question.id === 'mainCharacterImages') {
      const savedAnswers = localStorage.getItem('storyAnswers')
      if (savedAnswers) {
        const answers = JSON.parse(savedAnswers)
        const name = answers.name || ''
        const nickname = answers.nickname || ''
        if (name || nickname) {
          const displayName = nickname ? `${name} (${nickname})` : name
          return `Great! Let's upload their picture `
        }
      }
    }
    return question.question
  }

  const renderQuestion = () => {
    switch (question.type) {
      case 'radio':
        return (
          <RadioQuestion
            value={answer}
            onChange={setAnswer}
            options={question.options}
          />
        )
      
      case 'dropdown':
        return (
          <DropdownQuestion
            value={answer}
            onChange={setAnswer}
            options={question.options}
            placeholder={question.placeholder}
          />
        )
      
      case 'text':
        return (
          <TextQuestion
            value={answer}
            onChange={setAnswer}
            placeholder={question.placeholder}
            onEnter={question.required && answer?.trim() ? handleNext : null}
          />
        )
      
      case 'textarea':
        return (
          <TextareaQuestion
            value={answer}
            onChange={setAnswer}
            placeholder={question.placeholder}
            rows={question.rows}
          />
        )
      
      case 'image-upload':
        return (
          <ImageUploadQuestion
            value={answer || []}
            onChange={setAnswer}
            minImages={question.minImages}
          />
        )
      
      default:
        return null
    }
  }

  if (loading || !question) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900"></div>
      </div>
    )
  }

  const isLastStep = !getNextStep(currentStep)
  const isValid = validateAnswer()

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 max-w-2xl w-full">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Question {currentStep} of {totalSteps}</span>
            <span className="text-sm font-semibold text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {getDynamicQuestionText()}
        </h1>
        
        {question.description && (
          <p className="text-gray-600 mb-8">
            {question.description}
          </p>
        )}

        {renderQuestion()}

        <div className="space-y-3">
          <ClickSpark>
            <button
              onClick={handleNext}
              disabled={!isValid}
              className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-full transition-all duration-300"
            >
              {isLastStep ? 'View Results' : 'Next'}
            </button>
          </ClickSpark>
          
          <button
            onClick={handleBack}
            className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}
