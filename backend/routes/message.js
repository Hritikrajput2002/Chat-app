const express = require("express");
const router = express.Router();
const Msg=require("../model/msg")
const user = require("../model/user");

// Middleware to parse JSON request bodies
router.use(express.json());



router.post("/addmsg",async(req,res)=>{
    try{
          const {to,from,message}=req.body;
          const newMsg=await Msg.create({
            message:message,
            source:[from,to],
            sender:from
          })
          if(!newMsg){
            return res.json({error:"cant create message"})

          }
          else{
            return res.json("you are in")
          }
    }catch(err){
         return res.status(404).json({error:"server error"})
    }


})

router.post("/showmsg",async(req,res)=>{
  try{
        const {to,from}=req.body;
        const Message=await Msg.find({
          source:{
            $all:[from,to]
          },
        }).sort({updatedAt:1})
        
        if(!Message){
          return res.json({error:"cant find message"})

        }

        const responsemsg=Message.map((msg)=>{
              return {
                   selfuser:msg.sender.toString() === from,
                   message:msg.message
              }
        })


        if(!responsemsg){
          return res.json({error:"cant find user message"})

        }
        else{
          return res.json(responsemsg)
        }
  }catch(err){
       return res.status(404).json({error:"server error"})
  }


})


module.exports = router;