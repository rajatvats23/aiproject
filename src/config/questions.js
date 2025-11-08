// Centralized question configuration
// Easy to add, remove, or reorder questions

export const questionConfig = [
  {
    id: 'storyAbout',
    step: 1,
    type: 'radio',
    question: 'Who is the story about?',
    description: '',
    required: true,
    options: [
      { value: 'my-kid', label: 'My kid' },
      { value: 'my-mom', label: 'My Mom' },
      { value: 'my-dad', label: 'My Dad' },
      { value: 'my-grandma', label: 'My Grandma' },
      { value: 'my-grandpa', label: 'My Grandpa' }
    ]
  },
  {
    id: 'gender',
    step: 2,
    type: 'dropdown',
    question: 'Gender (not for the person ordering)',
    description: '',
    required: true,
    placeholder: 'Select gender',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ]
  },
  {
    id: 'name',
    step: 3,
    type: 'text',
    question: 'What is their name?',
    description: '',
    placeholder: 'Enter their name',
    required: true
  },
  {
    id: 'age',
    step: 4,
    type: 'text',
    question: 'How old are they?',
    description: '',
    placeholder: 'Enter their age',
    required: true
  },
  {
    id: 'relationship',
    step: 5,
    type: 'text',
    question: 'Who are they to you and the others in the story?',
    description: '',
    placeholder: 'e.g., My loving mother, grandmother to my children',
    required: true
  },
  {
    id: 'nickname',
    step: 6,
    type: 'text',
    question: 'Do they have a nickname?',
    description: '',
    placeholder: 'Enter their nickname (optional)',
    required: false
  },
  {
    id: 'mainCharacterImages',
    step: 7,
    type: 'image-upload',
    question: 'Great! Let\'s upload their picture',
    description: '',
    required: true,
    minImages: 1
  },
  {
    id: 'storyteller',
    step: 8,
    type: 'text',
    question: 'Who do you want to be telling the story?',
    description: 'You or a group of people?',
    placeholder: 'e.g., Just me',
    required: true
  },
  {
    id: 'storytellerNames',
    step: 9,
    type: 'text',
    question: 'Name of people/person telling the story?',
    description: '',
    placeholder: 'e.g., Your name',
    required: true
  },
  {
    id: 'storytellerRelationship',
    step: 10,
    type: 'textarea',
    question: 'Who is this person or people to the main character of the story?',
    description: '',
    placeholder: 'Describe their relationship',
    required: true,
    rows: 4
  },
  {
    id: 'characterDescription',
    step: 11,
    type: 'textarea',
    question: 'Describe this main character.',
    description: '',
    placeholder: 'Describe the main character',
    required: true,
    rows: 4
  },
  {
    id: 'storytellerImages',
    step: 12,
    type: 'image-upload',
    question: 'Great! Let\'s upload their picture too.',
    description: '',
    required: true,
    minImages: 1
  },
  {
    id: 'backgroundInfo',
    step: 13,
    type: 'textarea',
    question: 'Do you want to share anything about where they are from? Their childhood?',
    description: '',
    placeholder: 'Share their background information',
    required: false,
    rows: 4
  },
  {
    id: 'hobbies',
    step: 14,
    type: 'textarea',
    question: 'Describe things they loved/love to do in their free time:',
    description: '',
    placeholder: 'Describe their hobbies and interests',
    required: false,
    rows: 4
  },
  {
    id: 'specialQualities',
    step: 15,
    type: 'textarea',
    question: 'Share what things make them special to you:',
    description: '',
    placeholder: 'What makes them special?',
    required: false,
    rows: 4
  },
  {
    id: 'admiration',
    step: 16,
    type: 'textarea',
    question: 'What do you admire about this person?',
    description: '',
    placeholder: 'What do you admire?',
    required: false,
    rows: 4
  },
  {
    id: 'feelings',
    step: 17,
    type: 'textarea',
    question: 'What do you wish they knew about how you feel about them?',
    description: '',
    placeholder: 'Share your feelings',
    required: false,
    rows: 4
  },
  {
    id: 'wishes',
    step: 18,
    type: 'textarea',
    question: 'Do you wish anything for them?',
    description: '',
    placeholder: 'Share your wishes for them',
    required: false,
    rows: 4
  },
  {
    id: 'specialStory',
    step: 19,
    type: 'textarea',
    question: 'Do you have a special story you love to share about this person?',
    description: '',
    placeholder: 'Share a special story',
    required: false,
    rows: 4
  },
  {
    id: 'additionalInfo',
    step: 20,
    type: 'textarea',
    question: 'Anything else that we are forgetting that you would want to share in your story?',
    description: '',
    placeholder: 'Share any additional information',
    required: false,
    rows: 4
  }
]

// Helper functions
export const getTotalSteps = () => questionConfig.length

export const getQuestionByStep = (step) => {
  return questionConfig.find(q => q.step === parseInt(step))
}

export const getNextStep = (currentStep) => {
  const current = parseInt(currentStep)
  return current < getTotalSteps() ? current + 1 : null
}

export const getPreviousStep = (currentStep) => {
  const current = parseInt(currentStep)
  return current > 1 ? current - 1 : null
}

export const calculateProgress = (step) => {
  return (parseInt(step) / getTotalSteps()) * 100
}