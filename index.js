const express = require('express')
const app = express()
const mongoose = require('mongoose');
require('dotenv').config()
const cors = require('cors')
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
mongoose.connect(process.env.DB_CONNECTION).then(()=>{
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

const blogRouter=require('./Route/blogRouter')
const userRoute=require('./Route/userRoute')
const usersRoute=require('./Route/usersRoute')
const commentRoute=require('./Route/commentRoute')
const messageRouter=require('./Route/messageRouter')
const roomRoute=require('./Route/roomRoute')



app.use('/api/v1/blog',blogRouter)
app.use('/api/v1/user',userRoute)
app.use('/api/v1/users',usersRoute)
app.use('/api/v1/comment',commentRoute)
app.use('/api/v1/message',messageRouter)
app.use('/api/v1/room',roomRoute)

const generateBlogLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5, 
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 1 hour.'
  },
  standardHeaders: true, 
  legacyHeaders: false,  
});


app.post('/generate-blog',generateBlogLimiter,async(req,res)=>{
  try {
    const { userPrompt } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ error: 'userPrompt is required' });
    }

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();
    res.json({ blogContent: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
})


app.get('/', (req, res) => {
  res.send('Server Rounning!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})