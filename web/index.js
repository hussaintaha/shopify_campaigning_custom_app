// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./webhook/gdpr.js";

import cors from "cors";
import OrderWebhookHandler from "./webhook/orderWebhook.js"
import campain_Route from "./Routes/campaigns.js";
import GetMedia from "./Routes/getMedia.js";
import GetCampaignPage from "./Routes/getCampaignPage.js"
import GenerateLink from "./Routes/generateLink.js";
import connect_mongo from "./mongo_database/mongo_connection.js";
import AddTheShop from "./Routes/addTheNewShop.js"
import AdminMerchant from "./Routes/merchant.admin.js"

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

connect_mongo();

// console.log("PROCES", process.cwd())
const corsOptions = {
  "origin": "*",
  "methods": "GET,POST",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
  // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
app.use(cors());


// ----------------------------- WebHook ---------------------------

app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: OrderWebhookHandler })
);

// ----------------------------- WebHook ---------------------------

app.use(express.json());

//------------------------unAuthenticatedRoute----------------
// app.use("/api/admin/merchant", AdminMerchant)
app.use("/generate", cors(corsOptions), GenerateLink);
app.use("/page", GetCampaignPage);
app.use("/api/getThumbnail", GetMedia);
//------------------------unAuthenticatedRoute------------------------


// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());


app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  async (req, res, next) => {
    const session = res.locals.shopify.session;
    const hasPayment = await shopify.api.billing.check({
      session,
      plans: ['demoCharges'],
      isTest: true,
    });

    if (hasPayment) {
      next();
    } else {
      res.redirect(
        await shopify.api.billing.request({
          session,
          plan: 'demoCharges',
          isTest: true,
        }),
      );
    }
  },
  shopify.redirectToShopifyOrAppRoot()
);

app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

// -----------------------------extra added code-------------------
// custom api for working with the campaigns which includes create, update and fetch. 


app.use("/api/campaigns", campain_Route);
app.use("/api/addme", AddTheShop);
app.use("/api/admin/merchant", AdminMerchant) // In testing make it unauthenticated route

// -----------------------------extra added code-------------------

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
