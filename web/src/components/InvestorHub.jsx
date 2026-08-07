import { useState } from 'react'
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'
import './InvestorHub.css'

const EXCHANGES = ['ASX', 'LSE', 'NYSE (Ltd ADR)', 'JSE']

// 👇 Values updated to match the exact data displayed in the reference image
const PRICE_BY_EXCHANGE = {
  ASX: { price: '60.63', change: '+1.46%', currency: 'AUD', timestamp: '2026-07-24 04:44:09 AEST', isPositive: true },
  LSE: { price: '21.36', change: '-1.98%', currency: 'GBP', timestamp: '2026-07-24 04:44:09 BST', isPositive: false },
  'NYSE (Ltd ADR)': { price: '54.02', change: '-2.20%', currency: 'USD', timestamp: '2026-07-24 04:44:09 EST', isPositive: false },
  JSE: { price: '612.40', change: '-2.05%', currency: 'ZAR', timestamp: '2026-07-24 04:44:09 SAST', isPositive: false },
}

export default function InvestorHub() {
  const [exchange, setExchange] = useState('ASX')
  const data = PRICE_BY_EXCHANGE[exchange]

  return (
    <section className="investor-hub section">
      <div className="container">
        <div className="investor-hub__grid">
          
          {/* Left Side Image Block */}
          <div className="investor-hub__image">
            <img 
              src="https://www.bhp.com/-/media/project/bhp1ip/bhp1ip-en/fl-home/sustainability-bg.png" 
              alt="Workers with hardhats walking next to industrial solar field arrays" 
            />
          </div>

          {/* Middle Card Area */}
          <div className="investor-hub__card">
            {/* Custom vector representation of the original logo group badge asset */}
            <div className="investor-hub__custom-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="34" height="34" stroke="#e76b00" strokeWidth="1.5" fill="none">
                <circle cx="12" cy="7" r="3" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                <circle cx="12" cy="14" r="7" strokeDasharray="3 2" />
              </svg>
            </div>
            
            <h3>Investor hub</h3>
            <p>
              Everything you need to know as an investor including financial reports,
              Operational reviews, upcoming events, dividend information, and frequently
              asked questions.
            </p>
            
            <a href="#top" className="investor-hub__cta-link" aria-label="Go to investor hub">
              <ArrowRight size={22} strokeWidth={2.5} />
            </a>
          </div>

          {/* Right Ticker Block Container */}
          <div className="investor-hub__ticker">
            <div className="ticker__tabs" role="tablist" aria-label="Stock exchange">
              {EXCHANGES.map((ex) => (
                <button
                  key={ex}
                  role="tab"
                  aria-selected={exchange === ex}
                  className={`ticker__tab ${exchange === ex ? 'is-active' : ''}`}
                  onClick={() => setExchange(ex)}
                >
                  {ex}
                </button>
              ))}
            </div>

            <div className="ticker__body">
              <p className="ticker__price">{data.price}</p>
              
              <p className="ticker__label">
                BHP Group Ltd (BHP), Price displayed <br /> in {data.currency}:
              </p>

              {/* 👇 Render states change color themes dynamically based on current market parameters */}
              <p className={`ticker__change ${data.isPositive ? 'is-up' : 'is-down'}`}>
                {data.isPositive ? <TrendingUp size={18} fill="currentColor" /> : <TrendingDown size={18} fill="currentColor" />} 
                <span>{data.change}</span>
              </p>

              <p className="ticker__timestamp">
                As of {data.timestamp}
              </p>
              <p className="ticker__currency">Price displayed in {data.currency}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
