'use client'

import { useRouter } from 'next/navigation'
import ClickSpark from '@/components/ClickSpark'

export default function Home() {
  const router = useRouter()

  const handleGetStarted = () => {
    const dummyUser = {
      name: 'User',
      email: 'user@storybook.com',
      loggedIn: true,
      loginTime: new Date().toISOString()
    }
    
    localStorage.setItem('user', JSON.stringify(dummyUser))
    localStorage.removeItem('storyAnswers')
    
    router.push('/questionnaire/1')
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 max-w-xl w-full text-center">
        <div className="mb-8">
          <div className="inline-block p-6 bg-linear-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full mb-6">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Welcome make your storybook.
          </h1>
          <p className="text-base text-gray-600 mb-8">
            Please answer these questions that will help us to make your storybook better.
          </p>
        </div>
        
        <div className="space-y-4 mb-10 text-left">
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-700">Perfect for children aged 2 - 4</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-700">Personalize with your child&apos;s special photo</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <p className="text-gray-700">Enjoy a full preview of the story before purchase</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
            <p className="text-gray-700">Printed and shipped within 7–8 business days</p>
          </div>
        </div>
        
        <ClickSpark>
          <button
            onClick={handleGetStarted}
            className="w-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 text-lg"
          >
            Let&apos;s go
          </button>
        </ClickSpark>
      </div>
    </div>
  )
}