import mongoose from "mongoose";

const masterMerchantSchema = new mongoose.Schema({
    _id:  Number,
    store_name:  String, 
    couponCode: String,
    campaigns: [{
        campaign_thumbnail:  String ,
        campaign_name:  String, 
        campaign_code:  String ,
        campaign_date:  Object ,
        campaign_spread: Number ,
        // shopID:  String, required: true }
    }],
    //length of sales will be giving you the number of orders 
    // sale Amount will be giving you the total amount or sale
    sales: [{
        saleDate:  Date ,
        storeID:  String ,
        storeUrl:  String ,
        salesId:  Number ,
        salesAmount:  Number ,
    }],
    //customers will be gicing the number of all customers 
    // this will be giving the total share for the merchant dashboad
    customers: [
        {
            user_name:String ,
            // user_email:  String, required: true, default: "NotValid" },
            // length of user_campaign_Array will be giving each user total orders just by checking codeUsed true
            user_campaigns_ARRAY: [
                {
                    campaign_name:String, 
                    user_link: String ,
                    user_count:  Number,
                    // length of user_details plus all other's share will be giving the total friends reach for the merchant dashboard
                    user_details: Array, 
                    user_ip:  String,
                    campaign_completed:  Boolean,
                    couponCode:String, 
                    coupnCodeUsed: Boolean,
                }
            ]
        }
    ]

});

export default mongoose.model("masterMerchant", masterMerchantSchema,)