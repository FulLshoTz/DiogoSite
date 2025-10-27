import React, { useEffect, useState } from "react"
import Header from "./components/Header"
import Navbar from "./components/Navbar"
import YouTubeSection from "./components/YouTubeSection"
import "./index.css"

export default function App() {
  return (
    <div className="min-h-screen bg-carbon text-white">
      <Header />
      <Navbar />
      <main className="p-4 md:p-8">
        <YouTubeSection />
      </main>
    </div>
  )
}
