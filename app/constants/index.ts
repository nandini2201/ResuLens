export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "3",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "4",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "5",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "6",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
];

export const AIResponseFormat = `{
  "overallScore": 0,
  "ATS": {
    "score": 0,
    "tips": [
      { "type": "good", "tip": "Short ATS strength" },
      { "type": "improve", "tip": "Short ATS improvement" }
    ]
  },
  "toneAndStyle": {
    "score": 0,
    "tips": [
      { "type": "good", "tip": "Short title", "explanation": "Detailed explanation" },
      { "type": "improve", "tip": "Short title", "explanation": "Detailed explanation" }
    ]
  },
  "content": {
    "score": 0,
    "tips": [
      { "type": "good", "tip": "Short title", "explanation": "Detailed explanation" },
      { "type": "improve", "tip": "Short title", "explanation": "Detailed explanation" }
    ]
  },
  "structure": {
    "score": 0,
    "tips": [
      { "type": "good", "tip": "Short title", "explanation": "Detailed explanation" },
      { "type": "improve", "tip": "Short title", "explanation": "Detailed explanation" }
    ]
  },
  "skills": {
    "score": 0,
    "tips": [
      { "type": "good", "tip": "Short title", "explanation": "Detailed explanation" },
      { "type": "improve", "tip": "Short title", "explanation": "Detailed explanation" }
    ]
  }
}`;

export const prepareInstructions = ({
      companyName,
      jobTitle,
      jobDescription
    }: {
      companyName?: string;
      jobTitle: string;
      jobDescription: string;
    }) =>
    `You are an expert in ATS (Applicant Tracking System) and resume analysis.
      Please analyze and rate this resume and suggest how to improve it for the target role.
      The rating can be low if the resume is bad.
      Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
      If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
      If available, use the job description and company context to give more detailed feedback.
      Target company: ${companyName || "Not provided"}
      Target job title: ${jobTitle || "Not provided"}
      Target job description: ${jobDescription || "Not provided"}
      Put extra emphasis on the ATS section. The ATS score should reflect keyword match, format readability, section clarity, role relevance, and recruiter searchability.
      Provide the feedback using this exact JSON key structure:
      ${AIResponseFormat}
      Return only one valid JSON object. Use double quotes for every key and string value.
      Do not include markdown fences, backticks, comments, trailing commas, prose, or any text outside the JSON.
      Every category should include 3-4 useful tips.`;
