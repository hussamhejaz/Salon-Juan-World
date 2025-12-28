import React from "react";

const BRAND = "#E39B34";

export default function Stars({
  value = 0,
  size = 18,
  onChange,            // if provided, makes it interactive
  className = "",
  ariaLabel = "Rating",
}) {
  const stars = [1, 2, 3, 4, 5];
  const w = size, h = size;

  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`} aria-label={ariaLabel} role={onChange ? "radiogroup" : undefined}>
      {stars.map((s) => {
        const active = s <= Math.round(value);
        return (
          <button
            key={s}
            type="button"
            onClick={onChange ? () => onChange(s) : undefined}
            role={onChange ? "radio" : undefined}
            aria-checked={onChange ? active : undefined}
            className={onChange ? "p-0.5 focus:outline-none" : "pointer-events-none"}
            title={`${s}/5`}
            style={{ lineHeight: 0, cursor: onChange ? "pointer" : "default" }}
          >
            <svg width={w} height={h} viewBox="0 0 24 24"
                 fill={active ? BRAND : "none"}
                 stroke={active ? BRAND : "#cbd5e1"} strokeWidth="1.6">
              <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </button>
        );
      })}
    </div>
  );
}
