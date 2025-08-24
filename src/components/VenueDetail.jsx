import './VenueDetail.css';

export default function VenueDetail({ venue, onClose }) {
  const getCategoryIcon = (category) => {
    const icons = {
      'Restaurant': '🍽️',
      'Cafe': '☕',
      'Park': '🌳',
      'Bar': '🍺',
      'Hotel': '🏨',
      'Shopping': '🛍️',
      'Culture': '🎭',
      'Sports': '⚽',
      'Entertainment': '🎬',
      'default': '📍'
    };
    return icons[category] || icons.default;
  };

  const formatDistance = (meters) => {
    return meters >= 1000 
      ? `${(meters / 1000).toFixed(1)} km`
      : `${Math.round(meters)} m`;
  };

  const renderRating = (rating) => {
    const stars = '⭐'.repeat(Math.round(rating / 2));
    return <div className="rating-stars">{stars}</div>;
  };

  return (
    <div className="venue-detail-overlay" onClick={onClose}>
      <div className="venue-detail" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="venue-header">
          {venue.image && (
            <img src={venue.image} alt={venue.name} className="venue-image" />
          )}
          <span className="category-icon">
            {getCategoryIcon(venue.categories[0]?.name)}
          </span>
          <h2>{venue.name}</h2>
          <p className="venue-category">{venue.categories[0]?.name}</p>
          {venue.rating && renderRating(venue.rating)}
        </div>

        <div className="venue-content">
          {venue.location && (
            <div className="info-section">
              <h3>📍 Location</h3>
              <p>{venue.location.address || 'Address not available'}</p>
              {venue.location.locality && (
                <p>{venue.location.locality}, {venue.location.region}</p>
              )}
              {venue.location.postcode && (
                <p>Postal Code: {venue.location.postcode}</p>
              )}
            </div>
          )}

          {venue.distance && (
            <div className="info-section">
              <h3>📏 Distance</h3>
              <p>{formatDistance(venue.distance)} away</p>
            </div>
          )}

          {venue.description && (
            <div className="info-section description-section">
              <h3>📝 Description</h3>
              <p>{venue.description}</p>
            </div>
          )}

          {venue.rating && (
            <div className="info-section">
              <h3>⭐ Rating</h3>
              <p>{venue.rating}/10</p>
              {venue.rating_signals && (
                <p className="review-count">Based on {venue.rating_signals} reviews</p>
              )}
            </div>
          )}

          {venue.tel && (
            <div className="info-section">
              <h3>📞 Contact</h3>
              <p>{venue.tel}</p>
            </div>
          )}

          {venue.website && (
            <div className="info-section">
              <h3>🌐 Website</h3>
              <a 
                href={venue.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="website-link"
              >
                Visit Website
              </a>
            </div>
          )}

          {(!venue.location && !venue.rating && !venue.description && !venue.tel && !venue.website) && (
            <div className="no-details">
              <p>No additional details available for this venue.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}