const express=require('express')

const blogController=require('../controller/blogController')

const router=express.Router()

router.route('/').post(blogController.createblog).get(blogController.getBlog)
router.route('/:id').get(blogController.getOne)

module.exports=router