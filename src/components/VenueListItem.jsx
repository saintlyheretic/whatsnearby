import './VenueListItem.css';

export default function VenueListItem({ venue, onSelect, isSelected }) {
  const getDistanceText = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  return (
    <div 
      className={`venue-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(venue)}
    >
      <div className="venue-info">
        <h3 className="venue-name">{venue.name}</h3>
        <p className="venue-category">
          {venue.amenity || 'Unknown category'}
        </p>
        {venue.distance && (
          <p className="venue-distance">
            📍 {getDistanceText(venue.distance)}
          </p>
        )}
      </div>
      <div className="venue-arrow">→</div>
    </div>
  );
}