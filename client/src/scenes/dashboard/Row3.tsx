import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery, useGetProductsQuery, useGetTransactionsQuery } from "@/state/api";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { useMemo } from "react";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import CategoryIcon from "@mui/icons-material/Category";

const piedata = [
    { name: "Investments", value: 600 },
    { name: "Cash", value: 400 },
    { name: "C3", value: 400 },
    { name: "C4", value: 400 },
    { name: "C5", value: 400 },
    { name: "C6", value: 400 },
    { name: "C7", value: 400 },
    { name: "C8", value: 400 },
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
    const { data: productData } = useGetProductsQuery();
    const { data: kpiData } = useGetKpisQuery();

    const productColumns = [
        {
            field: "name",
            headerName: "name",
            flex: 1,
        },
        {
            field: "expense",
            headerName: "Expense",
            flex: 0.5,
            renderCell: (params: GridCellParams) => `$${params.value}`,
        },
        {
            field: "price",
            headerName: "Price",
            flex: 0.5,
            renderCell: (params: GridCellParams) => `$${params.value}`,
        },
    ];

    const transactionColumns = [
        {
            field: "_id",
            headerName: "id",
            flex: 1,
        },
        {
            field: "buyer",
            headerName: "Buyer",
            flex: 0.67,
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 0.35,
            renderCell: (params: GridCellParams) => `$${params.value}`,
        },
        {
            field: "productIds",
            headerName: "Count",
            flex: 0.1,
            renderCell: (params: GridCellParams) => (params.value as Array<string>).length,
        },
    ];

    const pieChartData = useMemo(() => {
        if (kpiData) {
            const totalExpenses = kpiData[0].totalExpenses;
            return Object.entries(kpiData[0].expensesByCategory).map(([key, value]) => {
                return [
                    {
                        name: key,
                        value: value,
                    },
                    {
                        name: `${key} of Total`,
                        value: totalExpenses - value,
                    },
                ];
            });
        }
    }, [kpiData]);

    return (
        <>
            <DashboardBox gridArea="g">
                <BoxHeader title="Largest Expenses" sideText={`${productData?.length} products`} />
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
                        rows={productData || []}
                        columns={productColumns}
                    />
                </Box>
            </DashboardBox>

            <DashboardBox gridArea="h">
                <BoxHeader
                    title="Recent Transactions"
                    sideText={`${transactionData?.length} latest transactions`}
                />
                <Box
                    mt="1rem"
                    p="0 0.5rem"
                    height="80%"
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
                        rows={transactionData || []}
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
