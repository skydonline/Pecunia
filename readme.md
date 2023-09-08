# Pecunia

## YouTube Demo:

https://www.youtube.com/watch?v=p6HZU5rYd-8

## Background:

Created a financial dashboard.

The main purpose of this project was to learn about full stack development (both server-side and frontend development), managing REST APIs, secure data handling, enhance my proficiency of various languages/tools, and machine learning.

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)

#### Major Learnings:

-   Built server-side logic using Express.js and Node.js to handle requests, data processing, and generating responses
-   Developed frontend with React (mainly Material-UI and the Recharts library) to create dynamic interfaces, manage state, handle user interactions and data rendering
-   Secure user authentication and authorization through session management and token-based authentication with the server
-   Managed efficient communication with Plaid's REST APIs for fast and reliable data processing and transfer

## <u>Main Features:</u>

### **General UI:**

-   Created a consistent and aesthetically pleasing interface across all devices
    -   Used Material-UI's responsive container to enable great viewing experiences and interactions with the interface
    -   Created a grid system to help manage the content displayed
    -   Saved time and effort leveraging a responsive library like Material-UI instead of excessively devoting time on cross-device testing

### **Dashboard:**

-   Calculates user net worth based on cash reserves from chequing, saving and investment accounts
    -   Obtains data from Plaid's APIs (/accounts/balance/get and /investments/holdings/get)
    -   Displays each component percentage of total net worth on pie chart
-   Calculates user monthly income and monthly expenses for each month of the past year (12 months)
    -   Obtains data from Plaid's APIs (/credit/bank_income/get and /transactions/get)
    -   Additionally created a chart to display income vs expenses, to show net profits for each month
-   Displays user's recurring expenses in a table
    -   Obtains data from Plaid's API (/transactions/recurring/get)
    -   Details the merchant, category, frequency, and amount
-   Displays user's 20 recent transactions in a table
    -   Obtains data from Plaid's API (/transactions/get)
    -   Details the merchant, category, date, and amount
-   Displays user's expense breakdown by category for the past 12 months
    -   Obtains data from Plaid's API (/transactions/get)
    -   Only shows categories that the user has spent money on, creates cleaner pie chart

### **Predictions:**

-   Displays user's monthly income for the past year, as well as average monthly income for the year on a regression line
-   User can see predicted income for the next year
    -   Uses a machine learning linear regression model to display predicted monthly income for the next year
