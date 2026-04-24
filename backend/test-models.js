import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testModel(modelName) {
  try {
    const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
    });
    console.log(`✅ SUCCESS: ${modelName}`);
  } catch (err) {
    console.error(`❌ FAILED: ${modelName} - ${err.message}`);
  }
}

async function run() {
    await testModel('gemini-flash-latest');
    await testModel('gemini-2.0-flash-lite');
    await testModel('gemini-2.5-flash');
}
run();
