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
    ScatterChart,
    Scatter,
    ZAxis,
} from "recharts";
import { useMemo } from "react";
import FlexBetween from "@/components/FlexBetween";

const piedata = [
    { name: "Group A", value: 600 },
    { name: "Group B", value: 400 },
];

const Row2 = () => {
    const { data } = useGetKpisQuery();
    const { data: productData } = useGetProductsQuery();
    const { palette } = useTheme();

    const pieColors = [palette.primary[800], palette.primary[300]];

    const mandatoryExpenses = useMemo(() => {
        return (
            data &&
            data[0].monthlyData.map(({ month, mandatoryExpenses, nonMandatoryExpenses }) => {
                return {
                    name: month.substring(0, 3),
                    mandatoryExpenses: mandatoryExpenses,
                    nonMandatoryExpenses: nonMandatoryExpenses,
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

    return (
        <>
            <DashboardBox gridArea="d">
                <BoxHeader title="Mandatory vs Non-Mandatory expenses" sideText="+4%" />
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={mandatoryExpenses}
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
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="nonMandatoryExpenses"
                            stroke={palette.tertiary[500]}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="mandatoryExpenses"
                            stroke={palette.primary.main}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </DashboardBox>

            <DashboardBox gridArea="e">
                <BoxHeader title="Campaigns and targets" sideText="+4%" />
                <FlexBetween mt="0.25rem" gap="1.5rem" pr="1rem">
                    <PieChart
                        width={110}
                        height={100}
                        margin={{
                            top: 0,
                            right: -10,
                            left: 10,
                            bottom: 0,
                        }}
                    >
                        <Pie
                            stroke="none"
                            data={piedata}
                            innerRadius={18}
                            outerRadius={38}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {piedata.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieColors[index]} />
                            ))}
                        </Pie>
                    </PieChart>
                    <Box ml="-0.7rem" flexBasis="40%">
                        <Typography variant="h5">Target Sales</Typography>
                        <Typography m="0.3rem 0" variant="h3" color={palette.primary[300]}>
                            83
                        </Typography>
                        <Typography variant="h6">Finance goals of Campaign</Typography>
                    </Box>
                    <Box ml="-0.7rem" flexBasis="40%">
                        <Typography variant="h5">Income losses</Typography>
                        <Typography variant="h6" color={palette.primary[300]}>
                            Loses down 25%
                        </Typography>
                        <Typography mt="0.4rem" variant="h5">
                            Profit Margins
                        </Typography>
                        <Typography variant="h6">Margins up 30%</Typography>
                    </Box>
                </FlexBetween>
            </DashboardBox>

            <DashboardBox gridArea="f">
                <BoxHeader title="Product prices vs Expenses" sideText="+4%" />
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{
                            top: 20,
                            right: 25,
                            bottom: 40,
                            left: -10,
                        }}
                    >
                        <CartesianGrid stroke={palette.grey[800]} />
                        <XAxis
                            type="number"
                            dataKey="price"
                            name="price"
                            tickFormatter={(value) => `$${value}`}
                            tickLine={false}
                            axisLine={false}
                            style={{ fontSize: "10px" }}
                        />
                        <YAxis
                            type="number"
                            dataKey="expense"
                            name="expense"
                            tickFormatter={(value) => `$${value}`}
                            tickLine={false}
                            axisLine={false}
                            style={{ fontSize: "10px" }}
                        />
                        <ZAxis type="number" range={[20]} />
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Scatter
                            name="Product Expense Ratio"
                            data={productExpenseData}
                            fill={palette.tertiary[500]}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </DashboardBox>
        </>
    );
};

export default Row2;
