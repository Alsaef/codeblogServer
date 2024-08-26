const blog=require('../model/blog');

module.exports.createblog=async(req,res)=>{
        try {
            const newBlog= new blog(req.body);
            const result=await newBlog.save()

            res.status(200).json(result)

        } catch (error) {
            console.log(error)
        }
}
module.exports.getBlog=async(req,res)=>{
        try {
            const { searchQuery } = req.query;
            const filter = {
            $or: [
              { name: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive name search
              { category: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive name search
              { location: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive location search
            ],
          };
          if (searchQuery) {
            const blogs = await blog.find(filter);
            res.status(200).json(blogs );
         }
        else{
            const blogs = await blog.find().sort({createdAt:-1});
            res.status(200).json(blogs );
        }

          

        } catch (error) {
            console.log(error)
        }
}

module.exports.getOne=async(req,res)=>{
       try {
       const id = req.params.id
        const result=await blog.findOne({_id:id})
        res.status(200).json(result)
       } catch (error) {
        console.log(error)
       }
}