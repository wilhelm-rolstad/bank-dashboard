import { Routes, Route, Link } from "react-router-dom";
import { useState } from'react'
import AccountOverview from "./accountsOverview.jsx"
import LoginPage from "./loginPage.jsx"
import Verdipapirer from "./Verdipapirer.jsx"
import Layout from "./layout.tsx"
import BudgetPage from "./budgetPage.jsx"
import TopBar from "./elements/TopBar.tsx";

export default function App() {

  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-2xl bg-white">
      <TopBar setCollapsed={setCollapsed}/>
      <div className="flex-1 min-h-0">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<Layout collapsed={collapsed}/>}>
            <Route path="/accounts" element={<AccountOverview />} />
            <Route path="/verdipapirer" element={<Verdipapirer />} />
            <Route path="/budget" element={<BudgetPage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}
