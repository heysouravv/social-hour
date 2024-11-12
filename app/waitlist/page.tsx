'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// Define types for OTPless SDK
type AuthChannel = 'PHONE' | 'EMAIL' | 'OAUTH'

interface InitiateParams {
  channel: AuthChannel
  phone?: string
  email?: string
  countryCode?: string
  channelType?: string
}

interface VerifyParams {
  channel: AuthChannel
  phone?: string
  email?: string
  otp: string
  countryCode?: string
}

interface OTPlessResponse {
  statusCode: number
  success: boolean
  responseType: string
  response: {
    phone?: string
    email?: string
    [key: string]: any
  }
}

declare global {
  interface Window {
    OTPless: any
    OTPlessSignin: {
      initiate: (params: InitiateParams) => Promise<void>
      verify: (params: VerifyParams) => Promise<void>
    }
  }
}

export default function EnhancedWaitlistSignup() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [area, setArea] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = (response: OTPlessResponse) => {
      console.log('Auth callback received:', response)
      setIsLoading(false)
      
      if (response.success && response.statusCode === 200) {
        setIsVerified(true)
        setUserInfo(response.response)
        setStep(4) // Move to success step
      } else {
        setError(`Verification failed: ${response.response?.message || 'Please try again'}`)
        setOtp('')
      }
    }

    const initializeSDK = () => {
      const script = document.createElement('script')
      script.id = 'otpless-sdk'
      script.src = 'https://otpless.com/v3/headless.js'
      script.setAttribute('data-appid', process.env.NEXT_PUBLIC_OTPLESS_APP_ID || 'F0XJ4Q40P0192Y9EIYXI')
      
      script.onload = () => {
        try {
          window.OTPlessSignin = new window.OTPless(handleAuthCallback)
          console.log('OTPless SDK initialized')
        } catch (error) {
          console.error('SDK initialization error:', error)
          setError('Failed to initialize authentication service')
        }
      }

      script.onerror = () => {
        console.error('Failed to load OTPless SDK')
        setError('Authentication service unavailable')
      }
      
      document.head.appendChild(script)
    }

    initializeSDK()

    return () => {
      const script = document.getElementById('otpless-sdk')
      if (script) {
        script.remove()
      }
    }
  }, [])

  const handleNameAreaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && area) {
      setStep(2)
    } else {
      setError('Please enter both name and area')
    }
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!phoneNumber || phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number')
      setIsLoading(false)
      return
    }

    if (!window.OTPlessSignin) {
      setError('Authentication service not ready. Please try again.')
      setIsLoading(false)
      return
    }

    try {
      const initiateParams: InitiateParams = {
        channel: "PHONE",
        phone: phoneNumber,
        countryCode: "+91"
      }

      await window.OTPlessSignin.initiate(initiateParams)
      setStep(3)
    } catch (error) {
      console.error('Phone auth error:', error)
      setError('Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      setIsLoading(false)
      return
    }

    if (!window.OTPlessSignin) {
      setError('Authentication service not ready. Please try again.')
      setIsLoading(false)
      return
    }

    try {
      const verifyParams: VerifyParams = {
        channel: "PHONE",
        phone: phoneNumber,
        otp: otp,
        countryCode: "+91"
      }

      await window.OTPlessSignin.verify(verifyParams)
      // Response will be handled by the callback
    } catch (error) {
      console.error('OTP verification error:', error)
      setError('Failed to verify OTP. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg"
            alt="House party atmosphere"
            layout="fill"
            objectFit="cover"
            className="brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center min-h-screen p-6 max-w-md mx-auto w-full">
          <div className="space-y-8">
            {step === 1 && (
              <form onSubmit={handleNameAreaSubmit} className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Join the Waitlist</h2>
                  <p className="text-gray-400">Tell us a bit about yourself</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Area or Neighborhood</Label>
                    <Input
                      id="area"
                      type="text"
                      placeholder="e.g., South Delhi, Gurgaon"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-500"
                      required
                    />
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white">
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Verify Your Number</h2>
                  <p className="text-gray-400">Enter your phone number to get started</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-white/20 bg-white/10 text-gray-400">
                      +91
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-500 rounded-l-none"
                      required
                      maxLength={10}
                      pattern="[0-9]{10}"
                    />
                  </div>
                  <p className="text-xs text-gray-400">Enter 10-digit mobile number</p>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Verification Code'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Enter OTP</h2>
                  <p className="text-gray-400">We've sent a code to +91 {phoneNumber}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-500"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Change Number
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    onClick={handlePhoneSubmit}
                    disabled={isLoading}
                  >
                    Resend OTP
                  </Button>
                </div>
              </form>
            )}

            {step === 4 && (
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <div className="bg-green-500 rounded-full p-3">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">You're on the List!</h2>
                  <p className="text-gray-400">We'll let you know when Social Hour launches in your area.</p>
                </div>
                <div className="text-left bg-white/10 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Your Information:</h3>
                  <p>Name: {name}</p>
                  <p>Area: {area}</p>
                  <p>Phone: {phoneNumber}</p>
                </div>
                <Button
                  type="button"
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => router.push('/')}
                >
                  Back to Home
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}