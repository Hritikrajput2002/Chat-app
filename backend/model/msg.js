const mongoose=require('mongoose');
const { Schema } = mongoose;

const MessageSchema=new Schema({
     message:{
        type:String,
        required:true
     },
     source:Array,
     sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
     },
     date:{
        type:Date,
        default:Date.now
     },
     additionalData: {
        type: Schema.Types.Mixed,
         default: {}
     }
},{
    timestamps:true
});

module.exports=mongoose.model('message',MessageSchema);