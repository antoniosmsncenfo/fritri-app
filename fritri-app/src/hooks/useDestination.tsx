import { useState } from 'react';
import { getDestinations } from '../api/lugaresTuristicosDB';
import { IDestino } from '../interfaces/destino';
import { useTranslation } from './useTranslation';

export const useDestination = () => {
    const { locale } = useTranslation();
    const [destinations, setDestinations] = useState<IDestino[]>([]);

    const destinationsSearch = async (destination: string) => {
        const result = await getDestinations(destination, locale);
        if (result) {
            setDestinations(result);
        }
    };
    return (
        {
            destinations,
            destinationsSearch,
        }
    );
};
