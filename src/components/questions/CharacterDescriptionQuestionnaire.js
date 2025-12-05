'use client'

import { useState, useEffect } from 'react'

const descriptionQuestions = [
  {
    id: 'hairColor',
    question: 'What kind of hair do they have?',
    subQuestion: 'Hair Color',
    type: 'radio',
    options: [
      { value: 'black', label: 'Black' },
      { value: 'darkBrown', label: 'Dark Brown' },
      { value: 'lightBrown', label: 'Light Brown' },
      { value: 'blonde', label: 'Blonde' },
      { value: 'red', label: 'Red' },
      { value: 'other', label: 'Other', hasInput: true }
    ]
  },
  {
    id: 'hairStyle',
    question: '',
    subQuestion: 'Hair Style',
    type: 'radio',
    options: [
      { value: 'curly', label: 'Curly' },
      { value: 'wavy', label: 'Wavy' },
      { value: 'straight', label: 'Straight' },
      { value: 'short', label: 'Short' },
      { value: 'long', label: 'Long' },
      { value: 'braids', label: 'Braids' },
      { value: 'ponytail', label: 'Ponytail' },
      { value: 'other', label: 'Other', hasInput: true }
    ]
  },
  {
    id: 'skinTone',
    question: 'What is their skin tone like?',
    subQuestion: '',
    type: 'radio',
    options: [
      { value: 'light', label: 'Light' },
      { value: 'medium', label: 'Medium' },
      { value: 'dark', label: 'Dark' },
      { value: 'warmBrown', label: 'Warm Brown' },
      { value: 'olive', label: 'Olive' },
      { value: 'other', label: 'Other', hasInput: true }
    ]
  },
  {
    id: 'clothes',
    question: 'What clothes should they wear?',
    subQuestion: '',
    type: 'radio',
    options: [
      { value: 'hoodie', label: 'Hoodie' },
      { value: 'tshirt', label: 'T-Shirt' },
      { value: 'dress', label: 'Dress' },
      { value: 'pajamas', label: 'Pajamas' },
      { value: 'superheroCape', label: 'Superhero Cape' },
      { value: 'overalls', label: 'Overalls' },
      { value: 'jacket', label: 'Jacket' },
      { value: 'other', label: 'Other', hasInput: true }
    ]
  },
  {
    id: 'favoriteColor',
    question: 'Favorite color:',
    subQuestion: '',
    type: 'text',
    placeholder: 'Enter favorite color'
  },
  {
    id: 'specialFeatures',
    question: 'Any special features?',
    subQuestion: '',
    type: 'radio',
    options: [
      { value: 'glasses', label: 'Glasses' },
      { value: 'freckles', label: 'Freckles' },
      { value: 'hat', label: 'Hat' },
      { value: 'hairClips', label: 'Hair Clips' },
      { value: 'backpack', label: 'Backpack' },
      { value: 'none', label: 'None' },
      { value: 'other', label: 'Other', hasInput: true }
    ]
  },
  {
    id: 'personality',
    question: 'What is their personality like?',
    subQuestion: '',
    type: 'radio',
    options: [
      { value: 'adventurous', label: 'Adventurous' },
      { value: 'curious', label: 'Curious' },
      { value: 'sillyPlayful', label: 'Silly / Playful' },
      { value: 'brave', label: 'Brave' },
      { value: 'imaginative', label: 'Imaginative' },
      { value: 'kind', label: 'Kind' },
      { value: 'shy', label: 'Shy' },
      { value: 'other', label: 'Other', hasInput: true }
    ]
  },
  {
    id: 'adventureLocation',
    question: 'Where is the adventure happening?',
    subQuestion: '',
    type: 'radio',
    options: [
      { value: 'space', label: 'Space' },
      { value: 'jungleSafari', label: 'Jungle / Safari' },
      { value: 'magicalForest', label: 'Magical Forest' },
      { value: 'underTheSea', label: 'Under the Sea' },
      { value: 'fairyTaleLand', label: 'Fairy Tale Land' },
      { value: 'robotWorld', label: 'Robot World' },
      { value: 'animalFriends', label: 'Animal Friends' },
      { value: 'other', label: 'Other', hasInput: true }
    ]
  },
  {
    id: 'whoIsJoining',
    question: 'Who is joining them?',
    subQuestion: '',
    type: 'radio',
    options: [
      { value: 'cuteAnimals', label: 'Cute Animals' },
      { value: 'magicalCreatures', label: 'Magical Creatures' },
      { value: 'robots', label: 'Robots' },
      { value: 'friends', label: 'Friends' },
      { value: 'soloAdventure', label: 'No buddies—solo adventure!' },
      { value: 'other', label: 'Other', hasInput: true }
    ]
  },
  {
    id: 'anythingElse',
    question: 'Anything else you want to add?',
    subQuestion: '',
    type: 'textarea',
    placeholder: 'Write or draw here...'
  }
]

