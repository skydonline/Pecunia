import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv, { config } from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import kpiRoutes from "./routes/kpi.js";
import productRoutes from "./routes/product.js";
import transactionRoutes from "./routes/transaction.js";
import KPI from "./models/KPI.js";
import Product from "./models/Product.js";
import Transaction from "./models/Transaction.js";
import { kpisSample, products, transactions } from "./data/data-sample2.js";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* PLAID */
const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
            "PLAID-SECRET": process.env.PLAID_SECRET,
        },
    },
});

const plaidClient = new PlaidApi(configuration);

/* Get the link token */
app.post("/api/create_link_token", async function (req, response) {
    // Get the client user id by searching for the current user
    const plaidRequest = {
        user: {
            client_user_id: "user",
        },
        client_name: "Plaid Test App",
        products: ["auth"],
        language: "en",
        redirect_uri: "http://localhost:5173/",
        country_codes: ["US"],
    };
    try {
        const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
        response.json(createTokenResponse.data);
    } catch (error) {
        response.status(500).send("Failed to retrieve link token");
    }
});

/* Echange public token for access token */
app.post("/api/exchange_public_token", async function (request, response, next) {
    const publicToken = request.body.public_token;
    try {
        const plaidResponse = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });
        const accessToken = plaidResponse.data.access_token;
        response.json({ accessToken });
    } catch (error) {
        response.status(500).send("Failed to retrieve access token");
    }
});

/* Authenticate user */
app.post("/auth", async function (request, response) {
    try {
        const access_token = request.body.access_token;
        const plaidRequest = {
            access_token: access_token,
        };
        const plaidResponse = await plaidClient.authGet(plaidRequest);
        response.json(plaidResponse.data);
    } catch (error) {
        response.status(500).send("Failed to authenticate user");
    }
});

/* ROUTES */
app.use("/kpi", kpiRoutes);
app.use("/product", productRoutes);
app.use("/transaction", transactionRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose
    .connect(process.env.MONGO_URL, {})
    .then(async () => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

        // ONLY ADD DATA ONCE
        await mongoose.connection.db.dropDatabase();
        KPI.insertMany(kpisSample);
        Product.insertMany(products);
        Transaction.insertMany(transactions);
    })
    .catch((error) => console.log(`ERROR: ${error} did not connect.`));
