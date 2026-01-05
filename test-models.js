import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
        );
        const data = await response.json();

        console.log('Available models:');
        if (data.models) {
            data.models.forEach(model => {
                console.log(`- ${model.name}`);
                console.log(`  Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
            });
        } else {
            console.log('No models found. Response:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

listModels();
