import { useEffect, useState } from 'react';
import axios from 'axios';
import DeviceSelector from './components/DeviceSelector';
import SensorTable from './components/SensorTable';

// ✅ backend API
const API_BASE = "http://3.89.123.5:8000";

function App() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("ALL");
  const [limit, setLimit] = useState(10);
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch devices and initial sensor data
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE}/devices/`)
      .then(res => {
        setDevices(res.data);
        setSelectedDevice("ALL");
        return axios.get(`${API_BASE}/devices/data?limit=${limit}`);
      })
      .then(res => {
        if (res) setSensorData(res.data);
      })
      .catch(err => console.error("Device or sensor fetch failed:", err))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Fetch sensor data manually
  const fetchSensorData = (deviceId, itemLimit) => {
    setLoading(true);
    axios.get(`${API_BASE}/devices/${deviceId}/data?limit=${itemLimit}`)
      .then(res => setSensorData(res.data))
      .catch(err => console.error("Sensor data fetch failed:", err))
      .finally(() => setLoading(false));
  };

  const fetchAllSensorData = (itemLimit) => {
    setLoading(true);
    axios.get(`${API_BASE}/devices/data?limit=${itemLimit}`)
      .then(res => setSensorData(res.data))
      .catch(err => console.error("Sensor data fetch failed:", err))
      .finally(() => setLoading(false));
  };


  const handleSubmit = () => {
    if (selectedDevice === "ALL") {
      fetchAllSensorData(limit);
    } else {
      fetchSensorData(selectedDevice, limit);
    }
  };



  // 🔧 Loading screen
  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h2 className="mb-4">IoT Dashboard</h2>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // ✅ Main content
  return (
    <div className="container mt-5">
      <h2 className="mb-4">IoT Dashboard</h2>

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
}

export default App;
