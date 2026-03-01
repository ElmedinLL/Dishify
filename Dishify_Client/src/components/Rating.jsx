import { useState } from "react"

export default function Rating({
  value = 0,
  max = 5,
  readonly = false,
  onRatingChange,
  size = "1rem",
}) {
  const [hoverValue, setHoverValue] = useState(0)
  const displayValue = hoverValue || value

  const handleClick = (rating) => {
    if (!readonly && onRatingChange) {
      onRatingChange(rating)
    }
  }

  const handleMouseEnter = (rating) => {
    if (!readonly) setHoverValue(rating)
  }

  const handleMouseLeave = () => {
    if (!readonly) setHoverValue(0)
  }

  return (
    <div
      className="d-flex gap-1"
      style={{ fontSize: size }}
      onMouseLeave={handleMouseLeave}
    >
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1
        const filled = starValue <= displayValue
        return (
          <span
            key={starValue}
            role={readonly ? "img" : "button"}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            tabIndex={readonly ? undefined : 0}
            onKeyDown={(e) => {
              if (!readonly && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault()
                handleClick(starValue)
              }
            }}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            style={{
              cursor: readonly ? "default" : "pointer",
              color: filled ? "#ffc107" : "#dee2e6",
              transition: "color 0.15s",
            }}
          >
            ★
          </span>
        )
      })}
    </div>
  )
}
