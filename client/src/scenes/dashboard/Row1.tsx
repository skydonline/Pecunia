import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useGetKpisQuery } from "@/state/api";
import { useTheme } from "@mui/material";
import { useMemo } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    YAxis,
    Tooltip,
    Area,
    Line,
    CartesianGrid,
    Legend,
    LineChart,
    BarChart,
    Bar,
} from "recharts";

const Row1 = () => {
    const { palette } = useTheme();
    const { data } = useGetKpisQuery();
    console.log("data:", data);

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

    const incomeNetIncome = useMemo(() => {
        return (
            data &&
            data[0].monthlyData.map(({ month, income, expenses }) => {
                return {
                    name: month.substring(0, 3),
                    income: income,
                    netIncome: (income - expenses).toFixed(2),
                };
            })
        );
    }, [data]);

    const income = useMemo(() => {
        return (
            data &&
            data[0].monthlyData.map(({ month, income }) => {
                return {
                    name: month.substring(0, 3),
                    income: income,
                };
            })
        );
    }, [data]);

    return (
        <>
            <DashboardBox gridArea="a">
                <BoxHeader
                    title="Income and Expenses"
                    subtitle="top line represents income, bottom line represents expenses"
                    sideText="+4%"
                />
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        width={500}
                        height={400}
                        data={incomeExpenses}
                        margin={{
                            top: 15,
                            right: 25,
                            left: -10,
                            bottom: 60,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor={palette.primary[300]}
                                    stopOpacity={0.5}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={palette.primary[300]}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor={palette.primary[300]}
                                    stopOpacity={0.5}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={palette.primary[300]}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }} />
                        <YAxis
                            axisLine={{ strokeWidth: "0" }}
                            tickLine={false}
                            style={{ fontSize: "10px" }}
                            domain={[8000, 23000]}
                        />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="income"
                            dot={true}
                            stroke={palette.primary.main}
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                        />
                        <Area
                            type="monotone"
                            dataKey="expenses"
                            dot={true}
                            stroke={palette.primary.main}
                            fillOpacity={1}
                            fill="url(#colorExpenses)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </DashboardBox>

            <DashboardBox gridArea="b">
                <BoxHeader
                    title="Income and Net Income"
                    subtitle="top line represents income, bottom line represents net income"
                    sideText="+4%"
                />
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={incomeNetIncome}
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
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: "10px" }}
                        />
                        <Tooltip />
                        <Legend
                            height={20}
                            wrapperStyle={{
                                margin: "0 0 10px 0",
                            }}
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="netIncome"
                            name="net income"
                            stroke={palette.tertiary[500]}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="income"
                            stroke={palette.primary.main}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </DashboardBox>

            <DashboardBox gridArea="c">
                <BoxHeader
                    title="Income Month by Month"
                    subtitle="graph representing monthly income"
                    sideText="+4%"
                />
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={income}
                        margin={{
                            top: 17,
                            right: 15,
                            left: -5,
                            bottom: 58,
                        }}
                    >
                        <CartesianGrid vertical={false} stroke={palette.grey[800]} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: "10px" }}
                        />
                        <YAxis axisLine={false} tickLine={false} style={{ fontSize: "10px" }} />
                        <Tooltip />
                        <Bar dataKey="income" fill="url(#colorIncome)" />
                    </BarChart>
                </ResponsiveContainer>
            </DashboardBox>
        </>
    );
};

export default Row1;
