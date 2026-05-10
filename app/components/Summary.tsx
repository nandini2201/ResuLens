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
        <ScoreGauge score={feedback.overallScore} />
        <div>
          <p className="eyebrow">Overall readiness</p>
          <h2>{feedback.overallScore}/100</h2>
          <p className="muted-copy">Composite score from tone, content, structure, skills, and ATS readability.</p>
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
