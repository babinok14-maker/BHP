import { ImageIcon } from 'lucide-react'
import './Placeholder.css'

/**
 * Placeholder standing in for a real image.
 * Swap out by replacing this component's usage with an <img src="..." /> tag,
 * or pass a `src` prop through once real assets are ready.
 */
export default function Placeholder({ label = 'Image', ratio = '16 / 9', rounded = 0, className = '' }) {
  return (
    <div
      className={`placeholder-box ${className}`}
      style={{ aspectRatio: ratio, borderRadius: rounded }}
      role="img"
      aria-label={label}
    >
      <ImageIcon size={22} strokeWidth={1.5} />
      <span>{label}</span>
    </div>
  )
}
