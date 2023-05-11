import Router from "express"
import shopSchema from "../mongo_database/all_shops_schema.js"
import shopSession from "../mongo_database/shopify_session_schema.js"
import shopify from "../shopify.js";

const router = Router()

router.get("/", async (_, resp) => {
    console.log("add me to teh shop")

    try {
        if (Object.keys(resp.locals.shopify.session).length > 0) {

            // console.log("shop name -=-=- ",resp.locals.shopify.session)
            const checkShopAvailabel = await shopSchema.find({ store_url: resp.locals.shopify.session.shop });
            console.log("checkShopAvailabel ", checkShopAvailabel)

            if (!checkShopAvailabel.length > 0) {

                const currentShopSession = await shopSession.findOne({ shop: resp.locals.shopify.session.shop }, { _id: 0 });
                const currentShopData = await shopify.api.rest.Shop.all({ session: currentShopSession });

                // console.log("------------------ -------   ", currentShopData[0])
                const { id, name, email, domain, country_name } = currentShopData[0];

                const NewShop = new shopSchema({
                    _id: id,
                    store_url: domain,
                    store_name: name,
                    store_email: email,
                    store_country: country_name,
                    unistalled: false,
                    availabelBalance: 10
                });

                // console.log("shop saved ", TempNewShop)

                resp.status(200).json(`Welcome ${resp.locals.shopify.session.shop}`)

            } else {

                await shopSchema.findOneAndUpdate({ store_url: resp.locals.shopify.session.shop }, { unistalled: false });
                resp.status(200).json(`Welcome back ${resp.locals.shopify.session.shop}`)
            }
        }
    } catch (err) {
        resp.status(500).json({ message: "Some Error On The Server", data: {} })
        console.log("error is -= ", err)
    }
})


export default router
