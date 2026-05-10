import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { prepareInstructions } from "~/constants";
import { convertPdfToImage, extractTextFromPdf } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

export const meta = () => [
  { title: "ResuLens | Upload" },
  { name: "description", content: "Upload a resume for ATS analysis." },
];

const getFeedbackText = (feedback: AIResponse) => {
  const content = feedback.message?.content;

  if (typeof content === "string") return content;
  if (!Array.isArray(content)) {
    throw new Error("The analyzer returned an invalid response. Please try again.");
  }

  const textPart = content.find((part) => typeof part?.text === "string");
  if (!textPart?.text) {
    throw new Error("The analyzer did not return readable feedback.");
  }

  return textPart.text;
};

const extractJsonPayload = (text: string) => {
  const withoutFence = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const firstBrace = withoutFence.indexOf("{");
  const lastBrace = withoutFence.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace >= firstBrace) {
    return withoutFence.slice(firstBrace, lastBrace + 1);
  }

  return withoutFence;
};

const parseFeedbackText = (text: string): Feedback => {
  const payload = extractJsonPayload(text);

  try {
    return JSON.parse(payload) as Feedback;
  } catch {
    const withoutTrailingCommas = payload.replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(withoutTrailingCommas) as Feedback;
  }
};

interface AIClient {
  chat: (
    prompt: string | ChatMessage[],
    imageURL?: string | PuterChatOptions,
    testMode?: boolean,
    options?: PuterChatOptions
  ) => Promise<AIResponse | undefined>;
}

const repairFeedbackJson = async (invalidText: string, ai: AIClient): Promise<Feedback> => {
  const repairPrompt = `Convert the following malformed resume feedback into one valid JSON object. Return only valid JSON, with double-quoted keys and strings, no markdown, no comments, and no trailing commas. Preserve the same content and exact top-level keys: overallScore, ATS, toneAndStyle, content, structure, skills.

Malformed feedback:
${extractJsonPayload(invalidText)}`;
  const models = ["gpt-5-nano", "x-ai/grok-4-1-fast", "x-ai/grok-4.3"];
  let lastError = "";

  for (const model of models) {
    try {
      const repaired = await ai.chat(repairPrompt, { model, temperature: 0 });
      if (!repaired) continue;
      return parseFeedbackText(getFeedbackText(repaired));
    } catch (error) {
      lastError = error instanceof Error ? error.message : "JSON repair failed.";
    }
  }

  throw new Error(`The analyzer returned malformed JSON and repair failed. ${lastError}`.trim());
};

const steps = ["Upload", "Preview", "Analyze", "Report"];

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const canAnalyze = useMemo(() => Boolean(file) && auth.isAuthenticated, [auth.isAuthenticated, file]);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/upload");
    }
  }, [auth.isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (location.hash !== "#resume-upload") return;

    const scrollTimer = window.setTimeout(() => {
      document.getElementById("resume-upload")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 80);

    return () => window.clearTimeout(scrollTimer);
  }, [location.hash]);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const updateStatus = (step: number, status: string) => {
    setActiveStep(step);
    setStatusText(status);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    try {
      setIsProcessing(true);

      updateStatus(0, "Uploading resume PDF...");
      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile) throw new Error("Failed to upload the resume PDF.");

      updateStatus(1, "Creating report preview...");
      const imageFile = await convertPdfToImage(file);
      if (!imageFile.file) throw new Error(imageFile.error || "Failed to create the resume preview.");

      const uploadedImage = await fs.upload([imageFile.file]);
      if (!uploadedImage) throw new Error("Failed to upload the resume preview.");

      updateStatus(2, "Reading resume text...");
      let resumeText = await extractTextFromPdf(file);

      if (resumeText.trim().length < 80) {
        updateStatus(2, "Reading scanned resume text...");
        const ocrText = await ai.img2txt(imageFile.file);
        resumeText = [resumeText, ocrText].filter(Boolean).join("\n\n");
      }

      if (resumeText.trim().length < 80) {
        throw new Error("Could not read enough text from this PDF. Try uploading a text-based resume PDF instead of a scanned image.");
      }

      updateStatus(2, "Generating ATS score...");
      const uuid = generateUUID();
      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        createdAt: new Date().toISOString(),
        feedback: "",
      };

      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      const feedback = await ai.feedback(
        resumeText,
        prepareInstructions({ companyName, jobTitle, jobDescription })
      );
      if (!feedback) throw new Error("The analyzer did not return feedback.");

      const feedbackText = getFeedbackText(feedback);
      let parsedFeedback: Feedback;

      try {
        parsedFeedback = parseFeedbackText(feedbackText);
      } catch {
        updateStatus(2, "Repairing ATS report format...");
        parsedFeedback = await repairFeedbackJson(feedbackText, ai);
      }

      const completedResume = {
        ...data,
        feedback: parsedFeedback,
      };

      await kv.set(`resume:${uuid}`, JSON.stringify(completedResume));
      updateStatus(3, "Report ready.");
      navigate(`/resume/${uuid}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong while analyzing.";
      setStatusText(message);
      setIsProcessing(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!auth.isAuthenticated) {
      navigate("/auth?next=/upload");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) {
      setStatusText("Choose a PDF resume before starting the scan.");
      return;
    }

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="app-shell">
      <Navbar />
      <section className="upload-grid">
        <aside className="scan-panel">
          <p className="eyebrow">ATS intake</p>
          <h1>Upload a resume. Get a scorecard.</h1>
          <div className="step-list">
            {steps.map((step, index) => (
              <div className={index <= activeStep ? "step-item step-active" : "step-item"} key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
          {isProcessing ? (
            <div className="scan-status">
              <img src="/images/resume-scan.gif" alt="Resume scan in progress" />
              <p>{statusText}</p>
            </div>
          ) : (
            <p className="muted-copy">
              Match the PDF against a target role so the ATS score reflects the job, not just a generic resume checklist.
            </p>
          )}
        </aside>

        <section className="form-panel">
          <div className="section-header">
            <div>
              <p className="eyebrow">New report</p>
              <h2>Resume details</h2>
            </div>
          </div>

          <form id="upload-form" onSubmit={handleSubmit}>
            <div className="field-grid">
              <div className="form-div">
                <label htmlFor="company-name">Company</label>
                <input type="text" name="company-name" placeholder="Example: Adobe" id="company-name" />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Target role</label>
                <input type="text" name="job-title" placeholder="Example: Product Designer" id="job-title" />
              </div>
            </div>

            <div className="form-div">
              <label htmlFor="job-description">Job description</label>
              <textarea rows={7} name="job-description" placeholder="Paste the role requirements, skills, and responsibilities." id="job-description" />
            </div>

            <div className="form-div upload-anchor" id="resume-upload" tabIndex={-1}>
              <label htmlFor="uploader">Resume PDF</label>
              <FileUploader onFileSelect={handleFileSelect} disabled={isProcessing} />
            </div>

            {statusText && !isProcessing && <p className="form-status">{statusText}</p>}

            <button className="primary-button" type="submit" disabled={isProcessing || !canAnalyze}>
              {isProcessing ? "Analyzing..." : "Generate ATS Score"}
            </button>
          </form>
        </section>
      </section>
    </main>
  );
};

export default Upload;
