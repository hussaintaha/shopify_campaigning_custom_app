import mongoose from "mongoose";

const faqQuestion = new mongoose.Schema({
    question:{type:String,required:true},
    answer:{type:String,required:true}
},{versionKey:0,timestamps:0})

export default mongoose.model("all_FAQ",faqQuestion);