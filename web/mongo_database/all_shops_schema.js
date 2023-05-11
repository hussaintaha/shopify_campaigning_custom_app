import mongoose from "mongoose";

const shopsSchema = new mongoose.Schema({
    _id: { type: Number },
    store_name: { type: String },
    store_email: { type: String },
    store_country: { type: String },
    store_url: { type: String },
    all_coupon_code: [String],
    unistalled:{type:Boolean,default:false},
    availabelBalance:{type:Number,default:10},
    transection: [{
        transection_date: Date,
        order_id: Number,
        customer_email: String,
        coupon_code: String,
        sale_amount: Number
    }]

}, { versionKey: 0, timestamps:true})

export default mongoose.model("all_shops", shopsSchema);