/**
 * Google Maps Service
 * 
 * To fully configure this service:
 * 1. Install required packages if using SDK: npm install @googlemaps/google-maps-services-js
 * 2. Add GOOGLE_MAPS_API_KEY to your .env file
 */

const apiKey = process.env.GOOGLE_MAPS_API_KEY;

if (!apiKey) {
  console.warn('GOOGLE_MAPS_API_KEY is not set. Map service returning mock data.');
}

exports.geocodeAddress = async (address) => {
  if (!apiKey) {
    return { lat: 28.6139, lng: 77.2090 }; // Mock coordinates (New Delhi)
  }
  
  // Example real implementation via fetch or SDK:
  // const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
  // const data = await response.json();
  // if(data.results && data.results.length > 0) return data.results[0].geometry.location;
  
  return null;
};

exports.getDistance = async (origin, destination) => {
  if (!apiKey) {
    return { distance: { text: '15 km', value: 15000 }, duration: { text: '30 mins', value: 1800 } };
  }
  return null;
};

exports.getAutocomplete = async (input) => {
  if (!apiKey) {
    return [];
  }
  return [];
};
