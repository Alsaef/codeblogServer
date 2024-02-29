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
   const result = await comment.aggregate([


    {
        $lookup:{
            from: 'users',
            localField: 'email',
            foreignField: 'email',
            as:'userDetils'
        }
    },{
        $sort: {
          'createdAt': -1, // Sort by 'createdAt' field in descending order (newest to oldest)
        },
      },

   ])
   res.status(200).json(result)
}