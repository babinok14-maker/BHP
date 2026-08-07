import { useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Positioning from './components/Positioning.jsx'
import CeoQuote from './components/CeoQuote.jsx'
import FeatureCards from './components/FeatureCards.jsx'
import InvestorHub from './components/InvestorHub.jsx'
import WhereWeOperate from './components/WhereWeOperate.jsx'
import WhatWeProduce from './components/WhatWeProduce.jsx'
import LatestNews from './components/LatestNews.jsx'
import LatestReports from './components/LatestReports.jsx'
import UpcomingEvents from './components/UpcomingEvents.jsx'
import ResultsSection from './components/ResultsSection.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="app">
      <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
      <main>
        <Hero />
        <Positioning />
        <CeoQuote />
        <FeatureCards />
        <InvestorHub />
        <WhereWeOperate />
        <WhatWeProduce />
        <LatestNews />
        <LatestReports />
        <UpcomingEvents />
        <ResultsSection searchTerm={searchTerm} />
      </main>
      <Footer />
    </div>
  )
}
