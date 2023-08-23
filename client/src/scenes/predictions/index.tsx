import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery } from "@/state/api";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import {
    CartesianGrid,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
    Label,
} from "recharts";
import regression, { DataPoint } from "regression";

const Predictions = ({ filteredTransactions, transactions }) => {
    const { palette } = useTheme();
    const [isPredictions, setIsPredictions] = useState(false);
    const { data: kpiData } = useGetKpisQuery();

    const formattedData = useMemo(() => {
        if (!kpiData) {
            return [];
        }

        const monthData = kpiData[0].monthlyData;
        const formatted: Array<DataPoint> = monthData.map(({ income }, i: number) => {
            return [i, income];
        });

        const regressionLine = regression.linear(formatted);

        return monthData.map(({ month, income }, i: number) => {
            return {
                name: month,
                "Actual Income": income,
                Regression: regressionLine.points[i][1],
                "Predicted Income": regressionLine.predict(i + 12)[1],
            };
        });
    }, [kpiData]);

    return (
        <DashboardBox width="100%" height="100%" p="1rem" overflow="hidden">
            <FlexBetween m="1rem 2.5rem" gap="1rem">
                <Box>
                    <Typography variant="h3">Income and Predictions</Typography>
                    <Typography variant="h5">
                        Income and predicted income based on a linear regression model
                    </Typography>
                </Box>
                <Button
                    onClick={() => setIsPredictions(!isPredictions)}
                    sx={{
                        color: isPredictions ? palette.grey[700] : palette.secondary[500],
                        bgcolor: isPredictions ? palette.secondary[500] : palette.grey[700],
                        boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem rgba(0,0,0,0.4)",
                    }}
                >
                    TOGGLE PREDICTED INCOME FOR NEXT YEAR
                </Button>
            </FlexBetween>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={formattedData}
                    margin={{
                        top: 20,
                        right: 75,
                        left: 20,
                        bottom: 80,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={palette.grey[800]} />
                    <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }}>
                        <Label value="Month" offset={-5} position="insideBottom" />
                    </XAxis>
                    <YAxis
                        axisLine={{ strokeWidth: "0" }}
                        style={{ fontSize: "10px" }}
                        tickFormatter={(value) => `$${value}`}
                        domain={[500, 800]}
                    >
                        <Label value="Income" offset={-5} position="insideLeft" angle={-90} />
                    </YAxis>
                    <Tooltip />
                    <Legend verticalAlign="top" />
                    <Line
                        type="monotone"
                        dataKey="Actual Income"
                        stroke={palette.primary.main}
                        strokeWidth={0}
                        dot={{ strokeWidth: 5 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="Regression"
                        name="Regression line"
                        stroke="#8884d8"
                        dot={false}
                    />
                    {isPredictions && (
                        <Line
                            strokeDasharray="5 5"
                            dataKey="Predicted Income"
                            stroke={palette.secondary[500]}
                            dot={false}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </DashboardBox>
    );
};
export default Predictions;
