import { DeliveryMethod } from "@shopify/shopify-api";
import salesSchema from "../mongo_database/sales_schema.js"
import all_shops from "../mongo_database/all_shops_schema.js";
import unique_link_schema from "../mongo_database/unique_link_schema.js";

export default {

  ORDERS_PAID: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);

      console.log("payload is -=-=-=-= ", shop)

      try {
        // -------------------------------------------------------------------
        // Adding Sale data to the dataBase
        // ------------------------------------------------------------------- 
        if (payload.discount_codes[0].code) {

          console.log("code is ", payload.discount_codes[0].code)
          // const check_if_its_shop_code = await all_shops.findById(payload.order_status_url.split("/")[3],{all_coupon_code:1})
          const check_if_its_shop_code = await all_shops.findOne({ store_url: shop });
          console.log("check_if_its_shop_code   ", check_if_its_shop_code.all_coupon_code)


          if (check_if_its_shop_code.all_coupon_code.length > 0 && check_if_its_shop_code.all_coupon_code.includes(payload.discount_codes[0].code)) {
            const shopID = await all_shops.findOne({ store_url: shop }, { _id: 1, store_name: 1, availabelBalance: 1 })
            try {
              const sale_data = new salesSchema({
                user_id: payload.customer.id,
                user_first: payload.customer.first_name,
                user_last: payload.customer.last_name,
                user_email: payload.customer.email,
                order_date: payload.customer.created_at,
                store_name: shop,
                store_ID: shopID._id,
                transection_ID: payload.id,
                transection_amount: payload.total_price,
                coupon_code: payload.discount_codes[0].code,
              })

              const respId = await sale_data.save();

              console.log("respId --=-==-=-=--=- ", respId)

            } catch (err) { console.log("webook err is ", err) }

            try {

              console.log("id of the shop is ", payload.order_status_url.split("/")[3] ,"  shop ID  ",shopID.availabelBalance)
              console.log("work from ffice  ",shopID.availabelBalance - (payload.total_price * 0.039) ,"   ",payload.total_price)
              console.log("jndfsps =-=-   ",Number(((shopID.availabelBalance - (payload.total_price * 0.039)).toFixed(2))))

              console.log("discount code is ",payload.discount_codes[0].code)
              
              const add_Transection = await all_shops.findOneAndUpdate({ _id: payload.order_status_url.split("/")[3] },
                {
                  availabelBalance: Number(((shopID.availabelBalance - (payload.total_price * 0.039)).toFixed(2))),
                  $push: {
                    transection: {
                      transection_date: payload.customer.created_at,
                      order_id: payload.id,
                      customer_email: payload.customer.email,
                      coupon_code: payload.discount_codes[0].code,
                      sale_amount: payload.total_price,
                    }
                  }
                  , $pull: { all_coupon_code : payload.discount_codes[0].code }
                })
              console.log("transection added under the shop details ", add_Transection)

            } catch (err) { console.log("adding to all shop failed ", err) }

            try {
              const tempUserSale = await unique_link_schema.findOneAndUpdate({ user_email: payload.customer.email }, {
                $push: {
                  user_all_transectionL: {
                    order_id: payload.id,
                    total_amount: payload.total_price,
                    store_name: shop
                  }
                }
              })
              console.log("transection added under the user_all_transectionL ", tempUserSale)
            } catch (err) {
              console.log("this error is while adding the transection to the user  ", err)
            }
          }
        }
        else {
          console.log("it's not are transection")
        }
      } catch (err) { console.log("error in webhook order paid ", err) }
    },
  },
  
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("app unstalled  ", payload)
      try {
        const tempShop = await all_shops.findByIdAndUpdate(payload.id, { unistalled: true });
        console.log(`${payload.name} unInstall successfuly`)
      }
      catch (err) {
        console.log("This error is coming while unInstallin the app on the store ", err)
      }
    },
  }
};
