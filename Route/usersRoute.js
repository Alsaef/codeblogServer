const express=require('express')

const blogController=require('../controller/userController')

const router=express.Router()

router.route('/').get(blogController.GetUsers)
router.route('/:id').get(blogController.GetUsersId)

module.exports=router