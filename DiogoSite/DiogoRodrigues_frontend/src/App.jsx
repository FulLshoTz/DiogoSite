import React from 'react'
import YouTubeSection from './components/YouTubeSection'
import StatsSection from './components/StatsSection'
import Header from './components/Header'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex flex-col items-center px-4 py-8 space-y-12">
        <YouTubeSection />
        <StatsSection />
      </main>
    </div>
  )
}
