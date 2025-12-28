import React, { useMemo } from "react";

const BRAND = "#E39B34";
const TINT = "rgba(227,155,52,0.12)";

export default function RatingBreakdown({ counts = {5:0,4:0,3:0,2:0,1:0} }) {
  const total = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);
  const rows = [5,4,3,2,1];

  return (
    <div className="space-y-2">
      {rows.map((star) => {
        const value = counts[star] || 0;
        const pct = total ? Math.round((value / total) * 100) : 0;
        return (
          <div key={star} className="flex items-center gap-2">
            <div className="w-8 text-sm text-slate-600">{star}★</div>
            <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: TINT }}>
              <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: BRAND }} />
            </div>
            <div className="w-10 text-right text-sm text-slate-600">{pct}%</div>
          </div>
        );
      })}
    </div>
  );
}
