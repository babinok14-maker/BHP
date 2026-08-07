import { ArrowRight } from 'lucide-react'
import ceoImage from '../assets/brandon-headshot-web-author-image.avif'
import './CeoQuote.css'

export default function CeoQuote() {
  return (
    <div className="fl-quote-testimonial">
      <div className="quote-testimonial-container fl-container">
        <div className="quote-testimonial-card has-author">
          {/* CEO Headshot */}
          <div className="quote-testimonial-author">
            <img
              src={ceoImage}
              alt="Mike Henry"
              loading="lazy"
              width="300"
              height="300"
            />
          </div>

          <div className="quote-testimonial-content">
            <div className="author-content">
              <div className="author-quote">
                {/* Orange Quote Icon */}
                <div className="icon-quote">
                  <img
                    src="https://www.bhp.com/-/media/Project/BHP1IP/shared/fl-cta/quote/icon-quote-orange.svg"
                    alt="quote-icon"
                    width="40"
                    height="40"
                  />
                </div>
                "BHP is in tremendous shape. We have the people and the portfolio to deliver more of what the world needs – safely, productively and responsibly. Best of all, we still have so much more opportunity ahead of us. Together, we can build the resource projects the world needs and win the next decade."
              </div>

              <div className="author-card">
                <div className="author-name">Mike Henry <span className="author-position">CEO</span></div>
              </div>
            </div>

            <div className="cta-button">
              <a href="/news/articles/2026/06/a-message-from-ceo-mike-henry" className="f-normal">
                Read the CEO message
                <ArrowRight size={16} className="cta-arrow" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
