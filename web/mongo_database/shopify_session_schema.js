import mongoose from 'mongoose'

// -----------------
// This is a shopify schema which will be created automatically but now we created this to get the data for coupon code creation
const shopifySchema = new mongoose.Schema({},{strict:false})

export default mongoose.model("shopify_sessions", shopifySchema);