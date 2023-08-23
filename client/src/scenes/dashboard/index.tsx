import { Box, useMediaQuery } from "@mui/material";
import Row1 from "./Row1";
import Row2 from "./Row2";
import Row3 from "./Row3";

const gridTemplateLargeScreens = `
  "a b c"
  "a b c"
  "a b c"
  "d b f"
  "d h f"
  "d h f"
  "d h i"
  "g h i"
  "g h i"
  "g h i"
`;
const gridTemplateSmallScreens = `
  "a"
  "a"
  "a"
  "b"
  "b"
  "b"
  "b"
  "c"
  "c"
  "c"
  "d"
  "d"
  "d"
  "d"
  "f"
  "f"
  "f"
  "g"
  "g"
  "g"
  "h"
  "h"
  "h"
  "h"
  "h"
  "h"
  "i"
  "i"
  "i"
  "i"
`;

const Dashboard = ({ filteredTransactions, transactions, balance }) => {
    const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)");
    return (
        <Box
            width="100%"
            height="100%"
            display="grid"
            gap="1.5rem"
            sx={
                isAboveMediumScreens
                    ? {
                          gridTemplateColumns: "repeat(3, minmax(370px, 1fr))",
                          gridTemplateRows: "repeat(10, minmax(60px, 1fr))",
                          gridTemplateAreas: gridTemplateLargeScreens,
                      }
                    : {
                          gridAutoColumns: "1fr",
                          gridAutoRows: "60px",
                          gridTemplateAreas: gridTemplateSmallScreens,
                      }
            }
        >
            <Row1
                filteredTransactions={filteredTransactions}
                transactions={transactions}
                balance={balance}
            />
            <Row2 filteredTransactions={filteredTransactions} transactions={transactions} />
            <Row3 filteredTransactions={filteredTransactions} transactions={transactions} />
        </Box>
    );
};

export default Dashboard;
