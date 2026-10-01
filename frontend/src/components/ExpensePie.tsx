import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, LineChart, CartesianGrid, XAxis, YAxis, Line} from "recharts";

type ExpensePieProps = {
    chartData : any[],
    stats : any[]
}

export default function ExpensePie({chartData, stats}:ExpensePieProps){

    const COLORSPIE = ["#4a7c8c", "#8c5a4a", "#6b8f5a", "#8c7a4a", "#6b5a8c", "#4a8c7c", "#8c4a6b", "#5a6b8c"];

    return(
        <div className="w-2/10 h-full flex items-center justify-center">
        { stats ? 
        <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <defs>
                            {chartData.map((_, i) => (
                              <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={COLORSPIE[i % COLORSPIE.length]} stopOpacity={1} />
                                <stop offset="100%" stopColor={COLORSPIE[i % COLORSPIE.length]} stopOpacity={0.7} />
                              </linearGradient>
                            ))}
                          </defs>
                          <Pie data={chartData} 
                            dataKey="value" 
                            nameKey="name" 
                            cx="50%" 
                            cy="50%" 
                            outerRadius="90%"
                            className="focus:outline-none [&_*]:outline-none"
                            stroke="none">
                              
        
                            {chartData.map((_, i) => (
                              <Cell key={i} fill={`url(#grad${i})`} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(v) => `${Number(v).toLocaleString("nb-NO")} kr`}
                            contentStyle={{
                              backgroundColor: "rgba(0,0,0,0.85)",
                              border: "none",
                              borderRadius: 8,
                              padding: "6px 10px",
                              fontSize: 12,
                            }}
                            itemStyle={{ color: "#fff" }}
                            labelStyle={{ color: "#fff" }}
                            cursor={{ fill: "rgba(0,0,0,0.05)" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    : "loading"
                    }
                </div>
    )
}