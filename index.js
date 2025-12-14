const express = require('express')
const app = express()
const mongoose = require('mongoose');
require('dotenv').config()
const cors = require('cors')
const multer = require('multer');
const { PdfReader } = require("pdfreader");
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
mongoose.connect(process.env.DB_CONNECTION).then(() => {
  console.log('DB Connected')
})

const genAI = new GoogleGenerativeAI(process.env.AI_KEY);

const systemInstruction = `You are an expert programming blog assistant. 
Your ONLY purpose is to generate blog post ideas, code snippets, explanations, and suggestions related to programming, software development, data science, and coding languages.
You MUST STRICTLY refuse to answer any question or fulfill any request that is not related to programming. 
If a user asks for recipes, sports, history, personal advice, or anything non-technical, you must politely decline and remind them you only handle programming topics.`;

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: systemInstruction,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }
});

const blogRouter = require('./Route/blogRouter')
const userRoute = require('./Route/userRoute')
const usersRoute = require('./Route/usersRoute')
const commentRoute = require('./Route/commentRoute')
const messageRouter = require('./Route/messageRouter')
const roomRoute = require('./Route/roomRoute')



app.use('/api/v1/blog', blogRouter)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/users', usersRoute)
app.use('/api/v1/comment', commentRoute)
app.use('/api/v1/message', messageRouter)
app.use('/api/v1/room', roomRoute)

const generateBlogLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});



app.post('/generate-blog', generateBlogLimiter, async (req, res) => {
  try {
    const { userPrompt } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ error: 'userPrompt is required' });
    }

    const result = await model.generateContent(userPrompt); // (A)
    const response = await result.response;                 // (B)
    const text = response.text();
    res.json({ blogContent: text });
  } catch (error) {
    console.error(error);
    if (error?.status===429) {
     return res.status(429).json({ 
        error: 'API Quota Exceeded', 
        message: 'The AI service limit has been reached. Please wait a moment or try a lower-tier model.' 
      }); 
    }
    res.status(500).json({ error: 'Failed to generate content' });
  }
})


// --------------------- PDF TEXT EXTRACT ---------------------
function extractPdfText(buffer) {
  return new Promise((resolve, reject) => {
    let finalText = "";

    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) return reject(err);
      if (!item) return resolve(finalText);

      if (item.text) {
        finalText += item.text + " ";
      }
    });
  });
}

async function processPdfAndGetSummary(pdfBuffer, userQuery) {
  let rawText;

  try {
    rawText = await extractPdfText(pdfBuffer);

    if (!rawText || rawText.length < 20) {
      throw new Error("Could not extract text from PDF. It may be scanned.");
    }

    console.log("PDF Extracted:", rawText.length, "characters");
  } catch (err) {
    console.error("PDF Error:", err);
    throw new Error("Failed to extract text from PDF.");
  }

  // Build AI prompt
  let systemInstruction = "";
  let userPrompt = "";

  if (userQuery?.trim()) {
    systemInstruction = `
You are an expert programming assistant and a technical document summarizer.
Your tasks:
1. Summarize the document in a clear, structured, line-by-line or section-wise Markdown format.
2. After the summary, answer the user's question.
3. Use the document content to answer the question if possible.
4. If the answer is not present in the document, answer using your general programming knowledge.
5. Keep the output clean and readable.
`;

    userPrompt = `
DOCUMENT:
${rawText}

USER QUESTION:
${userQuery}

Instructions:
- First, provide the summary of the document.
- Then, answer the user's question.
- Use Markdown formatting.
`;
  } else {
    systemInstruction = `
You are a technical document summarizer.
Your task:
- Summarize the document in a clear, line-by-line or section-wise Markdown format.
- Keep it structured and easy to read.
`;

    userPrompt = `Summarize this document:\n\n${rawText}`;
  }

  // AI Call
  try {
    const pdfModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // <-- free model
      systemInstruction // <-- pass systemInstruction here directly
    });

    const resp = await pdfModel.generateContent(userPrompt); // <-- just pass text

    return resp.response.text();
  } catch (err) {
    console.error("AI Error:", err);
    throw new Error("Failed to summarize PDF.");
  }
}

// --------------------- PDF ROUTE ---------------------
app.post('/summarize-pdf', upload.single('pdfFile'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  try {
    const summary = await processPdfAndGetSummary(
      req.file.buffer,
      req.body.question
    );

    res.json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.get('/', (req, res) => {
  res.send('Server Rounning!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})