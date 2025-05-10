import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const pointStyle = {
    radius: 8,
    fillColor: "green",
    color: "darkgreen",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
};

const DeviceMap = ({ devices }) => {
    return (
        <MapContainer center={[38.46, 27.22]} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {devices.map(device => {
                const [lat, lon] = device.device_location?.split(',').map(coord => parseFloat(coord.trim())) || [];

                if (isNaN(lat) || isNaN(lon)) return null;

                return (
                    <CircleMarker
                        key={device.device_id}
                        center={[lat, lon]}
                        pathOptions={pointStyle}
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
