import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function AIUMap() {
  const aiuPosition: [number, number] = [6.1412, 100.3653]; // AIU / Alor Setar area

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-md border-2 border-slate-100 bg-slate-50 relative">
      <MapContainer
        center={aiuPosition}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={aiuPosition}>
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold text-slate-900">Albukhary International University</h3>
              <p className="text-slate-500 text-xs mt-1">Jalan Tun Abdul Razak, Alor Setar, Kedah</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
