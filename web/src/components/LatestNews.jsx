import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import './LatestNews.css'

const NEWS = [
  {
    tags: ['NEWS', 'SUSTAINABILITY'],
    title: 'Implementing copper cables with environmental value from lower GHG copper ore',
    image: 'https://www.bhp.com/-/media/publishing/3.png?w=712&hash=6536BE71E7038B5973F2A836BCABDAD1',
    src:'https://www.bhp.com/news/media-centre/releases/2026/07/implementing-copper-cables-with-environmental-value-from-lower-ghg-copper-ore',
  },
  {
    tags: ['NEWS'],
    title: 'Supporting community, culture and shared opportunities',
    image: 'https://www.bhp.com/-/media/publishing/260720_bhp-employees-at-back-to-batoche.jpg?w=712&hash=ADB81632762C7A1FA6BDFAA7DE4519E5',
  },
  {
    tags: ['NEWS'],
    title: 'BHP backs future of WA iron ore with Ministers North project approved',
    image: 'https://www.bhp.com/-/media/publishing/260716_ministers-north.png?w=712&hash=22B007BECA78C472C9F1B99127034C8F',
  },
]

export default function LatestNews() {
  return (
    <section className="latest-news section">
      <div className="container">
        <div className="latest-news__header">
          <h2>Latest news</h2>
          <a href="https://www.bhp.com/news/media-centre/releases/2026/07/implementing-copper-cables-with-environmental-value-from-lower-ghg-copper-ore" className="eyebrow-link latest-news__more">
            <span>More news</span> <ArrowRight size={16} />
          </a>
          <div className="latest-news__nav">
            <button aria-label="Previous news"><ChevronLeft size={18} /></button>
            <button aria-label="Next news"><ChevronRight size={18} /></button>
          </div>
        </div>

        <div className="latest-news__grid">
          {NEWS.map((item) => (
            <article className="news-card" key={item.title}>
              <div className="news-card__image-container">
                <img src={item.image} alt={item.title} className="news-card__image" />
              </div>
              
              <div className="news-card__overlay">
                <div className="news-card__tags-group">
                  {item.tags.map((tag, idx) => (
                    <span className="news-card__tag" key={idx}>{tag}</span>
                  ))}
                </div>
                
                <h3 className="news-card__title">{item.title}</h3>
                
                <span className="eyebrow-link news-card__link">
                  <span>Read more</span> <ArrowRight size={16} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
