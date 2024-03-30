const express=require('express')

const messageController=require('../controller/messageController')

const router=express.Router()

router.route('/').post(messageController.sendMessage).get(messageController.getMessage)

module.exports=router