import { useMemo, useEffect, useState, useCallback } from "react";
import { Box, CssBaseline, ThemeProvider, Button, Typography, useMediaQuery } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "@/scenes/navbar";
import Dashboard from "@/scenes/dashboard";
import Predictions from "@/scenes/predictions";
import axios from "axios";
import ConnectButton from "./components/ConnectButton";
import AppText from "./components/AppText";
import Column1 from "./scenes/login/Column1";
import Column2 from "./scenes/login/Column2";
import { usePlaidLink, PlaidLinkOptions, PlaidLinkOnSuccess, PlaidLink } from "react-plaid-link";

/* Defines default URL */
axios.defaults.baseURL = "http://localhost:1337/";

/* Once user has logged in */
function PlaidAuth({ accessToken }) {
    const [account, setAccount] = useState();
    const theme = useMemo(() => createTheme(themeSettings), []);

    return (
        <div className="app">
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/predictions" element={<Predictions />} />
                        </Routes>
                    </Box>
                </ThemeProvider>
            </BrowserRouter>
        </div>
    );
}

/* Login Page Formatting */
const gridTemplateLargeScreens = `
  "a b c"
  "a b c"
  "a b c"
  "a b c"
  "a b c"
  "a b c"
  "a b c"
  "a b c"
  "a b c"
  "a b c"
`;

const gridTemplateSmallScreens = `
  "b"
`;

/* LOGIN PAGE */
const App = () => {
    const [publicToken, setPublicToken] = useState();
    const [accessToken, setAccessToken] = useState();
    const isAboveMediumScreens = useMediaQuery("(min-width: 1250px)");
    const theme = useMemo(() => createTheme(themeSettings), []);

    const [linkToken, setLinkToken] = useState(null);

    useEffect(() => {
        // Make a request to your server's API endpoint to obtain the link token
        axios
            .get("http://localhost:1337/get-link-token")
            .then((response) => {
                setLinkToken(response.data.link_token);
            })
            .catch((error) => {
                console.error("Error getting link token:", error);
            });
    }, []);

    const onSuccess = async (publicToken, metadata) => {
        try {
            // Exchange the publicToken for an access_token on your server
            const exchangeResponse = await axios.post("/exchange-public-token", {
                public_token: publicToken,
            });

            const accessToken = exchangeResponse.data.access_token;
            setAccessToken(accessToken);
            console.log("Access Token:", accessToken);

            // You might want to update your app's state to indicate successful connection
        } catch (error) {
            console.error("Error exchanging public token:", error);
        }
    };

    const config = {
        token: linkToken,
        onSuccess,
    };

    const { open, ready } = usePlaidLink(config);

    return accessToken ? (
        <PlaidAuth accessToken={accessToken} />
    ) : (
        <div>
            <ThemeProvider theme={theme}>
                <Box
                    width="100%"
                    height="100%"
                    display="grid"
                    gap="1.5rem"
                    sx={
                        isAboveMediumScreens
                            ? {
                                  gridTemplateColumns: "repeat(3, minmax(370px, 1fr))",
                                  gridTemplateAreas: gridTemplateLargeScreens,
                              }
                            : {
                                  gridAutoColumns: "1fr",
                                  gridTemplateRows: "1fr",
                                  gridTemplateAreas: gridTemplateSmallScreens,
                              }
                    }
                >
                    {isAboveMediumScreens && <Column1 />}
                    <Box
                        height="70vh"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                        gridArea="b"
                    >
                        <AppText fontSize={120} fontWeight={900} marginBottom={-5}>
                            Pecunia
                        </AppText>
                        <AppText fontSize={42} fontWeight={600} marginBottom={5}>
                            Finance Dashboard
                        </AppText>
                        <ConnectButton onClick={() => open()} disabled={!ready || !linkToken}>
                            Connect bank account
                        </ConnectButton>
                    </Box>
                    {isAboveMediumScreens && <Column2 />}
                </Box>
            </ThemeProvider>
        </div>
    );
};

export default App;
