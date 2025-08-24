import { useState, useEffect } from 'react';
import { fetchNearbyPlaces, CATEGORIES } from './services/api';
import { geocodeLocation } from './services/geocoding';
import { useBottomSheet } from './hooks/useBottomSheet';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import MapContainer from './components/MapContainer';
import VenueList from './components/VenueList';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES.ALL);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isExpanded, setIsExpanded, sidebarRef] = useBottomSheet(false);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setError(null);
      },
      (err) => {
        setError('Unable to get location');
        setIsLoading(false);
      }
    );
  };

  const handleSearch = async (query) => {
    setIsLoading(true);
    try {
      const coords = await geocodeLocation(query);
      setUserLocation(coords);
      setError(null);
    } catch (err) {
      setError('Location not found');
    }
  };

  useEffect(() => {
    const fetchVenues = async () => {
      if (!userLocation) return;
      
      setIsLoading(true);
      setVenues([]); // Clear existing venues while loading
      try {
        console.log('Fetching venues for location:', userLocation);
        const venuesData = await fetchNearbyPlaces(
          userLocation.lat, 
          userLocation.lng, 
          selectedCategory
        );
        console.log('Venues received:', venuesData.length);
        setVenues(venuesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching venues:', err);
        setError(err.message || 'Failed to load venues');
        setVenues([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, [userLocation, selectedCategory]);

  return (
    <div className="app">
      <Header 
        onUseMyLocation={handleUseMyLocation}
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      
      <div className="app-content">
        <div 
          ref={sidebarRef}
          className={`sidebar ${isExpanded ? 'expanded' : ''}`}
        >
          <div className="sidebar-header">
            <div className="handle-bar" />
            <h2>Nearby Places</h2>
          </div>
          <div className="categories">
            {Object.entries(CATEGORIES).map(([key, value]) => (
              <button
                key={value}
                className={selectedCategory === value ? 'active' : ''}
                onClick={() => setSelectedCategory(value)}
              >
                {key}
              </button>
            ))}
          </div>

          {error && <div className="error">{error}</div>}

          {isLoading && <LoadingSpinner />}

          <VenueList
            venues={venues}
            selectedVenue={selectedVenue}
            onSelectVenue={setSelectedVenue}
            isLoading={isLoading}
          />
        </div>

        <div className="map-container">
          {userLocation && (
            <MapContainer
              userLocation={userLocation}
              venues={venues}
              selectedVenue={selectedVenue}
              onSelectVenue={setSelectedVenue}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;