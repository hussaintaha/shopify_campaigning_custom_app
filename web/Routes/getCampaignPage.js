import Router from "express"
import campaigns_schema from "../mongo_database/campaigns_schema.js"
import linkSchema from "../mongo_database/unique_link_schema.js"
import nodemailer from "nodemailer"

// -----------------------
// This route is use to serve the campaign page when the user click on the link.
// We are also using it to monitor the visitor on the link so we can get the count which is important factor to generate the coupon code 
// This page also have the logic for creating the coupon code and sending it to the user with shop name.
// -----------------------

const router = Router();
// -----------------------
// This is nodemailer npm library to send the mails. Which have the the required details to send the email like api key and host name.
// -----------------------
const transporter = nodemailer.createTransport(({
  host: process.env.SAND_GRID_HOST,
  port: process.env.SAND_GRID_PORT,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY
  }
}));

// -----------------------
// This is the route to serve the banner as an enj templete page so which contain details of the campaign and get pushed in the meta tag of share banner.
// It was an extra step to count the number of visiter on the unique link and also to show the campaign data in the render view of social media because most of them now take data from meta tag
// Here we check the camapaign share count and then send the campaign code to the user
// serving the enjs file as a responce
// ----------------------
router.get("/bannerAsPage/:campaignID", async (req, resp) => {
  // console.log("inside /bannerAsPage/:campaignID")
  try {
    // req.params.campaignID
    // req.query.customer.split("_")[0]
    // req.query.customer.split("_")[1]

    // -----------------------
    // It will check if the campaign id or the user id is not equal then 24 which is a mandatory field then it will just throw a error that the page not found 
    // -----------------------

    if (req.params.campaignID.length == 24 && req.query.customer.split("_")[0].length == 24 && req.query.customer.split("_")[1].length == 24) {


      console.log("campaign ID =  ", req.params.campaignID)
      console.log("customer id =  ", req.query.customer.split("_")[0])
      console.log("campaign sub capign id  = ", req.query.customer.split("_")[1])


      // Add the logic here to get the specific campaign for the singel shop
      const campaignObj = await campaigns_schema.findOne({
        _id: (req.params.campaignID).toString()

        // , campaign_collection: {
        //   $elemMatch: { _id: (req.query.customer.split("_")[1]).toString() }
        // }

      }, { campaign_collection: 1, shopID: 1, _id: 0 });

      // console.log("req.params.campaignID   ",req.params.campaignID)
      console.log("campaignObj -=-=-==- ", campaignObj)

      const UserObj = await linkSchema.findById(req.query.customer.split("_")[0]);

      // console.log("UserObj -=-= ", UserObj)


      // -----------------------
      // Here we are serving the ejs file as a responce over here which contain the meta tag for the social preview render. 
      // -----------------------
      if (UserObj !== null && Object.keys(UserObj).length > 0) {

        resp.status(200).render("/var/www/xyz/html/testing-new-repo/web/example.ejs",
          { campaign: { ...campaignObj.campaign_collection[0]._doc, shopURL: campaignObj.shopID, referer: UserObj.user_first_name, customerID: req.query.customer.split("_")[0], cCode: req.query.customer.split("_")[1], IPCount: UserObj.users_all_campaigns[0].user_details.length } })
        return
      }
      resp.status(404).json({ message: "no author found" });
      return
    }
    else {
      resp.status(404).json({ message: "Not a valid link" });
      return
    }
  } catch (err) {
    resp.status(500).json({ message: "some err occured" })
    console.log("err ------------ from getCAmpASPAge ", err)
  }
})

//-----------------------
// it is a route which well check that the user is unique and increase the count in the share_count section and it also have a feature of generating coupons code and send it to given email
// ---------------------

router.post("/myDetails/:ShopObjId", async (req, resp) => {
  try {

    if (req.params.ShopObjId.length == 24 && req.body.customerID.length == 24 && req.body.cCode.length == 24) {

      const campaignObj = await campaigns_schema.findOne({
        "_id": (req.params.ShopObjId).toString(), campaign_collection: { $elemMatch: { '_id': (req.body.cCode).toString() } }
      });

      const UserObj = await linkSchema.findOne(
        { _id: req.body.customerID, users_all_campaigns: { $elemMatch: { campaign_name: req.body.cCode } } },
        { _id: 1, "users_all_campaigns.$": 1, user_email: 1 });
      const tempIP = req.body.link

      // ---------------------
      // This is the code to check if the user is clicking again and again to increase the count that's why we keep track of ip
      // ---------------------

      if (!UserObj.users_all_campaigns[0].user_details.includes(tempIP)) {

        try {

          console.log("tempIP  ", tempIP)
          const pushIpToUser = await linkSchema.updateOne(
            { _id: req.body.customerID, users_all_campaigns: { $elemMatch: { campaign_name: req.body.cCode } } },
            { $push: { "users_all_campaigns.$.user_details": tempIP } }, { upsert: true });

        } catch (err) { console.log("its error while dding IP  ", err) }

        // ------------------------
        // Fetching the updated data and chcking for condition if satisfied then generating coupon code and sending the mail.
        // ------------------------
        const UpdatedUserObj = await linkSchema.findOne({ _id: req.body.customerID, users_all_campaigns: { $elemMatch: { campaign_name: req.body.cCode } } });

        console.log("UpdatedUserObj is here now  -=-= ", UpdatedUserObj)

        console.log("condition if ", UpdatedUserObj.users_all_campaigns[0].user_details.length >= campaignObj.campaign_collection[0].campaign_spread)

        if (UpdatedUserObj.users_all_campaigns[0].user_details.length >= campaignObj.campaign_collection[0].campaign_spread) {  

          try {

            await linkSchema.updateOne({
              _id: req.body.customerID, users_all_campaigns: { $elemMatch: { campaign_name: req.body.cCode } }
            }, { $set: { "users_all_campaigns.$.campaign_completed": true } }, { upsert: true });

            console.log("Campaign completed successfuly  ")
            resp.status(200).json({ message: "Campaign completed successfuly" })
            return

          } catch (err) {
            console.log("err campaign not marked true ", err)
          }

          console.log("updated the user count  ")
          resp.status(200).json({ message: "updated the user count" })
          return
        }
        console.log("updated the user count  ")
        resp.status(200).json({ message: "updated the user count" })
        return
      }

      else {
        console.log("user already visited ")
        resp.status(200).json({ message: "user already visited" })
        return
      }

    }
    else {
      resp.status(404).json({ message: "Can't find this page" })
    }
  } catch (err) {
    console.log("its err from the getCampaign as page   ", err)
    resp.status(500).json({ message: "Server is not responding please come back later" })
  }
})

export default router;
