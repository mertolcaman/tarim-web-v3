import { useEffect, useState } from 'react';
import axios from 'axios';
import DeviceSelector from './DeviceSelector';
import SensorTable from './SensorTable';
import Loader from './Loader';

const API_BASE = import.meta.env.VITE_API_BASE;

const Dashboard = ({ onLogout }) => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("ALL");
    const [limit, setLimit] = useState(10);
    const [sensorData, setSensorData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE}/devices/`)
            .then(res => {
                setDevices(res.data);
                setSelectedDevice("ALL");
                return axios.get(`${API_BASE}/devices/data?limit=${limit}`);
            })
            .then(res => setSensorData(res.data))
            .catch(err => console.error("Initial fetch failed:", err))
            .finally(() => setLoading(false));
    }, []);

    const fetchSensorData = (deviceId, itemLimit) => {
        setLoading(true);
        axios.get(`${API_BASE}/devices/${deviceId}/data?limit=${itemLimit}`)
            .then(res => setSensorData(res.data))
            .catch(err => console.error("Sensor fetch failed:", err))
            .finally(() => setLoading(false));
    };

    const fetchAllSensorData = (itemLimit) => {
        setLoading(true);
        axios.get(`${API_BASE}/devices/data?limit=${itemLimit}`)
            .then(res => setSensorData(res.data))
            .catch(err => console.error("All sensor fetch failed:", err))
            .finally(() => setLoading(false));
    };

    const handleSubmit = () => {
        if (selectedDevice === "ALL") {
            fetchAllSensorData(limit);
        } else {
            fetchSensorData(selectedDevice, limit);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-center w-100">IoT Dashboard</h2>

            </div>

            <DeviceSelector
                devices={devices}
                selectedDevice={selectedDevice}
                setSelectedDevice={setSelectedDevice}
                limit={limit}
                setLimit={setLimit}
                onSubmit={handleSubmit}
            />
            <SensorTable sensorData={sensorData} />
        </div>
    );
};

export default Dashboard;
