import mongoose from "mongoose";


const postSchema=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    content:{
        type:String,
        required:true,
        trim:true
    },
    link:{
        type:String,
        trim:true
    },
    likes:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }],
    comments:[{
        author:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User",
          required:true  
        },
        content:{
            type:String,
            required:true,
            trim:true
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
    }],
},{
     timestamps:true
}
)

export const Post=mongoose.model("Post",postSchema);