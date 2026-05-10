import ScoreBadge from "~/components/ScoreBadge";
import ScoreGauge from "~/components/ScoreGauge";

const Category = ({ title, score }: { title: string; score: number }) => {
  return (
    <div className="summary-category">
      <div>
        <p>{title}</p>
        <ScoreBadge score={score} />
      </div>
      <strong>{score}</strong>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <section className="summary-panel">
      <div className="score-feature">
        <ScoreGauge score={feedback.ATS.score} />
        <div>
          <p className="eyebrow">ATS score</p>
          <h2>{feedback.ATS.score}/100</h2>
          <p className="muted-copy">Single score based on keyword match, format readability, role relevance, and recruiter searchability.</p>
        </div>
      </div>

      <div className="summary-categories">
        <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
        <Category title="Content" score={feedback.content.score} />
        <Category title="Structure" score={feedback.structure.score} />
        <Category title="Skills" score={feedback.skills.score} />
      </div>
    </section>
  );
};

export default Summary;
