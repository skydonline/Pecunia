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
    nonMandatoryExpenses: number;
    mandatoryExpenses: number;
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
