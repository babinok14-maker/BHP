import { useState } from 'react'
import { Pickaxe, ArrowRight } from 'lucide-react'
import './WhatWeProduce.css'

// Product description data registry
const PRODUCTS = {
  Copper: 'Copper has electricity conducting, corrosion resistance and antimicrobial properties and is used in everyday household products.',
  'Iron ore': 'Iron ore is the key ingredient in steel, the backbone of buildings, bridges, cars and appliances the world relies on every day.',
  'Steelmaking coal': 'Steelmaking coal is a critical input for the blast furnace process that turns iron ore into the steel used in infrastructure.',
  Potash: 'Potash is a natural fertiliser that helps farmers grow more food, more sustainably, on the same amount of land.',
}

// Absolute asset mapping table to handle manual resource transitions
const PRODUCT_IMAGES = {
  Copper: 'https://www.bhp.com/~/media/images/2019/191114_escondidacopper',
  'Iron ore': 'https://www.bhp.com/~/media/project/bhp1ip/bhp-com-en/images/content%20tiles/2021/210603_handswithironore_3up%20(1)',
  'Steelmaking coal': 'https://www.bhp.com/~/media/project/bhp1ip/bhp-com-en/images/content%20tiles/2021/210610_coalinpipeline_3up',
  Potash: 'https://www.bhp.com/~/media/project/bhp1ip/bhp-com-en/images/content%20tiles/2021/210610_potash_3up'
}

export default function WhatWeProduce() {
  const [active, setActive] = useState('Copper')

  return (
    <section className="what-we-produce section" id="what-we-produce">
      <div className="container">
        <div className="what-we-produce__intro">
          <Pickaxe size={28} strokeWidth={1.6} color="var(--bhp-orange)" />
          <h2>What we produce</h2>
          <p>
            Copper for renewable energy. Iron ore and metallurgical coal for steel for
            new infrastructure. And potash to support more sustainable farming.
          </p>
          <a href="#top" className="eyebrow-link">
            <span>Products</span> <ArrowRight size={16} />
          </a>
        </div>

        <div className="what-we-produce__tabs" role="tablist" aria-label="Products">
          {Object.keys(PRODUCTS).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={active === tab}
              className={`product-tab ${active === tab ? 'is-active' : ''}`}
              onClick={() => setActive(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="what-we-produce__panel">
          <div className="what-we-produce__text-wrapper">
            <p>{PRODUCTS[active]}</p>
            
            {/* 👇 Added only the 'Find out more' link and arrow helper element here */}
            <a href="#top" className="what-we-produce__find-more">
              <span>Find out more</span> <ArrowRight size={16} />
            </a>
          </div>
          
          {/* 👇 Replaced placeholder component with responsive cropping image box */}
          <div className="what-we-produce__image-crop-box">
            <img 
              src={PRODUCT_IMAGES[active]} 
              alt={`${active} resource production process`} 
              className="what-we-produce__cropped-img"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
