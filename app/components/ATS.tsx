import React from "react";
import { cn } from "~/lib/utils";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const state = score > 69 ? "strong" : score > 49 ? "watch" : "risk";
  const iconSrc =
    state === "strong"
      ? "/icons/ats-good.svg"
      : state === "watch"
        ? "/icons/ats-warning.svg"
        : "/icons/ats-bad.svg";
  const label = state === "strong" ? "ATS ready" : state === "watch" ? "Needs tuning" : "High friction";

  return (
    <section className={cn("ats-panel", `ats-${state}`)}>
      <div className="ats-head">
        <div>
          <p className="eyebrow">ATS score</p>
          <h2>{score}/100</h2>
          <span>{label}</span>
        </div>
        <img src={iconSrc} alt="" />
      </div>

      <div className="ats-tips">
        {suggestions.length ? (
          suggestions.map((suggestion, index) => (
            <div key={`${suggestion.tip}-${index}`} className="tip-row">
              <img
                src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt=""
              />
              <p>{suggestion.tip}</p>
            </div>
          ))
        ) : (
          <p className="muted-copy">No ATS notes returned for this report.</p>
        )}
      </div>
    </section>
  );
};

export default ATS;
