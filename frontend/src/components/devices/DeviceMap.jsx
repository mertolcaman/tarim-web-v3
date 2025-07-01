import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

const POINT_STYLES = {
    active: {
        radius: 8,
        fillColor: "darkgreen",
        color: "darkgreen",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
    },
    inactive: {
        radius: 8,
        fillColor: "darkred",
        color: "darkred",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
    },
};

// 🔄 Fit map bounds to devices
const FitBounds = ({ devices }) => {
    const map = useMap();

    useEffect(() => {
        const bounds = devices
            .map(device => {
                const [lat, lon] = device.device_location?.split(',').map(coord => parseFloat(coord.trim())) || [];
                return [lat, lon];
            })
            .filter(([lat, lon]) => !isNaN(lat) && !isNaN(lon));

        if (bounds.length > 0) {
            map.fitBounds(bounds);
        }
    }, [devices, map]);

    return null;
};

const DeviceMap = ({ devices }) => {
    return (
        <MapContainer center={[38.46, 27.22]} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FitBounds devices={devices} />

            {devices.map(device => {
                const [lat, lon] = device.device_location?.split(',').map(coord => parseFloat(coord.trim())) || [];
                const style = device.device_status ? POINT_STYLES.active : POINT_STYLES.inactive;

                if (!lat || !lon || isNaN(lat) || isNaN(lon)) return null;

                return (
                    <CircleMarker
                        key={device.device_id}
                        center={[lat, lon]}
                        pathOptions={style}
                        radius={style.radius}
                    >
                        <Tooltip>{device.device_id}</Tooltip>
                        <Popup>
                            <strong>Device ID:</strong> {device.device_id}<br />
                            <strong>Status:</strong> {device.device_status ? '✅ Online' : '❌ Offline'}<br />
                            <strong>Frequency:</strong> {device.data_frequency || "N/A"} sec<br />
                            <strong>Last Seen:</strong><br /> {new Date(device.last_visibility).toLocaleString()}
                        </Popup>
                    </CircleMarker>
                );
            })}
        </MapContainer>
    );
};

export default DeviceMap;
