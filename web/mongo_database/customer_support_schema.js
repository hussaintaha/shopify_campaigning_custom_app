import mongoose from "mongoose";

const CustomerSupport = new mongoose.Schema({
    phone_number:{type:Number},
    email_address:{type:String},
    support_handal:{type:String}
},{versionKey:0,timestamps:0})

export default mongoose.model("customer_support",CustomerSupport)