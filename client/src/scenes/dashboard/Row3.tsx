import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import CategoryIcon from "@mui/icons-material/Category";

const Row3 = ({ filteredTransactions, transactions }) => {
    const { palette } = useTheme();
    const pieColors = [
        palette.primary[800],
        palette.primary[600],
        palette.primary[400],
        palette.primary[200],
        palette.primary[100],
        palette.tertiary[700],
        palette.tertiary[600],
        palette.tertiary[400],
        palette.tertiary[200],
    ];

    // Reformat latest transactions
    const latestTransactionsData = filteredTransactions
        ?.slice(0, 20)
        .map((filteredTransaction, index) => {
            const formattedDate = filteredTransaction.authorized_date
                ? new Date(filteredTransaction.authorized_date)
                      .toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                      })
                      .replace(/,/g, "")
                : "N/A";
            const formattedCategories = filteredTransaction.category
                ? filteredTransaction.category.join(", ")
                : "N/A";

            return {
                id: index,
                ...filteredTransaction,
                authorized_date: formattedDate,
                category: formattedCategories,
            };
        });

    // Display data in transactions column
    const transactionColumns = [
        {
            field: "name",
            headerName: "Transaction Name",
            flex: 0.3,
            valueGetter: (params) => params.value || "N/A",
        },
        {
            field: "authorized_date",
            headerName: "Date",
            flex: 0.18,
        },
        {
            field: "category",
            headerName: "Category",
            flex: 0.35,
            valueGetter: (params) => params.value || "Uncategorized",
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 0.15,
            renderCell: (params: GridCellParams) => {
                const amount = params.value;
                const formattedAmount = amount < 0 ? `-$${Math.abs(amount)}` : `$${amount}`;
                return formattedAmount;
            },
        },
    ];

    // Data for Expense Breakdown by Category
    const categoryAmounts = filteredTransactions.reduce((acc, filteredTransactions) => {
        if (filteredTransactions.amount > 0) {
            filteredTransactions.category.forEach((category) => {
                if (!acc[category]) {
                    acc[category] = 0;
                }
                acc[category] += filteredTransactions.amount;
            });
        }
        return acc;
    }, {});

    const categoryBreakdown = Object.keys(categoryAmounts).map((category) => ({
        name: category,
        value: categoryAmounts[category],
    }));

    // Data for recurring expenses
    const recurringExpensesData = [
        {
            id: "1",
            expense: "",
            billDate: "",
            amount: "",
            company: "",
        },
    ];

    const recurringExpensesColumns = [
        {
            field: "expense",
            headerName: "Expense Type",
            flex: 0.5,
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0.5,
        },
        {
            field: "billDate",
            headerName: "Frequency",
            flex: 0.46,
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 0.2,
            renderCell: (params: GridCellParams) => `${params.value}`,
        },
    ];

    return (
        <>
            <DashboardBox gridArea="g">
                <BoxHeader title="Recurring Expenses" sideText={`${0} expenses`} />
                <Box
                    mt="0.5rem"
                    p="0 0.5rem"
                    height="75%"
                    sx={{
                        "& .MuiDataGrid-root": { color: palette.grey[300], border: "none" },
                        "& .MuiDataGrid-cell": {
                            borderBottom: `1px solid ${palette.grey[800]} !important`,
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            borderBottom: `1px solid ${palette.grey[800]} !important`,
                        },
                        "& .MuiDataGrid-columnSeparator": {
                            visibility: "hidden",
                        },
                    }}
                >
                    <DataGrid
                        columnHeaderHeight={25}
                        rowHeight={35}
                        hideFooter={true}
                        rows={recurringExpensesData || []}
                        columns={recurringExpensesColumns}
                    />
                </Box>
            </DashboardBox>

            <DashboardBox gridArea="h">
                <BoxHeader
                    title="Recent Transactions"
                    sideText={`${latestTransactionsData?.length} latest transactions`}
                />
                <Box
                    mt="1rem"
                    p="0 0.5rem"
                    height="85%"
                    sx={{
                        "& .MuiDataGrid-root": { color: palette.grey[300], border: "none" },
                        "& .MuiDataGrid-cell": {
                            borderBottom: `1px solid ${palette.grey[800]} !important`,
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            borderBottom: `1px solid ${palette.grey[800]} !important`,
                        },
                        "& .MuiDataGrid-columnSeparator": {
                            visibility: "hidden",
                        },
                    }}
                >
                    <DataGrid
                        columnHeaderHeight={25}
                        rowHeight={35}
                        hideFooter={true}
                        rows={latestTransactionsData || []}
                        columns={transactionColumns}
                        getRowId={(row) => row.transaction_id}
                    />
                </Box>
            </DashboardBox>

            <DashboardBox gridArea="i">
                <BoxHeader title="Expense Breakdown By Category" icon={CategoryIcon} />
                <Box margin="0 auto" width="100%" display="flex" justifyContent="center">
                    <PieChart width={400} height={250}>
                        <Pie
                            stroke="none"
                            data={categoryBreakdown}
                            innerRadius={35}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {categoryBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieColors[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend
                            verticalAlign="middle"
                            align="right"
                            layout="vertical"
                            formatter={(value) => value.slice(0, 14)}
                        />
                    </PieChart>
                </Box>
            </DashboardBox>
        </>
    );
};

export default Row3;