export default function CharacterDescriptionQuestionnaire({ value = {}, onChange }) {
  const [answers, setAnswers] = useState(value || {})
  const [otherInputs, setOtherInputs] = useState(() => {
    // Extract "Other" input values from saved answers
    const inputs = {}
    if (value && typeof value === 'object') {
      Object.keys(value).forEach(key => {
        const answerValue = value[key]
        if (typeof answerValue === 'string' && answerValue.startsWith('Other: ')) {
          inputs[key] = answerValue.replace('Other: ', '')
        }
      })
    }
    return inputs
  })

  const handleAnswerChange = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer }
    setAnswers(newAnswers)
    onChange(newAnswers)
  }

  useEffect(() => {
    // Update answers when value prop changes
    if (value && typeof value === 'object') {
      setAnswers(value)
      // Extract "Other" input values
      const inputs = {}
      Object.keys(value).forEach(key => {
        const answerValue = value[key]
        if (typeof answerValue === 'string' && answerValue.startsWith('Other: ')) {
          inputs[key] = answerValue.replace('Other: ', '')
        }
      })
      setOtherInputs(inputs)
    }
  }, [value])

  const handleOtherInputChange = (questionId, inputValue) => {
    const newOtherInputs = { ...otherInputs, [questionId]: inputValue }
    setOtherInputs(newOtherInputs)
    const newAnswers = { ...answers, [questionId]: `Other: ${inputValue}` }
    setAnswers(newAnswers)
    onChange(newAnswers)
  }

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'radio':
        return (
          <div className="space-y-2 sm:space-y-3">
            {question.options.map((option) => (
              <div key={option.value} className={option.hasInput && (answers[question.id] === option.value || answers[question.id]?.startsWith('Other:')) ? 'flex flex-col gap-2' : ''}>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={answers[question.id] === option.value || (option.value === 'other' && answers[question.id]?.startsWith('Other:'))}
                    onChange={() => {
                      if (option.hasInput) {
                        handleAnswerChange(question.id, 'Other: ')
                      } else {
                        handleAnswerChange(question.id, option.value)
                      }
                    }}
                    className="w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500 focus:ring-2 shrink-0"
                  />
                  <span className="ml-3 text-gray-700 font-medium text-sm sm:text-base">{option.label}</span>
                </label>
                {option.hasInput && (answers[question.id] === option.value || answers[question.id]?.startsWith('Other:')) && (
                  <input
                    type="text"
                    value={otherInputs[question.id] || ''}
                    onChange={(e) => handleOtherInputChange(question.id, e.target.value)}
                    placeholder="Enter details"
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm sm:text-base"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            ))}
          </div>
        )
      
      case 'text':
        return (
          <input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full px-4 text-black py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm sm:text-base"
          />
        )
      
      case 'textarea':
        return (
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className="w-full px-4 text-black py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none text-sm sm:text-base"
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-h-[60vh] overflow-y-auto pr-2 pb-4">
      {descriptionQuestions.map((question, index) => (
        <div key={question.id} className="bg-gray-50 rounded-xl p-4 sm:p-6">
          {question.question && (
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
              {index + 1}. {question.question}
            </h3>
          )}
          {question.subQuestion && (
            <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
              {question.subQuestion}
            </h4>
          )}
          {renderQuestion(question)}
        </div>
      ))}
    </div>
  )
}

