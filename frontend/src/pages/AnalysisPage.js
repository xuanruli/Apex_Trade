import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalysisPage = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            const response = await fetch('http://localhost:5000/api/analysis');
            const data = await response.json();
            if (data.success) setAnalysisData(data.data);
            setLoading(false);
        };
        fetchAnalysis();
    }, []);

    if (loading) return <div>Loading analysis...</div>;
    if (!analysisData) return <div>Could not load analysis data.</div>;

    const pieData = analysisData.pie_chart.symbols.map((symbol, index) => ({
        name: symbol,
        value: analysisData.pie_chart.market_values[index]
    }));

    return (
        <div className="container mt-4">
            <h1>Portfolio Analysis</h1>
            <h2>Asset Allocation</h2>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label>
                            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            {/* Efficient Frontier chart would go here */}
        </div>
    );
};

export default AnalysisPage; 