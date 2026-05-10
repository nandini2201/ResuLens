import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuLens" },
    { name: "description", content: "ATS scoring and resume feedback." },
  ];
}

export default function Home() {
  const { auth, isLoading, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const loadResumes = async () => {
      setLoadingResumes(true);
      const storedResumes = (await kv.list("resume:*", true)) as KVItem[] | undefined;
      const parsedResumes = storedResumes
        ?.map((resume) => JSON.parse(resume.value) as Resume)
        .filter((resume) => resume.feedback);

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };

    loadResumes();
  }, [auth.isAuthenticated, kv]);

  const averageScore = useMemo(() => {
    if (!resumes.length) return 0;
    const total = resumes.reduce((sum, resume) => sum + resume.feedback.overallScore, 0);
    return Math.round(total / resumes.length);
  }, [resumes]);

  const latestRole = resumes[0]?.jobTitle || "No active target";

  return (
    <main className="app-shell">
      <Navbar />

      <section className="dashboard-grid">
        <aside className="command-panel">
          <p className="eyebrow">ResuLens workspace</p>
          <h1>ATS scorecards for every resume draft.</h1>
          <p className="muted-copy">
            Upload a resume PDF and get a focused score report for the role you want.
          </p>
          <Link to="/upload" className="primary-button">
            Upload Resume
          </Link>

          <div className="metrics-strip">
            <div>
              <span>{resumes.length}</span>
              <p>Reports</p>
            </div>
            <div>
              <span>{averageScore || "--"}</span>
              <p>Average</p>
            </div>
            <div>
              <span>{latestRole}</span>
              <p>Latest role</p>
            </div>
          </div>
        </aside>

        <section className="library-panel">
          <div className="section-header">
            <div>
              <p className="eyebrow">Review queue</p>
              <h2>Resume reports</h2>
            </div>
            <Link to="/upload" className="secondary-button">
              New scan
            </Link>
          </div>

          {loadingResumes || isLoading ? (
            <div className="empty-state">
              <img src="/images/resume-scan-2.gif" alt="Scanning resume" />
              <p>Loading your reports...</p>
            </div>
          ) : resumes.length > 0 ? (
            <div className="resumes-section">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <img src="/images/pdf.png" alt="PDF file" />
              <h3>No reports yet</h3>
              <p>Your first ATS score will appear here after analysis.</p>
              <Link to="/upload" className="primary-button compact-button">
                Start first scan
              </Link>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
