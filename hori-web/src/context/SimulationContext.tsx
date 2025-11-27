/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { calculateContractClasses } from '../utils/simulation';
import type { SimulationResult } from '../utils/simulation';
import type { Config, SpecialDate, Tag, CalendarEvent } from '../types';
import { parseISO, isBefore } from 'date-fns';

interface SimulationContextType {
    config: Config;
    updateConfig: (newConfig: Partial<Config>) => void;
    simulationResult: SimulationResult | null;
    specialDates: SpecialDate[];
    addSpecialDate: (date: SpecialDate) => void;
    removeSpecialDate: (id: string) => void;
    updateSpecialDate: (id: string, updates: Partial<SpecialDate>) => void;
    tags: Tag[];
    addTag: (tag: Tag) => void;
    updateTag: (id: string, updates: Partial<Tag>) => void;
    removeTag: (id: string) => void;
    generatedClasses: CalendarEvent[];
    generateMockedClasses: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const DEFAULT_TAGS: Tag[] = [
    { id: 'feriado', label: 'Feriado', color: '#ef4444' },
    { id: 'ferias', label: 'Férias', color: '#3b82f6' },
    { id: 'recesso', label: 'Recesso', color: '#f59e0b' },
];

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<Config>({
        studentName: '',
        startDate: '2025-03-01',
        contractDuration: 12,
        monthsDuration: 12,
        days: [2, 4],
        time: '00:00',
        daySchedules: [
            { dayOfWeek: 2, startTime: '13:00', endTime: '14:00' },
            { dayOfWeek: 4, startTime: '13:00', endTime: '14:00' },
        ]
    });

    const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
    const [tags, setTags] = useState<Tag[]>(DEFAULT_TAGS);
    const [generatedClasses, setGeneratedClasses] = useState<CalendarEvent[]>([]);

        const simulationResult = useMemo(() => {
        if (config.startDate && config.days.length > 0) {
            return calculateContractClasses(config.startDate, config.days, specialDates);
        }
        return null;
    }, [config, specialDates]);

    const updateConfig = (newConfig: Partial<Config>) => {
        setConfig(prev => ({ ...prev, ...newConfig }));
    };

    const addSpecialDate = (date: SpecialDate) => {
        setSpecialDates(prev => [...prev, date]);
    };

    const removeSpecialDate = (id: string) => {
        setSpecialDates(prev => prev.filter(d => d.id !== id));
    };

    const updateSpecialDate = (id: string, updates: Partial<SpecialDate>) => {
        setSpecialDates(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    };

    const addTag = (tag: Tag) => {
        setTags(prev => [...prev, tag]);
    };

    const updateTag = (id: string, updates: Partial<Tag>) => {
        setTags(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const removeTag = (id: string) => {
        setTags(prev => prev.filter(t => t.id !== id));
    };

    const generateMockedClasses = () => {
        if (!simulationResult) return;

        const today = new Date();
        const events: CalendarEvent[] = [];

        simulationResult.validDates.forEach(dateStr => {
            const classDate = parseISO(dateStr);
            const isPast = isBefore(classDate, today);

            if (isPast) {
                const rand = Math.random();
                if (rand < 0.85) {
                    events.push({
                        id: crypto.randomUUID(),
                        date: dateStr,
                        type: 'Normal',
                        attended: true,
                        late: Math.random() < 0.1,
                        differentTime: false
                    });
                } else {
                    events.push({
                        id: crypto.randomUUID(),
                        date: dateStr,
                        type: 'Falta',
                        attended: false
                    });
                }
            } else {
                events.push({
                    id: crypto.randomUUID(),
                    date: dateStr,
                    type: 'Futuro',
                    attended: false,
                    differentTime: false
                });
            }
        });

        setGeneratedClasses(events);
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
            addTag,
            updateTag,
            removeTag,
            generatedClasses,
            generateMockedClasses
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
