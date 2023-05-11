import mongoose from "mongoose";

const promoSetup = new mongoose.Schema({
    promoLink:{type:String,require:true}
},{versionKey:0})

export default mongoose.model("promo_setup",promoSetup);