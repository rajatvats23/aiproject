'use client'

import { useCallback } from 'react'
import useSWRMutation from 'swr/mutation'
import { createStory } from '@/lib/api'

export const useCreateStory = () => {
  const { trigger, data, error, isMutating } = useSWRMutation(
    '/api/story/create',
    async (key, { arg }) => {
      return await createStory(arg)
    }
  )

  const createStoryMutation = useCallback(
    async (formData) => {
      try {
        const result = await trigger(formData)
        return result
      } catch (err) {
        throw err
      }
    },
    [trigger]
  )

  return {
    createStory: createStoryMutation,
    data,
    error,
    isLoading: isMutating
  }
}

