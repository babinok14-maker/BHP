import { Globe, ArrowRight } from "lucide-react";
import "./WhereWeOperate.css";
import globeImage from "../assets/globe.svg";

export default function WhereWeOperate() {
  return (
    <section className="where-we-operate section">
      <div className="container">
        <div className="where-we-operate__card">

          {/* Left Content */}
          <div className="where-we-operate__content">
            <Globe
              className="operate-icon"
              size={36} /* scaled down from 58 to match the image precisely */
              strokeWidth={1.5}
              color="#e76b00"
            />

            <h2>Where we operate</h2>

            <p>
              Did you know we work in more than 90 locations including
              Australia, South America, the United States and Canada?
            </p>

            <a href="https://www.google.com/maps/search/php++company+canada+toronto/@38.2729794,-96.6654651,3z?entry=ttu&g_ep=EgoyMDI2MDcyMC4wIKXMDSoASAFQAw%3D%3D" className="operate-link">
              <ArrowRight size={28} strokeWidth={2.2} />
            </a>
          </div>

          {/* Right Image Container */}
          <div className="where-we-operate__image">
            <img
              src={globeImage}
              alt="Global Operations Map"
              className="globe-img"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
