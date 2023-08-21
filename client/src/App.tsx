import { useMemo, useEffect, useState } from "react";
import { Box, CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
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
import { usePlaidLink } from "react-plaid-link";

/* Defines default URL */
axios.defaults.baseURL = "http://localhost:1337/";

/* Once user has logged in */
function PlaidAuth({ accessToken }) {
    const theme = useMemo(() => createTheme(themeSettings), []);

    const [transactions, setTransactions] = useState([]);
    const [accountID, setAccountID] = useState();

    useEffect(() => {
        axios
            .post("http://localhost:1337/get-transactions", {
                accessToken: accessToken,
            })
            .then((response) => {
                console.log(response.data.transactions);
                const accounts = response.data.transactions.accounts;

                const desiredAccount = accounts.find(
                    (account) => account.name === "CIBC Smart Account"
                );

                if (desiredAccount) {
                    setAccountID(desiredAccount.account_id);
                    console.log("Account ID:", accountID);
                }
                setTransactions(response.data.transactions.transactions);
            })
            .catch((error) => {
                console.error("Error getting transactions:", error);
            });
    }, []);

    const fetchTransactions = () => {
        setTimeout(() => {
            axios
                .post("http://localhost:1337/get-transactions", {
                    accessToken: accessToken,
                })
                .then((response) => {
                    console.log("Transactions delayed:", response.data.transactions.transactions);
                    setTransactions(response.data.transactions.transactions);
                })
                .catch((error) => {
                    console.error("Error getting transactions delayed:", error);
                });
        }, 4000); // 4 second delay
    };

    // Incase unable to fetch transactions the first time, sometimes needs a delay
    const executeFetchAfterDelay = () => {
        const sumTransactions = transactions.reduce((sum, transaction) => {
            if (transaction.account_id == accountID) {
                return sum + transaction.amount;
            }
            return sum;
        }, 0);
        console.log(sumTransactions);
    };
    executeFetchAfterDelay();

    return (
        <div className="app">
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
                        <Navbar />
                        <button onClick={fetchTransactions}>Fetch Transactions</button>
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
        // Make request to server's API endpoint to get link token
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
            // Exchange publicToken for access_token on server
            const exchangeResponse = await axios.post("/exchange-public-token", {
                public_token: publicToken,
            });

            const accessToken = exchangeResponse.data.access_token;
            setAccessToken(accessToken);
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
