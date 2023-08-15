import { Typography } from "@mui/material";

const AppText = ({ children, marginBottom, fontWeight, fontSize }) => {
    return (
        <Typography
            sx={{
                fontFamily: ["Inter", "sans-serif"].join(","),
                fontSize: fontSize,
                fontWeight: fontWeight,
                marginBottom: marginBottom,
                background: `linear-gradient(45deg, #71eef6 30%, #085a60 90%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
            }}
        >
            {children}
        </Typography>
    );
};

export default AppText;
