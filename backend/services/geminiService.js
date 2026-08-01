const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Clean error message extractor for Gemini API errors
const handleGeminiError = (error) => {
    const errStr = error?.message || error?.toString() || '';
    if (errStr.includes('429') || errStr.includes('Quota exceeded') || errStr.includes('rate-limits')) {
        return 'AI API daily limit reached. Please wait a minute or try again later.';
    }
    if (errStr.includes('404') || errStr.includes('not found')) {
        return 'AI model service unavailable. Please try again shortly.';
    }
    return 'Unable to process AI request. Please try again later.';
};

// 1. Generate Questions using Gemini AI
const generateInterviewQuestions = async (topic, difficulty, count = 10) => {
    try {
        const prompt = `Generate exactly ${count} ${difficulty}-level technical interview questions for topic: ${topic}.
Return strictly JSON format: { "questions": [{ "questionText": "..." }] }`;

        const result = await model.generateContent(prompt);
        let rawText = result.response.text();
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText);

        if (!data.questions || data.questions.length === 0) {
            throw new Error('No questions returned from AI.');
        }

        return data.questions.slice(0, count);
    } catch (error) {
        console.error("Gemini Questions Error:", error.message);
        throw new Error(handleGeminiError(error));
    }
};

// 2. Evaluate Answer using Gemini AI
const evaluateAnswer = async (topic, difficulty, questionText, userAnswer) => {
    try {
        const prompt = `Evaluate this answer for ${topic} (${difficulty}):
Question: ${questionText}
Answer: ${userAnswer}

Return strictly JSON format:
{
    "score": 8,
    "feedback": "Clear explanation.",
    "idealAnswer": "Expert model answer."
}`;

        const result = await model.generateContent(prompt);
        let rawText = result.response.text();
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(rawText);

        return {
            score: Math.min(10, Math.max(0, Number(data.score) || 0)),
            feedback: data.feedback || 'Answer evaluated.',
            idealAnswer: data.idealAnswer || 'Model answer not available.'
        };
    } catch (error) {
        console.error("Gemini Evaluation Error:", error.message);
        throw new Error(handleGeminiError(error));
    }
};

module.exports = { generateInterviewQuestions, evaluateAnswer };
