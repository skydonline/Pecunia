import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useGetKpisQuery, useGetProductsQuery } from "@/state/api";
import { Box, Typography, useTheme } from "@mui/material";
import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from "recharts";
import { useMemo } from "react";
import FlexBetween from "@/components/FlexBetween";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DifferenceIcon from "@mui/icons-material/Difference";

const piedata = [
    { name: "Group A", value: 600 },
    { name: "Group B", value: 400 },
];

const Row2 = () => {
    const { data } = useGetKpisQuery();
    const { data: productData } = useGetProductsQuery();
    const { palette } = useTheme();

    const pieColors = [palette.primary[800], palette.primary[300]];

    const incomeExpenses = useMemo(() => {
        return (
            data &&
            data[0].monthlyData.map(({ month, income, expenses }) => {
                return {
                    name: month.substring(0, 3),
                    income: income,
                    expenses: expenses,
                };
            })
        );
    }, [data]);

    const productExpenseData = useMemo(() => {
        return (
            productData &&
            productData.map(({ _id, price, expense }) => {
                return {
                    id: _id,
                    price: price,
                    expense: expense,
                };
            })
        );
    }, [productData]);

    const expenses = useMemo(() => {
        return (
            data &&
            data[0].monthlyData.map(({ month, expenses }) => {
                return {
                    name: month.substring(0, 3),
                    expenses: expenses,
                };
            })
        );
    }, [data]);

    return (
        <>
            <DashboardBox gridArea="d">
                <BoxHeader title="Monthly Income vs Expenses" icon={DifferenceIcon} />
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={incomeExpenses}
                        margin={{
                            top: 20,
                            right: 0,
                            left: -10,
                            bottom: 55,
                        }}
                    >
                        <CartesianGrid vertical={false} stroke={palette.grey[800]} />
                        <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }} />
                        <YAxis
                            yAxisId="left"
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: "10px" }}
                            domain={[8000, 23000]}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: "10px" }}
                            domain={[8000, 23000]}
                        />
                        <Tooltip />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="income"
                            stroke={palette.tertiary[500]}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="expenses"
                            stroke={palette.primary.main}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </DashboardBox>

            <DashboardBox gridArea="f">
                <BoxHeader title="Monthly Expenses" icon={CreditCardIcon} />
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={expenses}
                        margin={{
                            top: 20,
                            right: 25,
                            left: -10,
                            bottom: 50,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor={palette.primary[300]}
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={palette.primary[300]}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }} />
                        <YAxis tickLine={false} style={{ fontSize: "10px" }} />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="expenses"
                            dot={true}
                            stroke={palette.primary.main}
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </DashboardBox>
        </>
    );
};

export default Row2;
