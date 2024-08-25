import Geocoder from 'react-native-geocoding';
import { GOOGLE_MAPS_API_KEY } from '@env';

Geocoder.init(GOOGLE_MAPS_API_KEY);

const calculateDistance = async (startLocation, destination) => {
    try {
        const geo = await Geocoder.from(destination);
        const { lat, lng } = geo.results[0].geometry.location;

        const rad = (x) => (x * Math.PI) / 180;

        const R = 6371; // Earth’s mean radius in km
        const dLat = rad(lat - startLocation.latitude);
        const dLong = rad(lng - startLocation.longitude);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(startLocation.latitude)) *
            Math.cos(rad(lat)) *
            Math.sin(dLong / 2) *
            Math.sin(dLong / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance; // Retorna a distância em km
    } catch (error) {
        console.error(error);
        return 0;
    }
};

export default calculateDistance;