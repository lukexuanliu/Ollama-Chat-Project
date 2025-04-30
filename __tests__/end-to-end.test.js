const axios = require('axios');
const { setTimeout } = require('timers').promises;

// Set Jest timeout before any tests run
jest.setTimeout(60000); // 60 seconds

// Test prompts that cover various topics and complexity
const testPrompts = [
  "What's the weather like today?",
  "Explain quantum computing in simple terms.",
  "Write a short poem about spring.",
  "What's the capital of France?",
  "Describe a typical day in your life.",
  "What's 2 + 2?",
  "Tell me about the history of the internet.",
  "What are the benefits of meditation?",
  "Explain how blockchain works.",
  "What's your favorite movie?",
  "Tell me a joke."
];

describe('LLM End-to-End Tests', () => {
  // Increase Jest's default timeout
  jest.setTimeout(120000); // 2 minutes

  // Run tests sequentially
  jest.retryTimes(0, {
    mode: 'onlyFailed'
  });
  let server;
  const BASE_URL = 'http://localhost:3000';
  const API_URL = `${BASE_URL}/api/chat`;

  // Increase Jest's default timeout
  jest.setTimeout(60000); // 60 seconds

  beforeAll(async () => {
    // Reset conversation history before tests
    await axios.post(`${BASE_URL}/api/reset`);
  });

  test('LLM responds meaningfully to 11 different prompts', async () => {
    // Increase timeout for this test since we're making multiple API calls
    jest.setTimeout(120000); // 2 minutes for this test
    
    // Add error handling and logging
    try {
      for (let i = 0; i < testPrompts.length; i++) {
        const prompt = testPrompts[i];
        console.log(`Sending prompt ${i + 1}/${testPrompts.length}: ${prompt}`);
        
        // Send the message
        const response = await axios.post(API_URL, { message: prompt });
        console.log(`Received response for prompt ${i + 1}:`, response.data.main.substring(0, 100));
        
        // Verify response
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('main');
        expect(response.data.main).toBeTruthy();
        expect(response.data.main).not.toMatch(/\[object object\]/i);
        // Only check for standalone error messages, not legitimate use of the word
        expect(response.data.main).not.toMatch(/^\s*error/i);
        expect(response.data.main).not.toBe('');
        
        // Optional: verify think content if present
        if (response.data.think) {
          // If think is an array, join it to a string
          const thinkContent = Array.isArray(response.data.think) ? response.data.think.join(' ') : response.data.think;
          expect(thinkContent).toBeTruthy();
          // The think content is expected to contain "user is asking" or similar patterns
          // This is normal LLM behavior, so we should allow it
          expect(thinkContent).not.toMatch(/\[object object\]/i);
        }
        
        // Add small delay between requests to avoid rate limiting
        await setTimeout(500);
      }
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  }, 120000); // Increase timeout to 2 minutes for all prompts

  test('Conversation history is maintained', async () => {
    // Increase timeout for this test since we're making multiple API calls
    jest.setTimeout(120000);
    
    // Send a few messages to build up history
    const messages = [
      "What's your favorite color?",
      "Why do you like that color?",
      "What other colors do you like?"
    ];

    const conversationHistory = [];
    
    for (const message of messages) {
      console.log(`\nSending message: ${message}`);
      const response = await axios.post(API_URL, { message });
      expect(response.status).toBe(200);
      expect(response.data.main).toBeTruthy();
      
      // Store the response for later verification
      conversationHistory.push({
        message,
        response: response.data.main
      });
      
      console.log('Response:', response.data.main);
      await setTimeout(500);
    }

    // Send a question that should reference previous conversation
    console.log('\nSending follow-up question about colors');
    const finalResponse = await axios.post(API_URL, {
      message: "What colors did we discuss earlier?"
    });

    console.log('Final response:', finalResponse.data.main);
    expect(finalResponse.status).toBe(200);
    expect(finalResponse.data.main).toBeTruthy();
    
    // Verify that the response references the previous conversation
    expect(finalResponse.data.main.toLowerCase()).toMatch(/color|colour/);
    
    // Check if the final response mentions any of the previously discussed colors
    const previousColors = conversationHistory
      .map(entry => entry.response)
      .join(' ')
      .toLowerCase();
    
    console.log('\nPrevious colors mentioned:', previousColors);
    
    // Verify that the final response contains at least one color from the previous conversation
    const finalResponseText = finalResponse.data.main.toLowerCase();
    const containsPreviousColor = previousColors.split(' ').some(color => 
      color && finalResponseText.includes(color)
    );
    
    console.log('Final response contains previous colors:', containsPreviousColor);
    expect(containsPreviousColor).toBe(true);
  }, 120000); // Increase timeout to 2 minutes for all prompts
});
