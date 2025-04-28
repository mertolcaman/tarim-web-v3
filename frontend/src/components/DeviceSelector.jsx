import React from 'react';

function DeviceSelector({ devices, selectedDevice, setSelectedDevice, limit, setLimit, onSubmit }) {
    return (
        <div className="row mb-4">
            <div className="col-md-4">
                <label className="form-label">Select Device</label>
                <select
                    className="form-select"
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                >
                    <option value="ALL">All Devices</option> {/* 👈 Added */}
                    {devices.map((device) => (
                        <option key={device.device_id} value={device.device_id}>
                            {device.device_id}
                        </option>
                    ))}
                </select>

            </div>
            <div className="col-md-4">
                <label className="form-label">Number of Items</label>
                <input
                    type="number"
                    className="form-control"
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    min={1}

                />
            </div>
            <div className="col-md-4 d-flex align-items-end">
                <button className="btn btn-primary w-100" onClick={onSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default DeviceSelector;
