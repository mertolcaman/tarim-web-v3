import React, { useState } from "react";
import axios from "axios";


const API_BASE = import.meta.env.VITE_API_BASE;


function formatToTurkeyTime(utcString) {
    const date = new Date(utcString);
    date.setHours(date.getHours()); // Turkey is UTC+3
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}



function renderOtaStatus(status) {
    switch (status) {
        case "updated":
            return <span className="badge bg-success">✅ Updated</span>;
        case "pending":
            return <span className="badge bg-warning text-dark">🛠️ Pending...</span>;
        case "failed":
            return <span className="badge bg-danger">⚠️ Failed</span>;
        default:
            return <span className="badge bg-dark">❓ Unknown</span>;
    }
}

function formatSecondsToHourMinute(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    const hrLabel = hrs === 1 ? "hour" : "hours";
    const minLabel = mins === 1 ? "minute" : "minutes";

    return `${hrs} ${hrLabel} : ${mins} ${minLabel}`;
}





const DeviceInfo = ({ devices }) => {
    const [editedNames, setEditedNames] = useState({});
    const [editingId, setEditingId] = useState(null);

    const handleEditClick = (deviceId, currentName) => {
        setEditingId(deviceId);
        setEditedNames(prev => ({ ...prev, [deviceId]: currentName }));
    };

    const handleNameChange = (deviceId, newName) => {
        setEditedNames(prev => ({ ...prev, [deviceId]: newName }));
    };

    const handleSaveName = async (deviceId) => {
        const updatedName = editedNames[deviceId];
        console.log(`Save name for ${deviceId}: ${updatedName}`);
        setEditingId(null);
        try {
            const response = await axios.post(`${API_BASE}/devices/edit_device_name`, null, {
                params: {
                    device_name: updatedName,
                    device_id: deviceId,
                },
            });

            alert(`✅ ${response.data.message}`);
            window.location.reload(); // 🔄 Refresh the page after success
        } catch (error) {
            console.error("❌ Failed to update device name:", error);
            alert("❌ Failed to update device name.");
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    if (!devices || !Array.isArray(devices)) {
        return <p>Loading devices...</p>;
    }



    const handleGpsRequest = async (deviceId) => {
        try {
            const response = await axios.post(`${API_BASE}/devices/gps_request`, null, {
                params: {
                    gps_request: true,
                    device_id: deviceId,
                },
            });

            alert(`📡 ${response.data.message}`);
            window.location.reload();
        } catch (error) {
            console.error("❌ Failed to send GPS request:", error);
            alert("❌ Failed to request GPS.");
        }
    };


    return (
        <div className="container mt-5">
            <h3 className="mb-4">Device Overview</h3>
            <div className="row">
                {devices.map(device => (
                    <div className="col-md-6 col-lg-4 mb-4" key={device.device_id}>
                        <div className="card shadow-sm h-100">
                            <div className="card-body d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    {editingId === device.device_id ? (
                                        <div className="w-100">
                                            <input
                                                type="text"
                                                className="form-control form-control-sm mb-2"
                                                value={editedNames[device.device_id]}
                                                onChange={(e) => handleNameChange(device.device_id, e.target.value)}
                                            />
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-sm btn-success" onClick={() => handleSaveName(device.device_id)}>Save</button>
                                                <button className="btn btn-sm btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h5 className="card-title mb-0">
                                                {device.device_name}{" "}
                                                <span
                                                    role="button"
                                                    className="ms-2"
                                                    title="Edit name"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleEditClick(device.device_id, device.device_name)}
                                                >
                                                    ✏️
                                                </span>
                                            </h5>

                                            <span className={`badge ${device.device_status ? "bg-success" : "bg-danger"}`}>
                                                {device.device_status ? "Active" : "Inactive"}
                                            </span>
                                        </>
                                    )}
                                </div>

                                <hr />

                                <p className="mb-1"><strong>ID:</strong> {device.device_id}</p>
                                <p className="mb-1"><strong>OTA Status:</strong> {renderOtaStatus(device.ota_status)}</p>
                                <p className="mb-1"><strong>Location:</strong> {device.device_location}</p>
                                <p className="mb-1"><strong>Last Seen:</strong> {formatToTurkeyTime(device.last_visibility)}</p>
                                <p className="mb-1"><strong>Expected Data Period:</strong> {device.transmit_period ? formatSecondsToHourMinute(device.transmit_period) : "N/A"}</p>
                                <p className="mb-0"><strong>Created At:</strong> {formatToTurkeyTime(device.time_created_at)}</p>
                                <p className="mb-0">
                                    <strong>GPS Request:</strong>{" "}
                                    {device.gps_request ? (
                                        <span className="badge bg-success">✅ True</span>
                                    ) : (
                                        <span className="badge bg-secondary">❌ False</span>
                                    )}
                                </p>

                                <div className="mt-3 d-flex justify-content-center border-top pt-3">


                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        title="Send a GPS request to this device"
                                        onClick={() => handleGpsRequest(device.device_id)}
                                    >
                                        📡 Request GPS
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default DeviceInfo;
