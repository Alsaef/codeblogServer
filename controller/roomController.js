const room=require('../model/room')

module.exports.CreateRoom=async(req,res)=>{
       try {
          const newRoom=new room(req.body)
          const result=await newRoom.save()
          res.status(200).json(result)

       } catch (error) {
         console.log(error)
       }
}

module.exports.GetRoom=async(req,res)=>{


try {
  const result=await room.find({}).sort({createdAt:1})
  res.status(200).json(result)
} catch (error) {
  console.log(error)
}

}

module.exports.enterRoomId=async(req,res)=>{
  const id=req.params.id
  try {
     const result=await room.findOne({_id:id})
     res.status(200).json(result)
  } catch (error) {
    console.log(error)
  }
}