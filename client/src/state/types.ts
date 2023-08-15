export interface ExpensesByCategory {
    salaries: number;
    supplies: number;
    services: number;
}

export interface Month {
    id: string;
    month: string;
    income: number;
    expenses: number;
}

export interface Day {
    id: string;
    date: string;
    income: number;
    expenses: number;
}

export interface GetKpisResponse {
    id: string;
    _id: string;
    __v: number;
    netIncome: number;
    totalIncome: number;
    totalExpenses: number;
    expensesByCategory: ExpensesByCategory;
    monthlyData: Array<Month>;
    dailyData: Array<Day>;
    createdAt: string;
    updatedAt: string;
}

export interface GetProductsResponse {
    id: string;
    _id: string;
    __v: number;
    price: number;
    expense: number;
    name: string;
    transactions: Array<string>;
    totalExpenses: number;
    expensesByCategory: ExpensesByCategory;
    createdAt: string;
    updatedAt: string;
}

export interface GetTransactionsResponse {
    id: string;
    _id: string;
    __v: number;
    date: string;
    merchant: string;
    amount: number;
    category: string;
    createdAt: string;
    updatedAt: string;
}
