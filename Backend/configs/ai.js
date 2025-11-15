const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const key = (process.env.OPENAI_API_KEY || "").trim();

const ai = new GoogleGenerativeAI(key);

module.exports = ai;
