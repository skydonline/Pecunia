import mongoose from "mongoose";
import { loadType } from "mongoose-currency";

const Schema = mongoose.Schema;
loadType(mongoose);

const daySchema = new Schema(
    {
        date: String,
        income: {
            type: mongoose.Types.Currency,
            currency: "USD",
            get: (value) => value / 100,
        },
        expenses: {
            type: mongoose.Types.Currency,
            currency: "USD",
            get: (value) => value / 100,
        },
    },
    { toJSON: { getters: true } }
);

const monthSchema = new Schema(
    {
        month: String,
        income: {
            type: mongoose.Types.Currency,
            currency: "USD",
            get: (value) => value / 100,
        },
        expenses: {
            type: mongoose.Types.Currency,
            currency: "USD",
            get: (value) => value / 100,
        },
    },
    { toJSON: { getters: true } }
);

const KPISchema = new Schema(
    {
        netIncome: {
            type: mongoose.Types.Currency,
            currency: "USD",
            get: (value) => value / 100,
        },
        totalIncome: {
            type: mongoose.Types.Currency,
            currency: "USD",
            get: (value) => value / 100,
        },
        totalExpenses: {
            type: mongoose.Types.Currency,
            currency: "USD",
            get: (value) => value / 100,
        },
        expensesByCategory: {
            type: Map,
            of: {
                type: mongoose.Types.Currency,
                curreny: "USD",
                get: (value) => value / 100,
            },
        },
        monthlyData: [monthSchema],
        dailyData: [daySchema],
    },
    { timestamps: true, toJSON: { getters: true } }
);

const KPI = mongoose.model("KPI", KPISchema);

export default KPI;
