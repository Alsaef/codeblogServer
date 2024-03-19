const user=require('../model/user');

module.exports.createUser=async(req,res)=>{
    try {
         

        const userData=req.body;

        const existing= await user.findOne({email:userData.email})

        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
          }

          const newUser = new user(userData);
          const result = await newUser.save()
          res.status(200).json(result)
      


    } catch (error) {
        console.log(error)
    }
}
module.exports.getUser=async(req,res)=>{
    try {
         
       const email=req.params.email
       const result = await user.findOne({ email: email });
       if (result?.email) {
        return res.status(200).json({
            status: true,
            data: result
          });
       }

       return res.json({ status: false })

    } catch (error) {
        console.log(error)
    }
}

module.exports.GetUsers=async(req,res)=>{
  try {
     const result=await user.find().sort({createdAt:-1})
     res.status(200).json(result)
  } catch (error) {
    console.log(error)
  }
}