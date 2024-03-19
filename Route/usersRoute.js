const express=require('express')

const blogController=require('../controller/userController')

const router=express.Router()

router.route('/').get(blogController.GetUsers)

module.exports=router