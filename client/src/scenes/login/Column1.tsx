import { Box, useTheme } from "@mui/material";
import { ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from "recharts";

// Random margins
function getRandomTopMargin() {
    return Math.floor(Math.random() * (150 - 20 + 1)) + 20;
}

function getRandomMargin() {
    return Math.floor(Math.random() * 101);
}

// Generate 7 random data points for scatter chart
const minX = 10;
const maxX = 200;
const minY = 100;
const maxY = 2000;

function getRandomData(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomDataPoints = [];
for (let i = 0; i < 7; i++) {
    const x = getRandomData(minX, maxX);
    const y = getRandomData(minY, maxY);
    randomDataPoints.push({ x, y });
}

// Remove ticks
const CustomTick = () => null;

// Grid section
const Column1 = () => {
    const { palette } = useTheme();

    return (
        <>
            <Box gridArea="a">
                <Box
                    sx={{
                        margin: `${getRandomTopMargin()}px ${getRandomMargin()}px ${getRandomMargin()}px ${getRandomMargin()}px`,
                    }}
                    display="flex"
                >
                    <ResponsiveContainer width="80%" height={250}>
                        <ScatterChart>
                            <XAxis
                                dataKey="x"
                                tickLine={false}
                                tick={<CustomTick />}
                                domain={[0, 210]}
                            />
                            <YAxis
                                dataKey="y"
                                tickLine={false}
                                tick={<CustomTick />}
                                domain={[0, 2100]}
                            />
                            <Scatter
                                name="A school"
                                data={randomDataPoints}
                                fill={palette.primary[500]}
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </>
    );
};

export default Column1;
