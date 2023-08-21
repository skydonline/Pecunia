import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery } from "@/state/api";
import { Box, Typography, useTheme } from "@mui/material";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import SavingsIcon from "@mui/icons-material/Savings";
import { useMemo } from "react";
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const piedata = [
    { name: "Investments", value: 4264.63 },
    { name: "Cash", value: 20996.47 },
];

const investmentsValue = piedata[0].value;
const cashValue = piedata[1].value;

const Row1 = ({ transactions, balance }) => {
    const { palette } = useTheme();
    const { data } = useGetKpisQuery();
    const pieColors = [palette.primary[700], palette.primary[500]];

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

    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    let greeting: string;

    if (currentHour < 12) {
        greeting = "Good morning, Sky.";
    } else if (currentHour < 18) {
        greeting = "Good afternoon, Sky.";
    } else {
        greeting = "Good evening, Sky.";
    }

    return (
        <>
            <DashboardBox gridArea="a" display="flex" alignItems="center" justifyContent="center">
                <Box>
                    <Typography
                        sx={{
                            background: "linear-gradient(45deg, #71eef6 30%, #085a60 90%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                        textAlign="center"
                        fontWeight="700"
                        fontSize={40}
                    >
                        {greeting}
                    </Typography>
                    <Typography
                        sx={{
                            background: "linear-gradient(45deg, #524f82 30%, #b8b5e8 90%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                        textAlign="center"
                        fontWeight="600"
                        fontSize={30}
                    >
                        Welcome to Pecunia.
                    </Typography>
                </Box>
            </DashboardBox>

            <DashboardBox gridArea="b">
                <BoxHeader title="Net Worth" icon={SavingsIcon} />
                <Box display="flex" justifyContent="center" alignItems="center">
                    <PieChart
                        width={210}
                        height={240}
                        margin={{
                            top: 0,
                            right: 0,
                            left: 30,
                            bottom: 0,
                        }}
                    >
                        <Pie
                            stroke="none"
                            data={piedata}
                            innerRadius={35}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {piedata.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieColors[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" />
                    </PieChart>
                    <Box
                        display="flex"
                        flexWrap="wrap"
                        flexDirection="column"
                        margin="1.5rem 1rem 0 3rem"
                    >
                        <Box flexBasis="40%">
                            <Typography variant="h3">Cash</Typography>
                            <Typography m="0.3rem 0" variant="h3" color={palette.primary[300]}>
                                ${cashValue}
                            </Typography>
                            <Typography variant="h5">Chequing and Savings</Typography>
                        </Box>
                        <Box flexBasis="40%" marginTop={4}>
                            <Typography variant="h3">Investments</Typography>
                            <Typography m="0.3rem 0" variant="h3" color={palette.primary[300]}>
                                ${investmentsValue}
                            </Typography>
                            <Typography variant="h5">TFSA</Typography>
                        </Box>
                    </Box>
                </Box>
            </DashboardBox>

            <DashboardBox gridArea="c">
                <BoxHeader title="Monthly Income" icon={LocalAtmIcon} />
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={income}
                        margin={{
                            top: 17,
                            right: 15,
                            left: -5,
                            bottom: 50,
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
                        <Bar dataKey="income" fill="url(#colorIncome)" />
                    </BarChart>
                </ResponsiveContainer>
            </DashboardBox>
        </>
    );
};

export default Row1;
