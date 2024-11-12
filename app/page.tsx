'use client'

import { ArrowRight, Users, Sparkles, MessageSquare, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const features = [
    {
      icon: <Home className="w-6 h-6 text-red-400" />,
      title: "Get Invited",
      description: "Receive invitations to exclusive house parties"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-red-400" />,
      title: "Perfect Timing",
      description: "Meet someone new when the moment feels right"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-red-400" />,
      title: "Start Chatting",
      description: "Use our helpful conversation starters"
    }
  ]

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">We are not there yet</h1>
          <p className="text-xl">Please view this page on a mobile device.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg"
            alt="House party atmosphere"
            width={1920}
            height={1080}
            className="object-cover brightness-50 w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between min-h-screen p-6 max-w-md mx-auto w-full">
          <div className={`pt-12 space-y-6 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block bg-red-500/20 px-4 py-2 rounded-full">
              <span className="text-red-400 font-medium">Social Hour</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight">
              Meet New People at House Parties, Naturally
            </h1>
            <p className="text-xl text-gray-300">
              Simple, friendly, and comfortable - exactly how meeting people should be.
            </p>
          </div>

          <div className={`space-y-8 py-12 transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 bg-white/5 p-4 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
                  <div className="bg-white/10 p-3 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`space-y-8 pb-8 transition-all duration-1000 delay-600 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4">How it works:</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Get invited to a house party</li>
                <li>Enjoy the party as usual</li>
                <li>When the moment's right, meet someone new</li>
                <li>Start chatting with our helpful conversation starters</li>
              </ol>
            </div>
            
            <div className="flex items-center justify-center space-x-4 bg-white/5 py-4 px-6 rounded-xl backdrop-blur-sm">
              <div className="flex -space-x-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-600 border-2 border-black ring-2 ring-red-500 transition-all duration-300 hover:scale-110">
                    <Image
                      src={`/placeholder.svg?text`}
                      alt={``}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                <span className="text-white font-medium">2,400+</span> people already joined
              </p>
            </div>
            
            <div className="space-y-4">
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full h-12 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30">
                Join Social Hour
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-center text-sm text-gray-400">
                Trusted hosts, natural connections
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}