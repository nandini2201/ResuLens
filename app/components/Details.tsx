import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <span
      className={cn(
        "detail-score",
        score > 69 ? "detail-good" : score > 49 ? "detail-watch" : "detail-risk"
      )}
    >
      {score}/100
    </span>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="detail-header">
      <p>{title}</p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
    <div className="detail-content">
      {tips.map((tip, index) => (
        <div
          key={`${tip.tip}-${index}`}
          className={cn("detail-tip", tip.type === "good" ? "tip-good" : "tip-improve")}
        >
          <img src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"} alt="" />
          <div>
            <p>{tip.tip}</p>
            <span>{tip.explanation}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <section className="details-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Deep review</p>
          <h2>Category notes</h2>
        </div>
      </div>
      <Accordion defaultOpen="content">
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader title="Tone & Style" categoryScore={feedback.toneAndStyle.score} />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader title="Content" categoryScore={feedback.content.score} />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader title="Structure" categoryScore={feedback.structure.score} />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader title="Skills" categoryScore={feedback.skills.score} />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default Details;
