import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import authUser from '../middlewares/authUser.js';
import userModel from '../models/User.js';
import chatbotLeadModel from '../models/ChatbotLead.js';

const aiRouter = express.Router();

// Memory storage to keep buffer in RAM for processing
const aiUpload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

aiRouter.post('/parse-prescription', aiUpload.single('document'), authUser, async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
            return res.json({ success: false, message: 'User not authenticated.' });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found.' });
        }

        // Removed daily upload limit as the new pipeline is completely free and unlimited.

        if (!req.file) {
            return res.json({ success: false, message: 'No document uploaded' });
        }

        const mimeType = req.file.mimetype;
        const base64Data = req.file.buffer.toString("base64");

        const prompt = `You are an expert medical AI assistant for a pathology lab. 
Here is an image/document of a medical prescription. Your task is to accurately read the doctor's handwriting. 

Extract two things in strict structured JSON format:
1. "briefInfo": A 1-2 sentence simple and encouraging summary of the prescription (e.g., "This appears to be a routine checkup prescribed by the doctor for fever/weakness.")
2. "tests": An array of strings containing ONLY the laboratory tests or diagnostic packages requested. Clean up abbreviations if possible (e.g., if it says 'CBC', write 'CBC (Complete Blood Count)'). Just the test names!
Ignore medicines, diet advice, or clinic notes.

Return ONLY valid JSON matching this schema:
{
  "briefInfo": "string",
  "tests": ["string", "string"]
}`;

        console.log("Sending document to Gemini 2.5 Flash...");
        
        let responseText;
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    prompt,
                    { inlineData: { mimeType: mimeType, data: base64Data } }
                ],
                config: {
                    temperature: 0.2,
                    responseMimeType: "application/json"
                }
            });
            responseText = response.text;
            console.log("Gemini Response:", responseText.substring(0, 100));
        } catch (error) {
            console.error("Gemini Vision Error:", error.message);
            return res.json({ success: false, message: 'Failed to process the document with Gemini AI. Please try again.' });
        }

        if (!responseText) {
            // MOCK FALLBACK for Accounts with Limit issues
            console.log("Vision model failed. Falling back to MOCK response.");
            const mockData = {
                briefInfo: "⚠️ [MOCK DATA DUE TO AI API LIMITS] This is a simulated response because the vision model is currently overloaded. We detected a routine checkup prescription.",
                tests: ["Complete Blood Count", "Lipid Profile", "Liver Function Test"]
            };
            
            return res.json({ success: true, parsedData: mockData });
        }

        const rawText = responseText;
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
            const parsedData = JSON.parse(jsonMatch[0]);
            
            res.json({ success: true, parsedData });
        } else {
            res.json({ success: false, message: 'Failed to extract valid test data from the document.', raw: rawText });
        }

    } catch (error) {
        console.error("AI Parse Error:", error);
        res.json({ success: false, message: error.message || 'Error processing document with AI' });
    }
});

// --- NEW ENDPOINT: Chat with Gemini ---

aiRouter.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        
        if (!message) {
            return res.json({ success: false, message: 'Message is required' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const systemMessage = `You are a friendly medical receptionist chatbot for RS Path Lab in Jamshedpur. 
Lab Info: Address is Tulsi Tower, Harharguttu, Shivmandir Chowk, Jamshedpur 831002. Phone: 82102 36683. 
Services: Blood tests, Digital X-Ray, CBC, Thyroid, Diabetes, Packages, Home Collection. 
If a user asks questions about the lab, use this info.
If a user wants to book a test, ask them for their Name, Phone number, Date, and Test Name. 
After they provide ALL details, tell them 'Thank you! Our lab team will call you shortly to confirm your booking.' 
Be conversational and helpful. Do not use asterisks (**) or markdown. Keep answers short. 
IMPORTANT: ONLY when you have successfully collected ALL details (name, phone, date, test name), you MUST append this exact string at the very end of your final response message: [BOOKING_LEAD: {"name": "user_name", "phone": "user_phone", "date": "user_date", "testName": "user_test"}]`;

        const contents = [];
        if (history && history.length > 0) {
            for (const msg of history) {
                if (msg.role === 'system') continue;
                contents.push({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                });
            }
        }
        
        contents.push({ role: 'user', parts: [{ text: message }] });

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: contents,
            config: {
                systemInstruction: systemMessage,
                temperature: 0.7,
                maxOutputTokens: 512,
            }
        });

        let reply = response.text || "I'm sorry, I couldn't process that.";

        // Detect and extract [BOOKING_LEAD: {...}]
        const leadMatch = reply.match(/\[BOOKING_LEAD:\s*(\{.*?\})\s*\]/);
        if (leadMatch) {
            try {
                const leadData = JSON.parse(leadMatch[1]);
                await chatbotLeadModel.create(leadData);
                console.log("Chatbot lead saved to DB:", leadData);
            } catch (err) {
                console.error("Failed to parse or save chatbot lead:", err);
            }
            // Remove the payload from the visible response
            reply = reply.replace(/\[BOOKING_LEAD:\s*(\{.*?\})\s*\]/, '').trim();
        }

        res.json({ success: true, reply });
    } catch (error) {
        console.error("Gemini Chat Error:", error.message);
        res.json({ success: false, message: error.message || 'Error processing chat message' });
    }
});

export default aiRouter;
