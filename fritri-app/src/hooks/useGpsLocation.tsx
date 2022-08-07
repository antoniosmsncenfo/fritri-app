import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';

export const useGpsLocation = () => {

    const getCurrentPosition = async (): Promise<LocationObject | null> => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') { return null; }

            const currentLocation = await Location.getCurrentPositionAsync({});

            return currentLocation;
        } catch (error) {
            return null;
        }
    };

    return {
        getCurrentPosition,
    };
};
