const ScoreCircle = ({ score = 75 }: { score: number }) => {
  const color = score > 69 ? "#14795f" : score > 49 ? "#b7791f" : "#c2413b";

  return (
    <div
      className="score-circle"
      style={{ background: `conic-gradient(${color} ${score * 3.6}deg, #e2e8e4 0deg)` }}
    >
      <span>{score}</span>
    </div>
  );
};

export default ScoreCircle;
