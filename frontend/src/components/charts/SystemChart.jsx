import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

// System Info Chart
const SystemChart = ({ data }) => (
    <div className="card mb-4">
        <div className="card-body">
            <h5 className="card-title">🔋 System Info</h5>
            <ResponsiveContainer width="100%" height={450}>
                <LineChart data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time_created_at"
                        tickFormatter={(str) => {
                            if (!str) return '';
                            const date = new Date(str);
                            return `${date.toLocaleDateString()}`;
                        }}
                        angle={-45}
                        textAnchor="end"
                        dx={20}
                        dy={10}
                        interval="preserveStartEnd"
                        height={60}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend layout="horizontal" verticalAlign="top" align="center" />
                    <Line type="monotone" dataKey="system_battery_voltage" stroke="#6c757d" name="Battery" />
                    <Line type="monotone" dataKey="system_solar_panel_voltage" stroke="#ffc107" name="Solar Panel" />
                    <Line type="monotone" dataKey="system_supply_4v" stroke="#17a2b8" name="Supply 4V" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default SystemChart;