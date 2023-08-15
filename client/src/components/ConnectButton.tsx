import { Button } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const ConnectButton = ({ children, ...props }) => {
    return (
        <Button
            variant="contained"
            size="large"
            endIcon={<AccountBalanceIcon />}
            sx={{
                fontFamily: ["Inter", "sans-serif"].join(","),
                fontWeight: 800,
                boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 0.4)",
                background: `linear-gradient(45deg, #085a60 30%, #71eef6 90%)`,
                transition: "background-color 0.3s ease-in-out",
                color: "white",
                "&:hover": {
                    filter: "brightness(80%)",
                },
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

export default ConnectButton;
