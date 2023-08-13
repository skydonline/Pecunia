import { Box, SvgIcon, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import React from "react";

type Props = {
    icon?: typeof SvgIcon;
    title: string;
    subtitle?: string;
    sideText?: string;
};

const BoxHeader = ({ icon, title, subtitle, sideText }: Props) => {
    const { palette } = useTheme();
    return (
        <FlexBetween color={palette.grey[400]} margin="1.5rem 1rem 0 1rem">
            <FlexBetween>
                <Box width="100%">
                    <Typography variant="h3" mb="-0.1rem">
                        {title}
                    </Typography>
                    <Typography variant="h5">{subtitle}</Typography>
                </Box>
            </FlexBetween>
            <Typography variant="h5" fontWeight="700" color={palette.secondary[500]}>
                {sideText}
            </Typography>

            {icon && (
                <Box color={palette.secondary[500]}>
                    <SvgIcon sx={{ fontSize: 24 }} component={icon} />
                </Box>
            )}
        </FlexBetween>
    );
};

export default BoxHeader;
