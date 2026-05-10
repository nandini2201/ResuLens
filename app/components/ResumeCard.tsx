import { Link } from "react-router";
import { useEffect, useState } from "react";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    if (!imagePath) return;

    let objectUrl = "";

    const loadResume = async () => {
      if (imagePath.startsWith("/images/")) {
        setResumeUrl(imagePath);
        return;
      }

      const blob = await fs.read(imagePath);
      if (!blob) return;
      objectUrl = URL.createObjectURL(blob);
      setResumeUrl(objectUrl);
    };

    loadResume();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fs, imagePath]);

  return (
    <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-700">
      <div className="resume-card-header">
        <div>
          <p>{companyName || "Open target"}</p>
          <h3>{jobTitle || "Resume report"}</h3>
        </div>
        <ScoreCircle score={feedback.ATS.score} />
      </div>
      <div className="resume-card-preview">
        {resumeUrl ? (
          <img src={resumeUrl} alt="Resume preview" />
        ) : (
          <img src="/images/resume-scan-2.gif" alt="Loading resume preview" />
        )}
      </div>
    </Link>
  );
};

export default ResumeCard;
