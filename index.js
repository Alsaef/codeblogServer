const express = require('express')
const app = express()
const mongoose = require('mongoose');
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
mongoose.connect(process.env.DB_CONNECTION).then(()=>{
    console.log('DB Connected')
})



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
app.get('/', (req, res) => {
  res.send('Server Rounning!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})