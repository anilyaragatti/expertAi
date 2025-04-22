const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3014;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for general chat
app.post('/api/chat', async (req, res) => {
  console.log("🔐 Groq API Key Present:", !!process.env.GROQ_API_KEY);
  try {
    const { message, feature } = req.body;
    
    // Different system messages based on feature
    let systemMessage = "You are a helpful assistant.";
    switch(feature) {
      case 'career':
        systemMessage = "You are a career advisor specializing in professional development, job searching strategies, and interview preparation.";
        break;
      case 'resume':
        systemMessage = "You are a resume building expert who helps create professional resumes tailored to specific job applications.";
        break;
      case 'story':
        systemMessage = "You are a creative storyteller who can create engaging stories based on user prompts.";
        break;
      case 'health':
        systemMessage = "You are a health assistant providing general wellness advice. (Note: You are not a medical professional and users should consult doctors for medical concerns)";
        break;
      case 'startup':
        systemMessage = "You are a startup consultant specializing in business models, market research, and early-stage company development.";
        break;
      case 'books':
        systemMessage = "You are a book summary expert who provides concise summaries of popular books and their key insights.";
        break;
      default:
        // General chat uses default system message
        break;
    }
    
    // Call Groq API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama3-70b-8192",  // Using LLaMA 3 70B model, adjust as needed
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: message }
        ],
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to process request',
      details: error.response?.data || error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});