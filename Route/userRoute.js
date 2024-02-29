const express=require('express')

const blogController=require('../controller/userController')

const router=express.Router()

router.route('/').post(blogController.createUser)
router.route('/:email').get(blogController.getUser)

module.exports=router