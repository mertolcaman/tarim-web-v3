import React, { useEffect, useState } from "react";
import axios from "axios";
import DeviceMap from "../components/devices/DeviceMap";
import DeviceInfo from "../components/devices/DeviceInfo";


const API_BASE = import.meta.env.VITE_API_BASE;

const DevicePage = () => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE}/devices/`)
            .then(res => {
                const sorted = res.data.sort((a, b) => a.device_id.localeCompare(b.device_id));
                setDevices(sorted);
            })
            .catch(err => console.error("Failed to fetch devices:", err));
    }, []);

    return (
        <div className="container mt-4">
            <h3 className="mb-3 text-center">Device Locations</h3>
            <DeviceMap devices={devices} />

            <h4 className="mt-5 mb-4 text-center">Device Information</h4>
            <DeviceInfo devices={devices} />
        </div>
    );
};

export default DevicePage;
