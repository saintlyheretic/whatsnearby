import VenueListItem from './VenueListItem';
import LoadingSpinner from './LoadingSpinner';
import './VenueList.css';

export default function VenueList({ venues, onSelectVenue, selectedVenue, isLoading }) {
  const handleVenueSelect = (venue) => {
    onSelectVenue(venue);
    // On mobile, this will trigger the bottom sheet to collapse after selection
    if (window.innerWidth <= 768) {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.remove('expanded');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="venue-list-loading">
        <LoadingSpinner />
        <p>Loading places...</p>
      </div>
    );
  }

  return (
    <div className="venue-list">
      {venues.map(venue => (
        <VenueListItem
          key={venue.id}
          venue={venue}
          onSelect={handleVenueSelect}
          isSelected={selectedVenue?.id === venue.id}
        />
      ))}
    </div>
  );
}