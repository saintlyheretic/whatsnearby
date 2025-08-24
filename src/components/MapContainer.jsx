import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapContainer.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for selected venue
const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// Component to handle map updates
function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
}

export default function MapContainerComponent({ userLocation, venues, onSelectVenue, selectedVenue }) {
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={14}
      className="map"
      scrollWheelZoom={true}
    >
      <MapUpdater center={[userLocation.lat, userLocation.lng]} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* User location marker */}
      <Marker position={[userLocation.lat, userLocation.lng]}>
        <Popup>
          <div className="map-popup">
            <strong>📍 You are here</strong>
          </div>
        </Popup>
      </Marker>
      
      {/* Venue markers */}
      {venues.map(venue => {
        // Check if venue has valid coordinates
        const lat = venue.geocodes?.main?.latitude || venue.latitude;
        const lng = venue.geocodes?.main?.longitude || venue.longitude;
        
        if (!lat || !lng) return null;
        
        return (
          <Marker
            key={venue.fsq_id || venue.id}
            position={[lat, lng]}
            icon={selectedVenue?.fsq_id === venue.fsq_id ? selectedIcon : undefined}
            eventHandlers={{
              click: () => onSelectVenue(venue),
            }}
          >
            <Popup>
              <div className="map-popup">
                <h3>{venue.name}</h3>
                <p>{venue.categories?.[0]?.name || 'Venue'}</p>
                {(venue.location?.address || venue.address) && (
                  <p className="popup-address">
                    {venue.location?.address || venue.address}
                  </p>
                )}
                <button 
                  className="popup-btn"
                  onClick={() => onSelectVenue(venue)}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}