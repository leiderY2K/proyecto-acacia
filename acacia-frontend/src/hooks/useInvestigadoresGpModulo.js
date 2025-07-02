// src/hooks/useInvestigadoresGpModulo.js
import { useState, useEffect } from 'react';
import { investigadoresService } from '../services/InvestigadoresService';

export const useInvestigadoresGpModulo = () => {
    const [investigadores, setInvestigadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await investigadoresService.getInvestigadoresGpModulo();
            setInvestigadores(data.data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { investigadores, loading, error, refetch: fetchData };
};
