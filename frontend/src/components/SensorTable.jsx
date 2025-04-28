import React, { useState, useEffect } from 'react';

const SKIP_FILTER_KEYS = ['sensor_data_id']; // No filter & no sorting for sensor_data_id

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
                            <td key={idx}>{String(row[key])}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default SensorTable;
