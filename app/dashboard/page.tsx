'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { LogOut, Edit2, Clock, CheckCircle } from 'lucide-react'

interface User {
  email: string
  fullName: string
  college: string
  phone: string
  id: string
}

interface Registration {
  eventId: string
  eventName: string
  registrationDate: string
  status: 'registered' | 'paid' | 'completed'
  amount: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userToken = localStorage.getItem('userToken')

    if (!userToken) {
      router.push('/login?redirect=/dashboard')
      return
    }

    // Parse user data
    try {
      const userData = JSON.parse(userToken)
      setUser(userData)

      // Mock registrations data
      setRegistrations([
        {
          eventId: '1',
          eventName: 'CodeStorm Hackathon',
          registrationDate: '2024-03-01',
          status: 'paid',
          amount: 2000,
        },
        {
          eventId: '3',
          eventName: 'Gaming Tournament',
          registrationDate: '2024-03-02',
          status: 'registered',
          amount: 500,
        },
      ])
    } catch (err) {
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('userToken')
    router.push('/')
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <p className="text-foreground/60">Loading...</p>
        </div>
        <Footer />
      </main>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground">My Dashboard</h1>
              <p className="text-foreground/70 mt-2">Welcome back, {user.fullName}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                {/* Profile Header */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-accent-foreground">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">{user.fullName}</h2>
                </div>

                {/* Profile Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-foreground/60 text-sm mb-1">Email</p>
                    <p className="font-semibold text-foreground break-all">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-sm mb-1">College</p>
                    <p className="font-semibold text-foreground">{user.college}</p>
                  </div>
                  {user.phone && (
                    <div>
                      <p className="text-foreground/60 text-sm mb-1">Phone</p>
                      <p className="font-semibold text-foreground">{user.phone}</p>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-border"></div>

                {/* Edit Profile */}
                <button className="w-full px-6 py-2 bg-secondary text-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2">
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Registrations */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-foreground/60 text-sm mb-2">Total Registrations</p>
                  <p className="font-display text-3xl font-bold text-accent">{registrations.length}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-foreground/60 text-sm mb-2">Total Spent</p>
                  <p className="font-display text-3xl font-bold text-accent">
                    ₹{registrations.reduce((sum, r) => sum + r.amount, 0)}
                  </p>
                </div>
              </div>

              {/* Registrations List */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="font-display text-2xl font-bold text-foreground">My Registrations</h2>
                </div>

                {registrations.length > 0 ? (
                  <div className="divide-y divide-border">
                    {registrations.map((reg, index) => (
                      <div key={index} className="p-6 hover:bg-secondary/50 transition-colors">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground text-lg mb-2">{reg.eventName}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                              <div className="flex items-center gap-2">
                                <Clock size={16} />
                                {reg.registrationDate}
                              </div>
                              <div>
                                Status:{' '}
                                <span className="text-accent font-semibold capitalize">
                                  {reg.status === 'paid' ? 'Payment Completed' : 'Registered'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-foreground/60 text-sm">Amount Paid</p>
                              <p className="font-bold text-accent text-lg">₹{reg.amount}</p>
                            </div>
                            <div className="flex items-center gap-2 text-accent">
                              {reg.status === 'paid' ? (
                                <>
                                  <CheckCircle size={20} />
                                </>
                              ) : (
                                <Clock size={20} />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-3">
                          <Link
                            href={`/events/${reg.eventId}`}
                            className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                          >
                            View Event
                          </Link>
                          {reg.status === 'registered' && (
                            <button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
                              Complete Payment
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-foreground/60 mb-6">You haven't registered for any events yet.</p>
                    <Link
                      href="/events"
                      className="inline-block px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
                    >
                      Browse Events
                    </Link>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="bg-secondary/30 border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">Need Help?</h3>
                <p className="text-foreground/70 text-sm mb-4">
                  For any queries about your registrations or payments, contact our support team.
                </p>
                <Link href="/contact" className="text-accent hover:text-accent/80 text-sm font-medium">
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
