const message=require('../model/message')

module.exports.sendMessage=async(req,res)=>{
       try {
          const newMessage=new message(req.body)
          const result=await newMessage.save()
          res.status(200).json(result)

       } catch (error) {
         console.log(error)
       }
}

module.exports.getMessage=async(req,res)=>{


try {
  const result=await message.find({}).sort({createdAt:1})
  res.status(200).json(result)
} catch (error) {
  console.log(error)
}

}