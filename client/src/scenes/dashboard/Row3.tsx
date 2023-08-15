import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery, useGetProductsQuery, useGetTransactionsQuery } from "@/state/api";
import { Box, getListItemSecondaryActionClassesUtilityClass, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import CategoryIcon from "@mui/icons-material/Category";

const piedata = [
    { name: "Transfers", value: 600 },
    { name: "Entertainment", value: 400 },
    { name: "Food and Drink", value: 400 },
    { name: "Merchandise/Services", value: 400 },
    { name: "Medical", value: 400 },
    { name: "Personal Care", value: 400 },
    { name: "Transportation/Travel", value: 400 },
    { name: "Utilities", value: 400 },
];

const Row3 = () => {
    const { palette } = useTheme();
    const pieColors = [
        palette.primary[800],
        palette.primary[700],
        palette.primary[600],
        palette.primary[500],
        palette.primary[400],
        palette.primary[300],
        palette.primary[200],
        palette.primary[100],
    ];
    const { data: transactionData } = useGetTransactionsQuery();
    const { data: kpiData } = useGetKpisQuery();

    const dateData = transactionData
        ?.map((transaction) => ({
            ...transaction,
            date: new Date(transaction.date),
        }))
        .sort((a, b) => a.date - b.date)
        .reverse();

    const latestTransactionsData = dateData?.slice(0, 50).map((transaction) => ({
        ...transaction,
        date: transaction.date
            .toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
            })
            .replace(/,/g, ""),
    }));

    const transactionColumns = [
        {
            field: "merchant",
            headerName: "Merchant",
            flex: 0.3,
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0.26,
        },
        {
            field: "category",
            headerName: "Category",
            flex: 0.3,
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 0.15,
            renderCell: (params: GridCellParams) => `$${params.value}`,
        },
    ];

    const recurringExpensesData = [
        {
            id: "1",
            expense: "Electricity",
            billDate: "17",
            amount: "40",
            company: "Apple",
        },
    ];

    const recurringExpensesColumns = [
        {
            field: "expense",
            headerName: "Expense Type",
            flex: 0.6,
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0.5,
        },
        {
            field: "billDate",
            headerName: "Bill Date",
            flex: 0.26,
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 0.2,
            renderCell: (params: GridCellParams) => `$${params.value}`,
        },
    ];

    return (
        <>
            <DashboardBox gridArea="g">
                <BoxHeader
                    title="Recurring Expenses"
                    sideText={`${latestTransactionsData?.length} expenses`}
                />
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
                    />
                </Box>
            </DashboardBox>

            <DashboardBox gridArea="i">
                <BoxHeader title="Expense Breakdown By Category" icon={CategoryIcon} />
                <Box margin="0 auto" width="100%" display="flex" justifyContent="center">
                    <PieChart width={400} height={250}>
                        <Pie
                            stroke="none"
                            data={piedata}
                            innerRadius={35}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {piedata.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieColors[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="middle" align="right" layout="vertical" />
                    </PieChart>
                </Box>
            </DashboardBox>
        </>
    );
};

export default Row3;
