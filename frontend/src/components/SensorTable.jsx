import React, { useState, useEffect } from 'react';

const SKIP_FILTER_KEYS = ['sensor_data_id']; // No filter & no sorting for sensor_data_id

function formatLocalTime(utcString) {
    const date = new Date(utcString);
    date.setHours(date.getHours() + 3); // Turkey is UTC+3
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function SensorTable({ sensorData }) {
    const [filters, setFilters] = useState({});
    const [filterOps, setFilterOps] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filteredData, setFilteredData] = useState(sensorData);

    useEffect(() => {
        let newData = sensorData.filter(row => {
            return Object.keys(filters).every(key => {
                const filterValue = filters[key];
                const filterOp = filterOps[key] || '=';
                if (filterValue === '' || filterValue === undefined) return true;

                if (key === 'device_id') {
                    return row[key] === filterValue;
                }

                // Special handling for time_created_at
                if (key === 'time_created_at') {
                    const serverDateStr = row[key];   // server UTC time string
                    let userInput = filterValue.trim();

                    if (!userInput) return true; // no filter

                    // Step 1: Parse user input as Local time
                    let userDate = new Date(userInput);

                    if (isNaN(userDate)) {
                        return true; // invalid date
                    }

                    // Step 2: Convert user input to UTC string (in same format)
                    // Important: Do NOT use .toISOString(), because we want "YYYY-MM-DD HH:MM:SS" not "T" format

                    const pad = (num) => num.toString().padStart(2, '0');

                    const utcYear = userDate.getUTCFullYear();
                    const utcMonth = pad(userDate.getUTCMonth() + 1);
                    const utcDay = pad(userDate.getUTCDate());
                    const utcHours = pad(userDate.getUTCHours());
                    const utcMinutes = pad(userDate.getUTCMinutes());
                    const utcSeconds = pad(userDate.getUTCSeconds());

                    const userUtcString = `${utcYear}-${utcMonth}-${utcDay} ${utcHours}:${utcMinutes}:${utcSeconds}`;

                    // Step 3: Detect if user typed date-only (length <= 10)
                    const filterValueHasTime = userInput.length > 10;

                    if (!filterValueHasTime && filterOp === '=') {
                        // Only date comparison
                        const serverDateOnly = serverDateStr.substring(0, 10);
                        const userDateOnly = userUtcString.substring(0, 10);

                        return serverDateOnly === userDateOnly;
                    } else {
                        // Full datetime string comparison
                        switch (filterOp) {
                            case '>': return serverDateStr > userUtcString;
                            case '<': return serverDateStr < userUtcString;
                            case '=': return serverDateStr === userUtcString;
                            default: return true;
                        }
                    }
                }






                const cellValue = parseFloat(row[key]);
                const filterNum = parseFloat(filterValue);

                if (isNaN(cellValue) || isNaN(filterNum)) {
                    // Text-based fallback
                    return String(row[key]).toLowerCase().includes(filterValue.toLowerCase());
                }

                switch (filterOp) {
                    case '>': return cellValue > filterNum;
                    case '<': return cellValue < filterNum;
                    case '=': return cellValue === filterNum;
                    default: return true;
                }
            });
        });


        if (sortConfig.key) {
            newData = [...newData].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        setFilteredData(newData);
    }, [filters, filterOps, sortConfig, sensorData]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleFilterOpChange = (key, op) => {
        setFilterOps(prev => ({
            ...prev,
            [key]: op
        }));
    };

    const handleSortClick = (key, direction) => {
        setSortConfig({ key, direction });
    };

    const uniqueDeviceIds = [...new Set(sensorData.map(item => item.device_id))];

    return (
        <>
            {/* Total Count Section */}
            <div className="mt-2">
                <p className="text-muted small">
                    Showing {filteredData.length} item(s)
                    {filteredData.length > 0 && (
                        <>
                            {" "}between <strong>{formatLocalTime(filteredData[filteredData.length - 1].time_created_at)}</strong> - <strong>{formatLocalTime(filteredData[0].time_created_at)}</strong>
                        </>
                    )}
                </p>
            </div>


            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        {sensorData[0] && Object.keys(sensorData[0]).map((key) => (
                            <th key={key}>
                                <div className="d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>{key}</span>
                                        {!SKIP_FILTER_KEYS.includes(key) && (
                                            <div className="btn-group btn-group-sm ms-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-link p-0"
                                                    onClick={() => handleSortClick(key, 'asc')}
                                                    title="Sort ascending"
                                                >
                                                    🔼
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-link p-0"
                                                    onClick={() => handleSortClick(key, 'desc')}
                                                    title="Sort descending"
                                                >
                                                    🔽
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Filters */}
                                    {!SKIP_FILTER_KEYS.includes(key) && (
                                        key === 'device_id' ? (
                                            <select
                                                className="form-select form-select-sm mt-1"
                                                value={filters[key] || ''}
                                                onChange={(e) => handleFilterChange(key, e.target.value)}
                                            >
                                                <option value="">All Devices</option>
                                                {uniqueDeviceIds.map(deviceId => (
                                                    <option key={deviceId} value={deviceId}>{deviceId}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="d-flex mt-1">
                                                <select
                                                    className="form-select form-select-sm"
                                                    style={{ width: '70px' }}
                                                    onChange={(e) => handleFilterOpChange(key, e.target.value)}
                                                >
                                                    <option value="=">=</option>
                                                    <option value=">">&gt;</option>
                                                    <option value="<">&lt;</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Filter"
                                                    onChange={(e) => handleFilterChange(key, e.target.value)}
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row, index) => (
                        <tr key={index}>
                            {Object.keys(row).map((key, idx) => (
                                <td key={idx}>
                                    {key === 'time_created_at' ? formatLocalTime(row[key]) : String(row[key])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>


        </>
    );
}

export default SensorTable;
