import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherChart from './WeatherChart';
import SoilChart from './SoilChart';
import SystemChart from './SystemChart';

import FilterPanel from './FilterPanel';

const API_BASE_URL = import.meta.env.VITE_API_BASE;
const Charts = () => {
    const [sensorData, setSensorData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState('');

    // Fetch all device IDs
    useEffect(() => {
        axios.get(`${API_BASE_URL}/devices`)
            .then(res => {
                const deviceIds = res.data.map(d => d.device_id);
                setDevices(deviceIds);
                if (deviceIds.length > 0) setSelectedDevice(deviceIds[0]); // default to first
            })
            .catch(err => console.error('Failed to load devices', err));
    }, []);

    // Fetch initial data for selected device
    useEffect(() => {
        if (!selectedDevice) return;
        axios.get(`${API_BASE_URL}/devices/${selectedDevice}/data?limit=10`)
            .then(res => {
                const sorted = [...res.data].sort((a, b) => new Date(a.time_created_at) - new Date(b.time_created_at));
                setSensorData(sorted);
            })
            .catch(err => console.error('Failed to fetch sensor data', err));
    }, [selectedDevice]);

    // Fetch data by time range
    const fetchData = () => {
        if (!startDate || !endDate || !selectedDevice) return;
        const startISO = startDate.toISOString();
        const endISO = endDate.toISOString();

        axios.get(`${API_BASE_URL}/devices/${selectedDevice}/data-range?start=${startISO}&end=${endISO}`)
            .then(res => {
                const sorted = [...res.data].sort((a, b) => new Date(a.time_created_at) - new Date(b.time_created_at));
                setSensorData(sorted);
            })
            .catch(err => console.error('Failed to fetch sensor data', err));
    };

    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h2 className="fw-bold">📊 Sensor Data Dashboard</h2>
                <p className="text-muted">Visualize IoT device metrics over time</p>
            </div>

            {/* Filter Section */}
            <FilterPanel
                devices={devices}
                selectedDevice={selectedDevice}
                setSelectedDevice={setSelectedDevice}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                fetchData={fetchData}
            />


            {/* Charts */}
            <WeatherChart data={sensorData} />
            <SoilChart data={sensorData} />
            <SystemChart data={sensorData} />
        </div>
    );
};

export default Charts;
