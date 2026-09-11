import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, LineChart, CartesianGrid, XAxis, YAxis, Line} from "recharts";

type ExpenseChartProps = {
    monthlyExpensesInCategories : any[],
    categories : string[]
}

export default function ExpenseChart({monthlyExpensesInCategories, categories}: ExpenseChartProps){

    const COLORS = ["#38bdf8", "#fb923c", "#4ade80", "#facc15", "#a78bfa", "#2dd4bf", "#f472b6", "#60a5fa", "#f87171", "#a3e635"];

    return(
        <section className="flex items-center justify-center h-full w-5/10"> {/* linechart for monthly expenses */}
                        <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyExpensesInCategories ?? []}>
                          <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                         <Tooltip
                          formatter={(v) => `${Number(v).toLocaleString("nb-NO")} kr`}
                          contentStyle={{
                          background: "rgba(255,255,255,0.08)",
                          backdropFilter: "blur(6px) saturate(160%)",
                          WebkitBackdropFilter: "blur(6px) saturate(160%)",
                          border: "1px solid rgba(255,255,255,0.3)",
                          borderRadius: 16,
                          padding: "10px 14px",
                          fontSize: 12,
                          boxShadow: "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
                        }}
                          labelStyle={{ color: "#1a1a1a", fontWeight: 600, marginBottom: 6 }}
                        />
        
                          {categories.map((cat, i) => (
                            <Line
                              key={cat}
                              type="monotone"
                              dataKey={cat}
                              stroke={COLORS[i % COLORS.length]}
                              strokeWidth={1}
                              dot={false}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
        </section>
    )
}