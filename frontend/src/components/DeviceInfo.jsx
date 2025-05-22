import React from "react";
const formatToTurkeyTime = (utcString) => {
    const date = new Date(utcString);
    date.setHours(date.getHours() + 3); // Convert to Turkey time
    return date.toLocaleString();
};

const DeviceInfo = ({ devices }) => {
    if (!devices || !Array.isArray(devices)) {
        return <p>Loading devices...</p>;
    }

    return (
        <div className="container mt-5">

            <div className="row">
                {devices.map(device => (
                    <div className="col-md-4 mb-4" key={device.device_id}>
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Device #{device.device_id}</h5>
                                <span className={`badge ${device.device_status ? "bg-success" : "bg-danger"}`}>
                                    {device.device_status ? "Active" : "Inactive"}
                                </span>
                                <p className="mt-2 mb-1"><strong>Location:</strong> {device.device_location}</p>
                                <p className="mb-1"><strong>Last Seen:</strong> {formatToTurkeyTime(device.last_visibility)}</p>
                                <p className="mb-1"><strong>Frequency:</strong> {device.data_frequency ? `${device.data_frequency}s` : "N/A"}</p>
                                <p className="mb-1"><strong>Transmit Period:</strong> {device.transmit_period ? `${device.transmit_period}s` : "N/A"}</p>
                                <p className="mb-1"><strong>Measurement Count:</strong> {device.measurement_count ?? "N/A"}</p>
                                <p className="mb-0"><strong>Created:</strong> {formatToTurkeyTime(device.time_created_at)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeviceInfo;
