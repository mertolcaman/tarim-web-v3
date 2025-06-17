import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

// Soil Metrics Chart

const SoilChart = ({ data }) => (
    <div className="card mb-4">
        <div className="card-body">
            <h5 className="card-title">🌱 Soil Metrics</h5>
            <ResponsiveContainer width="100%" height={400}>
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
                        dx={40}
                        dy={10}
                        interval="preserveStartEnd"
                        height={60}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend layout="horizontal" verticalAlign="top" align="center" />
                    <Line yAxisId="left" type="monotone" dataKey="soil_temperature" stroke="#6f42c1" name="Soil Temp" />
                    <Line yAxisId="left" type="monotone" dataKey="soil_humidity" stroke="#20c997" name="Soil Humidity" />
                    <Line yAxisId="left" type="monotone" dataKey="soil_ph" stroke="#fd7e14" name="Soil pH" />
                    <Line yAxisId="right" type="monotone" dataKey="soil_electrical_conductivity" stroke="#dc3545" name="EC" />
                    <Line yAxisId="right" type="monotone" dataKey="soil_salinity" stroke="#6610f2" name="Salinity" />
                    <Line yAxisId="right" type="monotone" dataKey="soil_tds" stroke="#17a2b8" name="TDS" />

                    <Line yAxisId="right" type="monotone" dataKey="soil_nitrogen" stroke="#ff6f61" name="Nitrogen" />
                    <Line yAxisId="right" type="monotone" dataKey="soil_phosphorus" stroke="#2bcbba" name="Phosphorus" />
                    <Line yAxisId="right" type="monotone" dataKey="soil_potassium" stroke="#845ec2" name="Potassium" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default SoilChart;