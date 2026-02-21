'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'

export function useAdmin() {
  const { user, loading: authLoading } = useAuth()
  const [adminChecked, setAdminChecked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!user || authLoading) {
      setAdminChecked(false)
      setIsAdmin(false)
      return
    }
    let cancelled = false
    user.getIdToken().then((token) => {
      if (cancelled) return
      return fetch('/api/admin/check', {
        headers: { Authorization: `Bearer ${token}` },
      })
    }).then((res) => {
      if (cancelled) return
      setAdminChecked(true)
      setIsAdmin(res?.ok === true)
    }).catch(() => {
      if (!cancelled) {
        setAdminChecked(true)
        setIsAdmin(false)
      }
    })
    return () => { cancelled = true }
  }, [user, authLoading])

  return {
    isAdmin,
    adminChecked: adminChecked && !authLoading,
    loading: authLoading || (!!user && !adminChecked),
  }
}
