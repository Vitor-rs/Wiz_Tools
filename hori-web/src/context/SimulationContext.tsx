import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { calculateContractClasses, SimulationResult } from '../utils/simulation';
import { Config, SpecialDate, Tag } from '../types';

interface SimulationContextType {
    config: Config;
    updateConfig: (newConfig: Partial<Config>) => void;
    simulationResult: SimulationResult | null;
    specialDates: SpecialDate[];
    addSpecialDate: (date: SpecialDate) => void;
    removeSpecialDate: (id: string) => void;
    updateSpecialDate: (date: SpecialDate) => void;
    tags: Tag[];
    addTag: (tag: Tag) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const DEFAULT_TAGS: Tag[] = [
    { id: 'feriado', label: 'Feriado', color: '#ef4444' }, // red
    { id: 'ferias', label: 'Férias', color: '#3b82f6' },   // blue
    { id: 'recesso', label: 'Recesso', color: '#f59e0b' }, // amber
];

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<Config>({
        startDate: '2025-03-01',
        contractDuration: 12,
        monthsDuration: 12,
        days: [2, 4], // Default Tue/Thu
        time: '00:00'
    });

    const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
    const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
    const [tags, setTags] = useState<Tag[]>(DEFAULT_TAGS);

    // Calculate simulation whenever config changes
    useEffect(() => {
        if (config.startDate && config.days.length > 0) {
            const result = calculateContractClasses(config.startDate, config.days);
            setSimulationResult(result);
        } else {
            setSimulationResult(null);
        }
    }, [config]);

    const updateConfig = (newConfig: Partial<Config>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    };

    const addSpecialDate = (date: SpecialDate) => {
        setSpecialDates(prev => [...prev, date]);
    };

    const removeSpecialDate = (id: string) => {
        setSpecialDates(prev => prev.filter(d => d.id !== id));
    };

    const updateSpecialDate = (updatedDate: SpecialDate) => {
        setSpecialDates(prev => prev.map(d => d.id === updatedDate.id ? updatedDate : d));
    };

    const addTag = (tag: Tag) => {
        setTags(prev => [...prev, tag]);
    };

    return (
        <SimulationContext.Provider value={{
            config,
            updateConfig,
            simulationResult,
            specialDates,
            addSpecialDate,
            removeSpecialDate,
            updateSpecialDate,
            tags,
            addTag
        }}>
            {children}
        </SimulationContext.Provider>
    );
};

export const useSimulation = () => {
    const context = useContext(SimulationContext);
    if (context === undefined) {
        throw new Error('useSimulation must be used within a SimulationProvider');
    }
    return context;
};
