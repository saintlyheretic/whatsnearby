const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

export const CATEGORIES = {
  ALL: 'All Places',
  RESTAURANTS: 'restaurant',
  CAFES: 'cafe',
  BARS: 'bar',
  PARKS: 'park',
  SHOPPING: 'marketplace',
  CULTURE: 'museum',
  SPORTS: 'sport',
  HOTELS: 'hotel'
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // Convert to meters
};

const buildOverpassQuery = (lat, lng, radius, amenityType = '') => {
  // Convert radius from meters to degrees (approximate)
  const radiusDegrees = radius / 111000;
  const bbox = `${lat - radiusDegrees},${lng - radiusDegrees},${lat + radiusDegrees},${lng + radiusDegrees}`;
  
  let amenityFilter = '';
  if (amenityType && amenityType !== 'All Places') {
    amenityFilter = `["amenity"="${amenityType}"]`;
  }

  return `[out:json][timeout:25];(node${amenityFilter}(${bbox});way${amenityFilter}(${bbox});relation${amenityFilter}(${bbox}););out body;>;out skel qt;`;
};

export const fetchNearbyPlaces = async (lat, lng, category = CATEGORIES.ALL, radius = 2000) => {
  try {
    console.log('Fetching places for:', { lat, lng, category, radius });
    
    const query = buildOverpassQuery(lat, lng, radius, category);
    console.log('Query:', query);

    const response = await fetch(OVERPASS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Raw data:', responseData);

    if (!responseData.elements || !Array.isArray(responseData.elements)) {
      throw new Error('Invalid response format from Overpass API');
    }

    const venues = responseData.elements
      .filter(element => {
        return element.tags && (
          element.tags.name ||
          element.tags.amenity ||
          element.tags.leisure ||
          element.tags.tourism
        );
      })
      .map(element => {
        const venue = {
          id: element.id,
          name: element.tags.name || 'Unnamed Venue',
          amenity: element.tags.amenity || element.tags.leisure || element.tags.tourism,
          lat: element.lat || (element.center ? element.center.lat : null),
          lng: element.lon || (element.center ? element.center.lon : null),
          address: element.tags['addr:street'] 
            ? `${element.tags['addr:housenumber'] || ''} ${element.tags['addr:street']}`
            : 'Address not available',
          distance: calculateDistance(
            lat,
            lng,
            element.lat || (element.center ? element.center.lat : lat),
            element.lon || (element.center ? element.center.lon : lng)
          ),
          tags: element.tags
        };

        // Only include venues with valid coordinates
        return venue.lat && venue.lng ? venue : null;
      })
      .filter(venue => venue !== null) // Remove any null venues
      .sort((a, b) => a.distance - b.distance); // Sort by distance

    console.log('Valid venues found:', venues.length);
    return venues;

  } catch (error) {
    console.error('Failed to fetch places:', error);
    throw new Error(`Failed to fetch venues: ${error.message}`);
  }
};
