import React from 'react';

function SensorTable({ sensorData }) {
    return (
        <table className="table table-bordered table-striped">
            <thead>
                <tr>
                    {sensorData[0] &&
                        Object.keys(sensorData[0]).map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                </tr>
            </thead>
            <tbody>
                {sensorData.map((row, index) => (
                    <tr key={index}>
                        {Object.values(row).map((value, idx) => (
                            <td key={idx}>{String(value)}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default SensorTable;
