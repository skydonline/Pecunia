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
import axios from "axios";

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
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
            "PLAID-SECRET": process.env.PLAID_SECRET,
        },
    },
});

const plaidClient = new PlaidApi(configuration);

/* Get the link token */
app.get("/get-link-token", async (req, res) => {
    try {
        const response = await axios.post("https://development.plaid.com/link/token/create", {
            client_id: process.env.PLAID_CLIENT_ID,
            secret: process.env.PLAID_SECRET,
            user: {
                client_user_id: "user-id",
            },
            client_name: "Pecunia",
            products: ["auth", "transactions"],
            country_codes: ["US", "CA"],
            language: "en",
        });

        res.json({ link_token: response.data.link_token });
    } catch (error) {
        console.error("Error generating Link token:", error);
        res.status(500).json({ error: "Unable to generate Link token" });
    }
});

/* Echange public token for access token */
app.post("/exchange-public-token", async (req, res) => {
    const { public_token } = req.body;

    try {
        const response = await axios.post(
            `https://${process.env.PLAID_ENV}.plaid.com/item/public_token/exchange`,
            {
                client_id: process.env.PLAID_CLIENT_ID,
                secret: process.env.PLAID_SECRET,
                public_token,
            }
        );

        res.json({ access_token: response.data.access_token });
    } catch (error) {
        console.error("Error exchanging public token:", error);
        res.status(500).json({ error: "Unable to exchange public token" });
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
