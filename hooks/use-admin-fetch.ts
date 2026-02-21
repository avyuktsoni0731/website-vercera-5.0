'use client'

import { useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'

/**
 * Returns a fetch function that adds the current user's Firebase ID token
 * to requests. Use for calling admin API routes from admin pages.
 */
export function useAdminFetch() {
  const { user } = useAuth()

  const fetchWithAuth = useCallback(
    async (url: string | URL, init?: RequestInit): Promise<Response> => {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), {
          status: 401,
        })
      }
      const token = await user.getIdToken()
      const headers = new Headers(init?.headers)
      headers.set('Authorization', `Bearer ${token}`)
      return fetch(url, { ...init, headers })
    },
    [user]
  )

  return fetchWithAuth
}
