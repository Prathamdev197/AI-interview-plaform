const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Verified, active Free Tier models tested live against Google Gemini API
const MODEL_CHAIN = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite'
];

// Helper to attempt content generation across model fallback chain
const generateWithFallback = async (prompt) => {
    let lastError = null;
    
    for (const modelName of MODEL_CHAIN) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (err) {
            console.log(`Model ${modelName} attempt failed: ${err.message}. Trying next model in chain...`);
            lastError = err;
        }
    }
    throw lastError;
};

// Clean error message extractor for Gemini API errors
const handleGeminiError = (error) => {
    const errStr = error?.message || error?.toString() || '';
    if (errStr.includes('429') || errStr.includes('Quota exceeded') || errStr.includes('rate-limits')) {
        return 'AI API daily limit reached across all models. Please wait a minute and try again.';
    }
    if (errStr.includes('404') || errStr.includes('not found')) {
        return 'AI model service unavailable. Please try again shortly.';
    }
    return 'Unable to process AI request. Please try again later.';
};

// 1. Generate 10 Questions at once in a single API call
const generateInterviewQuestions = async (topic, difficulty, count = 10) => {
    try {
        const prompt = `Generate exactly ${count} ${difficulty}-level technical interview questions for topic: ${topic}.
Return strictly JSON format: { "questions": [{ "questionText": "..." }] }`;

        const rawText = await generateWithFallback(prompt);
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanedText);

        if (!data.questions || data.questions.length === 0) {
            throw new Error('No questions returned from AI.');
        }

        return data.questions.slice(0, count);
    } catch (error) {
        console.error("Gemini Questions Error:", error.message);
        throw new Error(handleGeminiError(error));
    }
};

// 2. Evaluate Answer — Short, clean, concise feedback & model answer (No code dumps)
const evaluateAnswer = async (topic, difficulty, questionText, userAnswer) => {
    try {
        const prompt = `Evaluate this answer for ${topic} (${difficulty}):
Question: ${questionText}
Candidate Answer: ${userAnswer}

STRICT RULES FOR OUTPUT:
- "feedback": 1-2 concise, clear sentences explaining what was good or missing.
- "idealAnswer": 2-3 short, clear sentences explaining the ideal answer concept. Do NOT output code blocks, markdown tags, or full component code dumps. Keep it short and readable.

Return strictly JSON format:
{
    "score": 8,
    "feedback": "Clear explanation of concepts.",
    "idealAnswer": "Short 2-3 sentence model answer summary."
}`;

        const rawText = await generateWithFallback(prompt);
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanedText);

        // Clean any code blocks if present
        let cleanIdeal = (data.idealAnswer || '')
            .replace(/```[a-z]*/g, '')
            .replace(/```/g, '')
            .trim();

        return {
            score: Math.min(10, Math.max(0, Number(data.score) || 0)),
            feedback: data.feedback || 'Answer evaluated.',
            idealAnswer: cleanIdeal || 'Model answer summary not available.'
        };
    } catch (error) {
        console.error("Gemini Evaluation Error:", error.message);
        throw new Error(handleGeminiError(error));
    }
};

module.exports = { generateInterviewQuestions, evaluateAnswer };
