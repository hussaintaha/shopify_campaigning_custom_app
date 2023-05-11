import { BillingInterval, LATEST_API_VERSION } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import {MongoDBSessionStorage} from '@shopify/shopify-app-session-storage-mongodb';
import { restResources } from "@shopify/shopify-api/rest/admin/2023-01";
import dotenv from "dotenv"
dotenv.config();

console.log("process dot env url mongodb ",process.env.MONGODB_PATH)
const MONGODB_PATH = `${process.env.MONGODB_PATH}`;
// const MONGODB_PATH = `mongodb://localhost:27017/`;

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.

const billingConfig = {
  "demoCharges": {
    // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
    amount: process.env.MONTHLY_CHARGES,
    currencyCode: "USD",
    interval: BillingInterval.Every30Days,
  },
};

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES,
  hostName: process.env.HOST,
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
    billing: billingConfig, // or replace with billingConfig above to enable example billing
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  // This should be replaced with your preferred storage strategy
  // sessionStorage: new SQLiteSessionStorage(DB_PATH),
  sessionStorage: new MongoDBSessionStorage(
    MONGODB_PATH,
    'product_discount'
  )
});

export default shopify;
