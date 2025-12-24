"use client";

import { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from "recharts";

const COLORS = ['#22c55e', '#eab308', '#64748b'];

export function AdminDashboardCharts({ orderCount }: { orderCount: number }) {
    const [chartData, setChartData] = useState<any[]>([]);
    const [statusData, setStatusData] = useState<any[]>([]);
    const [timeRange, setTimeRange] = useState<'7' | '30'>('7');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchChartData() {
            setLoading(true);
            try {
                // Fetch orders for the time range
                const response = await fetch(`/api/orders?days=${timeRange}`);
                const orders = await response.json();

                // Group by date
                const dateMap = new Map();
                const now = new Date();
                const daysCount = parseInt(timeRange);

                // Initialize dates
                for (let i = daysCount - 1; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
                    dateMap.set(dateStr, 0);
                }

                // Count orders by date
                orders.forEach((order: any) => {
                    const orderDate = new Date(order.createdAt);
                    const dateStr = orderDate.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
                    if (dateMap.has(dateStr)) {
                        dateMap.set(dateStr, dateMap.get(dateStr) + 1);
                    }
                });

                // Convert to chart data
                const data = Array.from(dateMap.entries()).map(([name, pesanan]) => ({
                    name,
                    pesanan
                }));

                setChartData(data);

                // Calculate status distribution
                const statusCounts = {
                    'Selesai': 0,
                    'Proses': 0,
                    'Pending': 0
                };

                orders.forEach((order: any) => {
                    if (order.productionStatus === 'Terkirim' || order.productionStatus === 'Selesai') {
                        statusCounts['Selesai']++;
                    } else if (order.productionStatus === 'Proses') {
                        statusCounts['Proses']++;
                    } else {
                        statusCounts['Pending']++;
                    }
                });

                const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({
                    name,
                    value
                })).filter(item => item.value > 0);

                setStatusData(statusChartData);

            } catch (error) {
                console.error('Error fetching chart data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchChartData();
    }, [timeRange]);

    return (
        <div className="space-y-6">
            {/* Sales Chart */}
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Tren Pesanan
                        </h3>
                        <p className="text-sm text-slate-500">Jumlah pesanan masuk per hari</p>
                    </div>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as '7' | '30')}
                        className="bg-slate-50 dark:bg-slate-800 border-none text-xs rounded-lg p-2 text-slate-600 dark:text-slate-300"
                    >
                        <option value="7">7 Hari Terakhir</option>
                        <option value="30">30 Hari Terakhir</option>
                    </select>
                </div>

                <div className="h-[280px] w-full">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-slate-400">Memuat data...</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{
                                    top: 5,
                                    right: 10,
                                    left: -20,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    dy={10}
                                    angle={-15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        borderColor: '#334155',
                                        borderRadius: '8px',
                                        color: '#f8fafc'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#cbd5e1' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pesanan"
                                    stroke="#ea580c"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorPv)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Distribusi Status
                    </h3>
                    <p className="text-sm text-slate-500">Breakdown status pesanan saat ini</p>
                </div>

                <div className="h-[200px] w-full">
                    {loading || statusData.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-slate-400">{loading ? 'Memuat data...' : 'Belum ada data'}</p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <ResponsiveContainer width="50%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            borderColor: '#334155',
                                            borderRadius: '8px',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="flex flex-col gap-2 flex-1">
                                {statusData.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                            {entry.name}:
                                        </span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                            {entry.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
