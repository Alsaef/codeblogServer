const comment= require('../model/comment')

module.exports.createComment=async(req,res)=>{
    try {
        const newComments= new comment(req.body);
        const result=await newComments.save()

        res.status(200).json(result)

    } catch (error) {
        console.log(error)
    }
}

module.exports.getComment=async(req,res)=>{
  try {
    const result= await comment.find()

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(error.message)
  }
}