const ai = require("../configs/ai");
const resumeModel = require("../models/resumeModel");
const dotenv = require("dotenv");
dotenv.config();

// controller for enhancing a resume's professional summary
//POST : /api/ai/enhace-pro-sum
const enhaceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Initialize Gemini Model
    const model = ai.getGenerativeModel({
      model: process.env.OPENAI_MODEL || "gemini-2.0-flash",
    });

    // Generate summary enhancement
    const response = await model.generateContent({
      contents: [
        {
          parts: [
            {
              text:
                "You are an expert in resume writing. Enhance the following professional summary into a compelling, ATS-friendly, 1–2 sentence statement that highlights key skills, experience, and career objectives. Only return the improved summary.\n\n" +
                userContent
            }
          ]
        }
      ]
    });

    const enhanceContent = response.response.text();

    if (!enhanceContent) {
      return res.status(500).json({ message: "AI returned no content" });
    }

    return res.status(200).json({ enhanceContent });

  } catch (error) {
    console.error("AI ERROR (Summary):", error);
    return res.status(500).json({
      message: "AI failed",
      error: error.message,
    });
  }
};


// controller for enhancing a resume's job desciption
//POST : /api/ai/enhance-job-desc
const enhanceJobDescripion = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "userContent is required" });
    }

    // Initialize model
    const model = ai.getGenerativeModel({
      model: process.env.OPENAI_MODEL || "gemini-2.0-flash",
    });

    // Generate content
    const response = await model.generateContent({
      contents: [
        {
          parts: [
            {
              text:
                "You are an expert in resume writing. Enhance the job description into 1–2 ATS-friendly sentences using action verbs, measurable achievements, and responsibilities. Return only the improved sentence.\n\n" +
                userContent
            }
          ]
        }
      ]
    });

    const enhanceContent = response.response.text();

    if (!enhanceContent) {
      return res.status(500).json({ message: "AI returned no content" });
    }

    return res.status(200).json({ enhanceContent });

  } catch (error) {
    console.error("AI ERROR:", error);
    return res.status(500).json({ message: "AI failed", error: error.message });
  }
};

// controller for uploading the resume to the database
//POST : /api/ai/upload-resume
const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const model = ai.getGenerativeModel({
      model: process.env.OPENAI_MODEL || "gemini-2.0-flash",
    });

    // --- SYSTEM + USER PROMPT MERGED FOR GEMINI ---
    const prompt = `
You are an expert AI agent for extracting structured data from resumes.

Extract data ONLY in strict JSON format with NO extra text before or after.
Do NOT include explanations.

Here is the resume text:
"${resumeText}"

Return JSON in the following schema:

{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": ""
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduation_date": "",
      "gpa": ""
    }
  ]
}

Return ONLY valid JSON.
    `;

    // --- GEMINI JSON MODE ---
    const response = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        response_mime_type: "application/json"
      }
    });

    const raw = response.response.text();

    // --- SAFELY PARSE JSON ---
    let parsedData;
    try {
      parsedData = JSON.parse(raw);
    } catch (err) {
      console.error("Invalid JSON from AI:", raw);
      return res.status(500).json({
        message: "AI returned invalid JSON",
        rawOutput: raw
      });
    }

    // --- SAVE TO DATABASE ---
    const newResume = await resumeModel.create({
      userId,
      title,
      ...parsedData,
    });

    return res.json({ resumeId: newResume._id });

  } catch (error) {
    console.error("AI ERROR uploadResume:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {enhanceJobDescripion, enhaceProfessionalSummary, uploadResume}
