import Router from "express"
import sales_schema from "../mongo_database/sales_schema.js";
import unique_link_schema from "../mongo_database/unique_link_schema.js";
import promo_setup_link from "../mongo_database/promo_setup_link_schema.js";
import shopify from "../shopify.js";
import shopify_session_schema from "../mongo_database/shopify_session_schema.js";
import faq_schema from "../mongo_database/faq_schema.js"


const router = Router();

router.get("/test", async (req, resp) => {
  console.log("admin Merchant route is working")
  resp.status(200).json("admin Merchant route is working")
})

router.get("/overview", async (req, resp) => {
  try {

    const shareCount = await unique_link_schema.aggregate([
      {
        $match: {
          all_registered_shops: resp.locals.shopify.session.shop
        }
      },
      {
        $unwind: "$users_all_campaigns"
      },
      {
        $match: {
          "users_all_campaigns.shop_name": resp.locals.shopify.session.shop
        }
      },
      {
        $replaceRoot: {
          newRoot: "$users_all_campaigns"
        }
      }
    ])

    const totalShare = shareCount.reduce(((total, num) => {
      // console.log(num.user_details)
      return total + num.user_details.length
    }), 0)


    const totalSale = await sales_schema.find({ "store_name": resp.locals.shopify.session.shop },
      { transection_amount: 1, _id: 0 })


    const totalSaleAmmount = totalSale.reduce((total, element) => {
      // console.log(total, "  -==--==-=-=--==- ", element.transection_amount)
      return total = total + element.transection_amount
    }, 0)

    const lastFiveSale = await sales_schema.find({"store_name": resp.locals.shopify.session.shop }).sort({ _id: -1 }).limit(5)
    console.log("last 5 customer   ", lastFiveSale)

    resp.status(200).json({
      message: "Here is the over view of your campaign",
      data: { totalSale: totalSale.length, saleVolume: Number(totalSaleAmmount.toFixed(2)), totalShare: shareCount.length, total_Friedns_Reach: totalShare },
      customersSale: lastFiveSale
    })
  }
  catch (err) {
    console.log(" Error from the admin merchant api totalsale route ")
    console.log(err)
    resp.status(500).json({ message: " Error from the admin merchant api sales route " })
  }
})

//this route will take the  shop name from the resp and return the total sale for the shop
router.get("/performance/sales/:pageNo", async (req, resp) => {

  try {
    const documentCount = await sales_schema.find({ "store_name": resp.locals.shopify.session.shop }).countDocuments()
    const totalSale = await sales_schema.find({ "store_name": resp.locals.shopify.session.shop },
      { order_date: 1, user_email: 1, transection_ID: 1, user_first: 1, user_last: 1, transection_amount: 1, coupon_code: 1, _id: 0 }
    ).sort({ _id: -1 }).limit(10).skip((req.params.pageNo - 1) * 10)
    console.log("total sale ", totalSale)
    resp.status(200).json({ message: "All the transection got by This app", data: totalSale, documentCount: documentCount })
  }
  catch (err) {
    console.log(" Error from the admin merchant api totalsale route ")
    console.log(err)
    resp.status(500).json({ message: " Error from the admin merchant api sales route " })
  }
})

//this route will return the share and the total friends reach
router.get("/performance/share", async (req, resp) => {
  try {
    console.log("its inside performance share")

    // IMP check how to remove the not required data from the responce 
    const shareCount = await unique_link_schema.aggregate([
      {
        $match: {
          all_registered_shops: resp.locals.shopify.session.shop
        }
      },
      {
        $unwind: "$users_all_campaigns"
      },
      {
        $match: {
          "users_all_campaigns.shop_name": resp.locals.shopify.session.shop
        }
      },
      {
        $replaceRoot: {
          newRoot: "$users_all_campaigns"
        }
      }
    ])

    console.log("shareCount ", shareCount)

    // const totalShare = shareCount.reduce(((total, num) => {
    //   console.log(num.user_details)
    //   return total + num.user_details.length
    // }), 0)

    // const tempData = await unique_link_schema.find({},{users_all_campaigns:{_id:1,createdAt:1},_id:0})

    resp.status(200).json({ message: "Got the data from the server", data: shareCount })
  }
  catch (err) {
    console.log(" Error from the admin merchant api user/state route ")
    console.log(err)
    resp.status(500).json({ message: " Error from the admin merchant api sales route " })
  }
})

router.get("/customers/sale", async (req, resp) => {
  try {
    const now = new Date()
    const FromDate = new Date(now.getFullYear(), now.getMonth() - 11)
    console.log("FromDate -=-=-= ", FromDate)
    const saleTabel = await sales_schema.find({ store_name: resp.locals.shopify.session.shop, order_date: { $gte: FromDate } }, { order_date: 1, transection_amount: 1, _id: 0 })
    console.log("Responce from /customers/sale -=-=-= ", saleTabel)

    resp.status(200).json({ message: "Here is the last one Year sales data ", data: saleTabel })
  } catch (err) {
    console.log("It's error from the /customers/sale ", err)
    resp.status(500).json({ message: "Some Error on the Server" })
  }
})

// router.get("/customers/sale", async (req, resp) => {
// })

//Get theme Id of the current store 
router.get("/themeID", async (req, resp) => {
  try {
    console.log("shop name is ", resp.locals.shopify.session.shop)
    const shopSession = await shopify_session_schema.findOne({ shop: resp.locals.shopify.session.shop })

    const shopThemeArray = await shopify.api.rest.Theme.all({
      session: shopSession,
    });

    resp.status(200).json({ message: " Here if the shop theme collection ", data: { themArray: shopThemeArray, shop: (resp.locals.shopify.session.shop).replace(".myshopify.com", "") } });

  } catch (err) {
    console.log("err from the /themeID  ", err)
    resp.status(500).json("Server is having high trafic try again")
  }

})

// Get introduction video
router.get("/promo/link", async (req, resp) => {
  try {
    console.log("promo Link")
    const linkData = await promo_setup_link.find({}, { _id: 0 })

    // resp.status(200).json({ message: "Introduction video link" , link : linkData})
    resp.status(200).json(linkData)
  }
  catch (err) {
    console.log("error from the promo/:videoLink ", err)
  }
})


//Customer Support
router.get("/support/faq",async(req,resp)=>{
  try{
    if(resp.locals.shopify.session.shop){
      const tempList = await faq_schema.find().sort({_id:-1})  
      resp.status(200).json({message:"Here is the Faq List",data:tempList})
    }
    else{
      resp.status(404).json({message:"No Such page found"})
    }
  }
  catch(err){
    console.log("err from faq schema get ")
    resp.status(500).json({message:"Server is bussy try again later"})
  }
})


export default router

