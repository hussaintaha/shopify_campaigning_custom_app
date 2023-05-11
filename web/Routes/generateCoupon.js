import shopify from "../shopify.js"
import campaigns_schema from "../mongo_database/campaigns_schema.js"
import linkSchema from "../mongo_database/unique_link_schema.js"
import shopifySchema from "../mongo_database/shopify_session_schema.js"
import all_shops from "../mongo_database/all_shops_schema.js"
import Shopify from "shopify-api-node"



export default async function generateCouponCode(email, shopID, cCode) {

  console.log("email  ", email)
  console.log("shopID  ", shopID)
  console.log("cCode ", cCode)

  const campaignObj = await campaigns_schema.findOne({
    shopID: shopID, campaign_collection: { $elemMatch: { '_id': (cCode).toString() } }
  });

  const UserObj = await linkSchema.findOne(
    { user_email: email, users_all_campaigns: { $elemMatch: { campaign_name: cCode } } },
    { _id: 1, "users_all_campaigns.$": 1, user_email: 1 });


  const shopSessionFromDb = await shopifySchema.findOne({ shop: campaignObj.shopID })

  const client = new shopify.api.clients.Graphql({ session: shopSessionFromDb });
  

console.log("7 before generating coupon code ", client, "discount percentage is ", campaignObj.campaign_collection[0].campaign_discount)

console.log("percentage     -=-=-=--=-=-= ", (campaignObj.campaign_collection[0].campaign_discount) / 100)

try {

  const data = await client.query({
    data: {
      "query": `mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
                                discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
                                 codeDiscountNode {
                                   codeDiscount {
                                     ... on DiscountCodeBasic {
                                       title
                                       codes(first: 10) {
                                         nodes {
                                           code
                                         }
                                       }
                                       startsAt
                                       endsAt
                                       customerSelection {
                                         ... on DiscountCustomerAll {
                                           allCustomers
                                         }
                                       }
                                       customerGets {
                                         value {
                                           ... on DiscountPercentage {
                                             percentage
                                           }
                                         }
                                         items {
                                           ... on AllDiscountItems {
                                             allItems
                                           }
                                         }
                                       }
                                       appliesOncePerCustomer
                                     }
                                   }
                                 }
                                 userErrors {
                                   field
                                   code
                                   message
                                 }
                               }
                             }`,
      "variables": {
        "basicCodeDiscount": {
          "title": UserObj.user_email,
          "code": Math.random().toString(36).slice(2).toLocaleUpperCase(),
          "startsAt": new Date(),
          // "endsAt": "2022-09-21T00:00:00Z",
          "customerSelection": {
            "all": true
          },
          "customerGets": {
            "value": {
              "percentage": (campaignObj.campaign_collection[0].campaign_discount) / 100
            },
            "items": {
              "all": true
            }
          },
          "usageLimit": 1
          // "appliesOncePerCustomer": true
        }
      },
    },
  });

  // -------------------------
  // Adding the coupon code to the data base in the link schema so that if we want we can check or send it after some time also and also it help's to keep track of the code.
  // -------------------------

  const TempUserObject = { customer_coupon_code: `${data.body.data.discountCodeBasicCreate.codeDiscountNode.codeDiscount.codes.nodes[0].code}`, customer_id: (UserObj._id).toString() }

  console.log("TempUserObject   ", TempUserObject)
  const FindTheShop = await all_shops.find({ store_url: campaignObj.shopID })
  // console.log("9 -------------------------------------------------------------")

  try {
    const pushingCouponToTheDb = await all_shops.findOneAndUpdate(
      { store_url: campaignObj.shopID },
      { $push: { all_coupon_code: TempUserObject.customer_coupon_code } },
      { upsert: true }
    );
    console.log("Pushing Coupon To The Database  ", pushingCouponToTheDb)
  }
  catch (err) {
    console.log("catch err while generating and adding the coupon code ", err)
    return { message: "can't push the code to the database", success: false }
  }

  return { message: "Here is your coupon code", success: true, data: TempUserObject.customer_coupon_code }
  // ---------------------------------------------
  // This section is for coupon creation end logic
  // End
  // ---------------------------------------------

}
catch (err) {
  console.log("coupon cn't be generated  ", err)
  return { message: "Some error while generating the coupon code", success: false }
}
}