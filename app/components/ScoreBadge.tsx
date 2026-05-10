interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  const badgeClass = score > 69 ? "badge-good" : score > 49 ? "badge-watch" : "badge-risk";
  const badgeText = score > 69 ? "Strong" : score > 49 ? "Tune" : "Fix";

  return (
    <span className={`score-badge ${badgeClass}`}>
      {badgeText}
    </span>
  );
};

export default ScoreBadge;
