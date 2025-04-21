import { useEffect, useState } from 'react';
import axios from 'axios';
import DeviceSelector from './components/DeviceSelector';
import SensorTable from './components/SensorTable';

// ✅ Use your actual backend IP or domain here
const API_BASE = "http://3.89.123.5:8000";

function App() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("001");
  const [limit, setLimit] = useState(10);
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch devices and initial sensor data
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE}/devices/`)
      .then(res => {
        setDevices(res.data);
        const defaultDevice = res.data.find(d => d.device_id === "001")?.device_id || res.data[0]?.device_id;
        setSelectedDevice(defaultDevice);
        if (defaultDevice) {
          return axios.get(`${API_BASE}/devices/${defaultDevice}/data?limit=${limit}`);
        }
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

  const handleSubmit = () => {
    fetchSensorData(selectedDevice, limit);
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
