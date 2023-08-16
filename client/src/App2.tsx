import axios from "axios";
import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";

axios.defaults.baseURL = "https://development.plaid.com";

const App2 = () => {
    const [linkToken, setLinkToken] = useState(null);
    const generateToken = async () => {
        const response = await fetch("/link/token/create", {
            method: "POST",
        });
        const data = await response.json();
        setLinkToken(data.link_token);
    };
    useEffect(() => {
        generateToken();
    }, []);
    return linkToken != null ? <Link linkToken={linkToken} /> : <></>;
};
// LINK COMPONENT
// Use Plaid Link and pass link token and onSuccess function
// in configuration to initialize Plaid Link
interface LinkProps {
    linkToken: string | null;
}
const Link: React.FC<LinkProps> = (props: LinkProps) => {
    const onSuccess = React.useCallback((public_token, metadata) => {
        // send public_token to server
        const response = fetch("/api/set_access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ public_token }),
        });
        // Handle response ...
    }, []);
    const config: Parameters<typeof usePlaidLink>[0] = {
        token: props.linkToken!,
        receivedRedirectUri: window.location.href,
        onSuccess,
    };
    const { open, ready } = usePlaidLink(config);
    return (
        <button onClick={() => open()} disabled={!ready}>
            Link account
        </button>
    );
};
export default App2;
