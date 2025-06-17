import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from 'recharts';

const WeatherChart = ({ data }) => (
    <div className="card mb-4">
        <div className="card-body">
            <h5 className="card-title">🌤️ Weather Metrics</h5>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
                >
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

                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="weather_air_temperature"
                        stroke="#007bff"
                        name="Air Temp"
                    />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="weather_air_humidity"
                        stroke="#28a745"
                        name="Air Humidity"
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="weather_air_pressure"
                        stroke="#ffc107"
                        name="Air Pressure"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default WeatherChart;
