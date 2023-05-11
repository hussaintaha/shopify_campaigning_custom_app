// import {Routes} from "mongoose"
import Router from "express"
import campaigns_schema from "../mongo_database/campaigns_schema.js"
import multer from "multer"

// --------------------
// This route is an authenticated route which it can't be called outside of shopify authenticated iframe.
// Everything related to campaign is done over here only from creating, updating, getting and automated create.
// --------------------

const router = Router();

// --------------------
// Used multer to save the images in the local storage
// --------------------

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Images')
    },
    filename: function (req, file, cb) {
        // Math.random().toString(36).slice(2).toLocaleUpperCase()
        const uniqueSuffix = (Date.now() + '-' + Math.random().toString(36).slice(2, 8).toLocaleUpperCase()).slice(7, 25)
        cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname.slice(-5))
    }

})

const upload = multer({ storage: storage })

// -------------------
// This route is responcible for creating the campaign 
// -------------------

router.post("/createCampaign", upload.single('campaign_thumbnail'), async (req, resp) => {

    try {
        const Campaigns_Schema = await campaigns_schema.find(
            { shopID: resp.locals.shopify.session.shop });
        if (Campaigns_Schema.length == 0) {
            const newCampaignSchema = new campaigns_schema({
                campaign_thumbnail: req.file.filename,
                campaign_name: req.body.title,
                campaign_code: req.body.code,
                campaign_date: { start: req.body.dateStart, end: req.body.dateEnd },
                campaign_spread: req.body.spread,
                shopID: resp.locals.shopify.session.shop,
                campaign_instructions: req.body.campaign_instructions,
                campaign_btn_txt: req.body.campaign_btn_txt,
                campaign_discount: req.body.campaign_discount
            })
            await newCampaignSchema.save();
            resp.status(200).json({ message: "All set campaign added to the DB", data: newCampaignSchema })
        } else {
            resp.status(400).json({ message: "You are not are Premium customer, sorry you can't create multiple campaigns" })
        }
    }
    catch (err) {
        console.log(err);
        resp.status(500).json("Some error occured try to come back later")
    }

})

// ------------------
// This route is to get all the campaign which you have created already 
// For the version one the number is fiexd to one campaign
// ------------------

router.get("/getCampaigns", async (req, resp) => {
    try {
        if (resp.locals.shopify.session.shop) {

            const Campaigns_Schema = await campaigns_schema.find({ shopID: resp.locals.shopify.session.shop });

            console.log("campaign   ", Campaigns_Schema[0].campaign_collection[0])

            resp.status(200).json({
                message: `${Campaigns_Schema.length} Campaign is available`,
                data: Campaigns_Schema[0].campaign_collection,
            });
        }
        else {
            resp.status(201).json("You have to login into your shop to do this action");
        }
    }
    catch {
        resp.status(500).json("Some error occured try to come back later")
    }
})

// ------------------
// This route is to get the campaign data automatic when page load just by providing the campaign id 
// ------------------

router.get("/automated_campaignCall/:id", async (req, resp) => {
    console.log("automated call")
    try {
        if (resp.locals.shopify.session.shop) {
            const getShopData = await campaigns_schema.find({ shopID: resp.locals.shopify.session.shop }, { campaign_collection: { $elemMatch: { _id: req.params.id } } });
            if (getShopData.length > 0) {
                resp.status(200).json({
                    message: "Everything went well",
                    data: getShopData[0].campaign_collection[0]
                });
            } else {
                resp.status(201).json({ message: "Can't find a data with this id", data: {} });
            }
        } else {
            resp.status(404).json({ message: "We are really sorry can't find a way", data: {} })
        }

    } catch (err) {
        console.log(err)
        resp.status(500).json({ error: "sorry server busy doing somthing else try again after some time" })
    }
})

// ------------------
// This route is is responcible for updating the campaign it also required the id 
// ------------------

router.put("/updateCampaign/:Id", upload.single('campaign_thumbnail'), async (req, resp) => {

    try {
        if (req.params.Id) {

            try {

                const newCampaignSchema = {};
                if (req?.file?.filename) {
                    
                } else {
                    // newCampaignSchema["campaign_thumbnail"] = 

                    const thumbnailIs = await campaigns_schema.findOne(
                        {
                            shopID: resp.locals.shopify.session.shop,
                            campaign_collection: {
                                $elemMatch: { _id: req.params.Id }
                            }
                        }, { campaign_collection: 1, _id: 0 })

                    newCampaignSchema["campaign_thumbnail"] = thumbnailIs.campaign_collection[0].campaign_thumbnail

                }

                const responceIS = await campaigns_schema.findOneAndUpdate(
                    {
                        shopID: resp.locals.shopify.session.shop,
                        campaign_collection: {
                            $elemMatch: { _id: req.params.Id }
                        }
                    },
                    { $set: { campaign_collection: newCampaignSchema } }, { new: true });

                resp.status(200).json({ message: "Campaign updated successfuly ", data: responceIS })
                return
            }
            catch (err) {
                resp.status(201).json("You don't have the permission to do this")
                return

            }
        }
        resp.status(201).json("Id is must to update the campaign")
    }
    catch (err) {

        console.log('som error ---- ', err)
    }
})


// ------------------
// This route is to generate a default campaign for the user When they install the campaign for first time 
// ------------------

router.get("/create_default_campaign", async (req, resp) => {
    // resp.status(200).json(resp.locals.shopify.session)

    console.log("create default campaign ")
    
    try {
        const shopSession = resp.locals.shopify.session
        if (shopSession?.shop) {
            const findCampaign = await campaigns_schema.find({ shopID: shopSession.shop })
            console.log("find campaign ---- ", findCampaign.length);
            if (!findCampaign.length) {
                
                const nextWeek = new Date()
                nextWeek.setDate(nextWeek.getDate() + 7)

                const newCampaignSchema = campaigns_schema({
                    shopID: shopSession.shop,
                    campaign_collection: [
                        {
                            campaign_thumbnail: "campaign_thumbnail_default.jpg",
                            campaign_name: "Share The Love Promo",
                            campaign_code: Math.random().toString(36).slice(2).toUpperCase(),
                            campaign_date: { start: new Date(), end: nextWeek },
                            campaign_spread: 3,
                            campaign_instructions: "simply share the promo with 3 friends Now to get your Discount Code",
                            campaign_btn_txt: "Share With Friends",
                            campaign_discount: 20,
                        }
                    ]
                })

                await newCampaignSchema.save();
                console.log("newCampaign ",newCampaignSchema)
                resp.status(200).json({ message: "We have created a default campaign for you Hope you like it for next 7 days" })
                return
            } 
            else {
                console.log("already campaign availabel")
                resp.status(202).json({ message: "already campaign availabel" })
                return
            }
        } 
        else {
            console.log("No shop provided")
            resp.status(404).json({ message: "No shop provided" })
            return
        }
    } catch(err) {
        console.log("its error from create default campaign ",err)
        resp.status(500).json({ message: "Some error occured on the server please try again later" })
    }
})

export default router;