// src/components/FilterPanel.jsx
import React from 'react';
import DateRangePicker from './DateRangePicker';

const FilterPanel = ({
    devices,
    selectedDevice,
    setSelectedDevice,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    fetchData
}) => {
    return (
        <div className="card p-4 mb-4 shadow-sm border-0">
            <div className="row g-3 align-items-end">
                {/* Device Selector */}
                <div className="col-md-4">
                    <label htmlFor="deviceSelect" className="form-label">Select Device</label>
                    <select
                        id="deviceSelect"
                        className="form-control"
                        value={selectedDevice}
                        onChange={(e) => setSelectedDevice(e.target.value)}
                    >
                        {devices.map(device => (
                            <option key={device} value={device}>{device}</option>
                        ))}
                    </select>
                </div>

                {/* Date Range Picker */}
                <div className="col-md-8">
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        onFetch={fetchData}
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
