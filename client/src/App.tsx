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
import { usePlaidLink, PlaidLinkOnSuccess, PlaidLink } from "react-plaid-link";

/* Defines default URL */
axios.defaults.baseURL = "http://localhost:1337";

/* Once user has logged in */
function PlaidAuth({ publicToken }) {
    const [account, setAccount] = useState();
    const theme = useMemo(() => createTheme(themeSettings), []);

    useEffect(() => {
        async function fetchData() {
            let accessToken = await axios.post("/api/exchange_public_token", {
                public_token: publicToken,
            });
            console.log("Token: ", accessToken.data);
            const auth = await axios.post("/auth", {
                access_token: accessToken.data.accessToken,
            });
            console.log("Authenticated data", auth.data);
            setAccount(auth.data.numbers.ach[0]);
        }
        fetchData();
    }, []);

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
    // get link_token from your server when component mounts
    useEffect(() => {
        const createLinkToken = async () => {
            const response = await fetch("/api/create_link_token", { method: "POST" });
            const { link_token } = await response.json();
            setToken(link_token);
        };
        createLinkToken();
    }, []);

    const [linkToken, setLinkToken] = useState();
    const [publicToken, setPublicToken] = useState();
    const isAboveMediumScreens = useMediaQuery("(min-width: 1250px)");
    const theme = useMemo(() => createTheme(themeSettings), []);

    useEffect(() => {
        async function fetch() {
            try {
                const response = await axios.post("/api/create_link_token");
                setLinkToken(response.data.link_token);
            } catch (error) {
                console.log("Error fetching link token:", error.response);
            }
        }
        fetch();
    }, []);

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (public_token, metadata) => {
            setPublicToken(public_token);
        },
    });

    return publicToken ? (
        <PlaidAuth publicToken={publicToken} />
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
                        <ConnectButton onClick={() => open()} disabled={!ready}>
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
