"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Next.js/Webpack
const DefaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
    center?: [number, number]; // [lat, lng]
    zoom?: number;
    markerPosition?: [number, number] | null;
    onPositionChange?: (lat: number, lng: number) => void;
    readonly?: boolean;
}

function MapEvents({ onPositionChange }: { onPositionChange?: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            if (onPositionChange) {
                onPositionChange(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
}

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMapEvents({});
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

export default function LeafletMap({
    center = [25.2048, 55.2708], // Default to Dubai
    zoom = 13,
    markerPosition,
    onPositionChange,
    readonly = false
}: MapComponentProps) {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}
            scrollWheelZoom={!readonly}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {!readonly && <MapEvents onPositionChange={onPositionChange} />}

            {/* Update view when center changes */}
            <MapUpdater center={center} />

            {/* Display Marker */}
            {markerPosition && (
                <Marker position={markerPosition} />
            )}
        </MapContainer>
    );
}
