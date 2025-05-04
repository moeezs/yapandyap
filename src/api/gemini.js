// src/api/gemini.js

// IMPORTANT: You need to install the Google Generative AI SDK
// npm install @google/genai

import { GoogleGenAI } from "@google/genai";

// --- IMPORTANT: API Key Handling ---
// 1. NEVER hardcode your API key directly in the code.
// 2. Use environment variables:
//    - Create a .env file in your project root (add it to .gitignore!)
//    - Add your API key: VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
//    - Access it in your code: const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// ------------------------------------

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Add a delay function to prevent sending all requests simultaneously
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Gets a response from the Gemini API for a specific character with appropriate delay.
 * @param {object} character - The character object from characters.js.
 * @param {string} userQuestion - The latest question from the user.
 * @param {Array<object>} history - The chat history for this character.
 * @returns {Promise<string|null>} - A promise that resolves with the response text or null on error.
 */
export async function getCharacterResponse(character, userQuestion, history = []) {
  console.log(`Getting response for ${character.name} with history:`, history);
  
  try {
    // Add a shorter delay between API calls (300ms to 800ms) to keep total under 5s
    await delay(300 + Math.random() * 500);
    
    // Use the character's prompt template from characters.js if available
    const basePrompt = character.prompt_template || 
      `You are ${character.name} from Toy Story. Your personality is: ${character.persona}. 
      Keep your response very short (max 30 words).`;
    
    // Add character-specific quality hints based on responseQuality
    let enhancedPrompt = basePrompt;
    
    if (character.responseQuality === "terrible") {
      enhancedPrompt += " Give the WORST possible advice in your character's style. Be memorably bad.";
    } else if (character.responseQuality === "bad") {
      enhancedPrompt += " Give questionable or unhelpful advice that matches your character.";
    } else if (character.responseQuality === "great") {
      enhancedPrompt += " Give truly excellent advice that's genuinely helpful.";
    } else if (character.responseQuality === "mixed") {
      enhancedPrompt += " Give advice that's entertaining but not necessarily practical.";
    }
    
    // Prepare chat history including the specific prompt
    let chatHistory = [];
    
    // Add character prompt as the first user message
    chatHistory.push({
      role: "user",
      parts: [{ text: enhancedPrompt }]
    });
    
    // Add a standard response to the character prompt
    chatHistory.push({
      role: "model",
      parts: [{ text: "I'll respond as " + character.name + " with the appropriate personality." }]
    });
    
    // Add the existing conversation history
    if (history.length > 0) {
      chatHistory = [...chatHistory, ...history];
    }
    
    // Create a chat instance
    const chat = ai.chats.create({
      model: "gemini-1.5-flash", // Using the latest Gemini model
      history: chatHistory,
    });
    
    // Add a character-specific spin to the question when appropriate
    let modifiedQuestion = userQuestion;
    
    // Character-specific question modifiers to enhance diversity
    switch(character.id) {
      case 'mrpotatohead':
        modifiedQuestion = `I need your brutally honest take: ${userQuestion}`;
        break;
      case 'lotso':
        modifiedQuestion = `What's your advice on this: ${userQuestion}`;
        break;
      case 'rex':
        modifiedQuestion = `This makes me nervous, what do you think: ${userQuestion}`;
        break;
      case 'slinky':
        modifiedQuestion = `I'm thinking of doing this, what do you think: ${userQuestion}`;
        break;
      default:
        // Use the question as is for other characters
        break;
    }
    
    // Send the user's question
    const response = await chat.sendMessage({
      message: modifiedQuestion,
    });
    
    // Extract and return the text response
    const responseText = response.text;
    console.log(`${character.name} responded:`, responseText);
    
    // Final sanity check to ensure short responses
    const words = responseText.split(/\s+/).length;
    if (words > 40) {
      // If still too long, truncate and add ellipsis
      return responseText.split(/\s+/).slice(0, 35).join(' ') + '...';
    }
    
    return responseText;
    
  } catch (error) {
    console.error(`Error getting response for ${character.name}:`, error);
    return `Sorry, ${character.name} is having trouble thinking right now.`; // Return error message on failure
  }
}

// For testing purposes
export async function testGeminiAPI() {
  try {
    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      history: [
        {
          role: "user",
          parts: [{ text: "Hello" }],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
      ],
    });

    const response = await chat.sendMessage({
      message: "How does the Gemini API work?",
    });
    
    console.log("API Test successful:", response.text);
    return true;
  } catch (error) {
    console.error("API Test failed:", error);
    return false;
  }
}
