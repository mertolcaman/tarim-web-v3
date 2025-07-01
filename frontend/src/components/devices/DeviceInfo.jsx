import React from "react";

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
            return <span className="badge bg-success">✅ Up to date</span>;
        case "pending":
            return <span className="badge bg-warning text-dark">🛠️ Updating...</span>;
        case "failed":
            return <span className="badge bg-danger">⚠️ Update failed</span>;
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
    if (!devices || !Array.isArray(devices)) {
        return <p>Loading devices...</p>;
    }

    return (
        <div className="container mt-5">
            <h3 className="mb-4">Device Overview</h3>
            <div className="row">
                {devices.map(device => (
                    <div className="col-md-6 col-lg-4 mb-4" key={device.device_id}>
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="card-title mb-0">{device.device_name}</h5>
                                    <span className={`badge ${device.device_status ? "bg-success" : "bg-danger"}`}>
                                        {device.device_status ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <hr />
                                <p className="mb-1"><strong>ID:</strong> {device.device_id}</p>
                                <p className="mb-1"><strong>OTA Status:</strong> {renderOtaStatus(device.ota_status)}</p>
                                <p className="mb-1"><strong>Location:</strong> {device.device_location}</p>
                                <p className="mb-1"><strong>Last Seen:</strong> {formatToTurkeyTime(device.last_visibility)}</p>
                                <p className="mb-1"><strong>Expected Data Period:</strong> {device.transmit_period ? formatSecondsToHourMinute(device.transmit_period) : "N/A"}</p>


                                <p className="mb-0"><strong>Created At:</strong> {formatToTurkeyTime(device.time_created_at)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeviceInfo;
