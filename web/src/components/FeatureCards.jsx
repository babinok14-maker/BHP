import { ArrowRight } from 'lucide-react'
import cardImage from '../assets/images.jpg'
import careerImage from '../assets/images1.jpg'
import shareholderImage from '../assets/images3.jpg'
import './FeatureCards.css'

const CARDS = [
  {
    title: 'Making a positive difference',
    text: 'Sustainability is at the core of everything we do, from the way we work to the value we provide to communities.',
    image: cardImage,
  },
  {
    title: 'Delivering for shareholders',
    text: 'Over the last 12 months our teams have delivered strong and, in some cases, record production. Learn more about our performance.',
    image: shareholderImage,
  },
  {
    title: 'A career with BHP',
    text: "If you're looking for a rewarding career that's part of something bigger, BHP could be the place for you.",
    image: careerImage,
  },
]

export default function FeatureCards() {
  return (
    <div className="feature-cards-wrapper">
      {CARDS.map(({ title, text, image }) => (
        <div key={title} className="fl-positive-difference-card">
          {/* Content Container */}
          <div className="card-content-wrapper">
            <div className="card-inner">
              <h2 className="h2">{title}</h2>
              <p>{text}</p>
              <a href="#" className="card-arrow-link" aria-label={`Learn more about ${title}`}>
      <span>Learn more</span> <ArrowRight size={18} strokeWidth={2.5} />
    </a>
            </div>
          </div>

          {/* Image Container */}
          <div className="card-image-wrapper">
            <img
              src={image}
              alt="Workers at site"
              className="img-fluid"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
