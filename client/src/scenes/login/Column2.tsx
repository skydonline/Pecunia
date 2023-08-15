import { Box, useTheme } from "@mui/material";
import { Cell, Pie, PieChart } from "recharts";

// Random margins
function getRandomTopMargin() {
    return Math.floor(Math.random() * (150 - 20 + 1)) + 20;
}

function getRandomMargin() {
    return Math.floor(Math.random() * 101);
}

// Generate 4 random values for pie chart
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const segmentNames = ["A", "B", "C", "D"];

const totalValue = 100;
let remainingValue = totalValue;

const pieData = segmentNames.map((name, index) => {
    const maxSegmentValue = Math.min(remainingValue - (segmentNames.length - index - 1) * 10, 40);
    const value = getRandomValue(5, maxSegmentValue);
    remainingValue -= value;

    return {
        name,
        value,
    };
});

// Grid section
const Column2 = () => {
    const { palette } = useTheme();
    const pieColors = [
        palette.primary[800],
        palette.primary[600],
        palette.primary[400],
        palette.primary[200],
    ];

    return (
        <Box gridArea="c">
            <Box
                sx={{
                    margin: `${getRandomTopMargin()}px ${getRandomMargin()}px ${getRandomMargin()}px ${getRandomMargin()}px`,
                }}
                display="flex"
            >
                <PieChart width={240} height={240} margin={{ left: 40 }}>
                    <Pie
                        stroke="none"
                        data={pieData}
                        innerRadius={40}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieColors[index]} />
                        ))}
                    </Pie>
                </PieChart>
            </Box>
        </Box>
    );
};

export default Column2;
