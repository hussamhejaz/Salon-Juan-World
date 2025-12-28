import React from "react";
import Stars from "./Stars";

export default function ReviewCard({
  name,
  date,
  rating,
  text,
  photos = [],        // array of image URLs
  helpful = 0,
  onHelpful,          // () => void
}) {
  return (
    <article className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
             style={{ borderColor: "rgba(227,155,52,0.12)" }}>
      <header className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-slate-900">{name}</div>
          <div className="text-xs text-slate-500 mt-0.5">{date}</div>
        </div>
        <Stars value={rating} />
      </header>

      {text && <p className="mt-3 text-sm leading-6 text-slate-700">{text}</p>}

      {photos.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {photos.map((src, i) => (
            <img key={i} src={src} alt="" className="h-24 w-full object-cover rounded-lg border"
                 style={{ borderColor: "rgba(227,155,52,0.12)" }}/>
          ))}
        </div>
      )}

      <footer className="mt-4 flex items-center gap-3 text-sm">
        <button
          type="button"
          onClick={onHelpful}
          className="rounded-full border px-3 py-1.5 transition hover:shadow"
          style={{ borderColor: "rgba(227,155,52,0.25)" }}
        >
          👍 {helpful}
        </button>
      </footer>
    </article>
  );
}
