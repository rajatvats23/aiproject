'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Authentication Successful!</h2>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">You have been successfully signed in.</p>
        <p className="text-sm text-gray-500">Redirecting to home page...</p>
      </div>
    </div>
  )
}
