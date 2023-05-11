import mongoose from 'mongoose'

// ---------------
// This is a mongoose campaign schema which specify the required fields of the campaign 
// ---------------

const campaignsSchema = new mongoose.Schema({

    shopID: { type: String, required: true },
    campaign_collection: [{
        campaign_name: { type: String, required: true },
        campaign_code: { type: String },
        campaign_thumbnail: { type: String },
        campaign_date: { type: Object },
        campaign_spread: { type: Number },
        campaign_active: { type: Boolean, default: true },
        campaign_customers: [{}],
        campaign_instructions: { type: String },
        campaign_btn_txt: { type: String },
        campaign_discount: { type: Number },
    }]
}, { timestamps: false, versionKey: false });

export default mongoose.model("all_campaigns", campaignsSchema);
