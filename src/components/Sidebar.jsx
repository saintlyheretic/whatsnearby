import { CATEGORIES } from '../../services/api';
import VenueList from '../VenueList/VenueList';
import './Sidebar.css';

export default function Sidebar({
  venues,
  selectedCategory,
  onCategoryChange,
  onSelectVenue,
  selectedVenue,
  isLoading,
  error
}) {
  const categoryNames = {
    [CATEGORIES.ALL]: 'All Places',
    [CATEGORIES.RESTAURANTS]: 'Restaurants',
    [CATEGORIES.CAFES]: 'Cafes',
    [CATEGORIES.PARKS]: 'Parks',
    [CATEGORIES.BARS]: 'Bars',
    [CATEGORIES.HOTELS]: 'Hotels'
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Nearby Places</h2>
        <div className="category-filters">
          {Object.entries(CATEGORIES).map(([key, value]) => (
            <button
              key={value}
              className={`category-btn ${selectedCategory === value ? 'active' : ''}`}
              onClick={() => onCategoryChange(value)}
              disabled={isLoading}
            >
              {categoryNames[value]}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-content">
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {!error && venues.length === 0 && !isLoading && (
          <div className="no-results">
            <p>No places found in this area.</p>
            <p>Try a different location or category.</p>
          </div>
        )}

        <VenueList
          venues={venues}
          onSelectVenue={onSelectVenue}
          selectedVenue={selectedVenue}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}