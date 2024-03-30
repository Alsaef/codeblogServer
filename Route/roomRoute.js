const express=require('express')

const roomcontroller=require('../controller/roomController')

const router=express.Router()

router.route('/').post(roomcontroller.CreateRoom).get(roomcontroller.GetRoom)
router.route('/:id').get(roomcontroller.enterRoomId)

module.exports=router