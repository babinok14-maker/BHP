import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import './LatestReports.css'

export default function LatestReports() {
  return (
    <section className="latest-reports section">
      <div className="container latest-reports__card">
        <div className="latest-reports__copy">
          <h2>Our latest reports</h2>
          <p className="latest-reports__subhead">
            Reflecting our long-term commitment to transparency.
          </p>
          <p className="latest-reports__body">
            Learn more about our achievements and financial, economic, social and
            environmental performance in BHP&rsquo;s Annual, Economic Contribution and
            Sustainability reports.
          </p>

          <div className="latest-reports__footer">
            <a href="#top" className="eyebrow-link latest-reports__read-more">
              <span>Read more</span>
              <ArrowRight size={16} />
            </a>
            <div className="latest-reports__pagination">
              <span>1 / 1</span>
              <button aria-label="Previous report"><ChevronLeft size={16} /></button>
              <button aria-label="Next report"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* This wrapper functions as a manual crop box */}
        <div className="latest-reports__image-crop-box">
          <img 
            src="https://www.bhp.com/-/media/project/bhp1ip/bhp-com-en/images/_secondary-banner/2023/230824_arbannerimage.png"
            className="latest-reports__cropped-img"
          />
        </div>
      </div>
    </section>
  )
}
