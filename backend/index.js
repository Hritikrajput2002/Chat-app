const express=require('express');
const cors=require('cors')
const mongoose=require("mongoose");
require('dotenv').config();
const app=express();
app.use(cors());
app.use(express.json());
const auth=require("./routes/auth")
const msgs=require("./routes/message")


try{
    mongoose.connect(process.env.Mongo_URI);
    console.log("connected succesfullly")
   }
catch(err){
    
        console.log("db  failed connect")
}

app.use("/api/auth",auth);
app.use("/api/msgs",msgs)

const server=app.listen(process.env.PORT, ()=>{
    console.log(`Example app listening on port http://localhost:${process.env.PORT}`)
});