import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "ResuLens | Report" },
  { name: "description", content: "ATS score report and resume feedback." },
];

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [resume, setResume] = useState<Resume | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [auth.isAuthenticated, id, isLoading, navigate]);

  useEffect(() => {
    if (!id || !auth.isAuthenticated) return;

    let imageObjectUrl = "";
    let resumeObjectUrl = "";

    const loadResume = async () => {
      const storedResume = await kv.get(`resume:${id}`);
      if (!storedResume) {
        navigate("/");
        return;
      }

      const data = JSON.parse(storedResume) as Resume;
      setResume(data);

      const resumeBlob = await fs.read(data.resumePath);
      if (resumeBlob) {
        const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
        resumeObjectUrl = URL.createObjectURL(pdfBlob);
        setResumeUrl(resumeObjectUrl);
      }

      const imageBlob = await fs.read(data.imagePath);
      if (imageBlob) {
        imageObjectUrl = URL.createObjectURL(imageBlob);
        setImageUrl(imageObjectUrl);
      }

      setFeedback(data.feedback);
    };

    loadResume();

    return () => {
      if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
      if (resumeObjectUrl) URL.revokeObjectURL(resumeObjectUrl);
    };
  }, [auth.isAuthenticated, fs, id, kv, navigate]);

  return (
    <main className="report-shell">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="" />
          <span>Dashboard</span>
        </Link>
        <Link to="/upload" className="secondary-button">New scan</Link>
      </nav>

      <div className="report-grid">
        <section className="preview-panel">
          <div className="section-header">
            <div>
              <p className="eyebrow">Resume preview</p>
              <h2>{resume?.jobTitle || "ATS report"}</h2>
            </div>
          </div>
          {imageUrl && resumeUrl ? (
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="resume-preview">
              <img src={imageUrl} alt="Uploaded resume preview" />
            </a>
          ) : (
            <div className="empty-state">
              <img src="/images/resume-scan-2.gif" alt="Loading resume preview" />
              <p>Loading preview...</p>
            </div>
          )}
        </section>

        <section className="feedback-panel">
          <div className="section-header">
            <div>
              <p className="eyebrow">{resume?.companyName || "Target company"}</p>
              <h1>Score report</h1>
            </div>
          </div>

          {feedback ? (
            <div className="report-stack animate-in fade-in duration-700">
              <Summary feedback={feedback} />
              <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
              <Details feedback={feedback} />
            </div>
          ) : (
            <div className="empty-state">
              <img src="/images/resume-scan.gif" alt="Loading ATS report" />
              <p>Loading feedback...</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
