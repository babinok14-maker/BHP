import { ArrowRight } from 'lucide-react'
import './UpcomingEvents.css'

const EVENTS = [
  { day: '18', month: 'AUG', year: '2026', title: 'BHP Results', desc: 'for the year ended 30 June 2026' },
  { day: '20', month: 'OCT', year: '2026', title: 'BHP Operational Review', desc: 'for the quarter ended 30 September 2026' },
]

export default function UpcomingEvents() {
  return (
    <section className="upcoming-events section">
      <div className="container">
        <div className="upcoming-events__header">
          <h2>Upcoming Events</h2>
          <a href="#top" className="eyebrow-link">
            Events <ArrowRight size={16} />
          </a>
        </div>

        <div className="upcoming-events__grid">
          {EVENTS.map((event) => (
            <div className="event-card" key={event.title}>
              <div className="event-card__date">
                <span className="event-card__day">{event.day}</span>
                <span className="event-card__month">{event.month}</span>
                <span className="event-card__year">{event.year}</span>
              </div>
              <div className="event-card__body">
                <h3>{event.title}</h3>
                <p>{event.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
