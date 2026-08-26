import { Routes, Route, Link } from "react-router-dom";
import AccountOverview from "./accountsOverview.jsx"
import LoginPage from "./loginPage.jsx"
import Verdipapirer from "./Verdipapirer.jsx"
import Layout from "./layout.tsx"
import BudgetPage from "./budgetPage.jsx"

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route element={<Layout />}>
                    <Route path="/accounts" element={<AccountOverview />} />
                    <Route path="/verdipapirer" element={<Verdipapirer />} />
                    <Route path="/budget" element={<BudgetPage />} />
                </Route>
            </Routes>
        </>
    )
}

