const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const createStory = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/story/create`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create story' }))
    throw new Error(error.message || 'Failed to create story')
  }

  return response.json()
}

