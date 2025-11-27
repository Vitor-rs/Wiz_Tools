import React, { useState, useEffect } from 'react';
import { calculateContractClasses } from '../utils/simulation';
import type { SimulationResult } from '../utils/simulation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ContractConfigProps {
    onSimulationUpdate: (result: SimulationResult | null) => void;
}

const DAYS = [
    { label: 'Seg', value: 1 },
    { label: 'Ter', value: 2 },
    { label: 'Qua', value: 3 },
    { label: 'Qui', value: 4 },
    { label: 'Sex', value: 5 },
    { label: 'Sáb', value: 6 },
];

const ContractConfig: React.FC<ContractConfigProps> = ({ onSimulationUpdate }) => {
    const [startDate, setStartDate] = useState('2025-03-01');
    const [selectedDays, setSelectedDays] = useState<number[]>([2, 4]); // Default Tue/Thu
    const [result, setResult] = useState<SimulationResult | null>(null);

    const updateSimulation = (start: string, days: number[]) => {
        if (start && days.length > 0) {
            const simResult = calculateContractClasses(start, days);
            setResult(simResult);
            onSimulationUpdate(simResult);
        } else {
            setResult(null);
            onSimulationUpdate(null);
        }
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setStartDate(newDate);
        updateSimulation(newDate, selectedDays);
    };

    const handleDayToggle = (day: number) => {
        const newDays = selectedDays.includes(day)
            ? selectedDays.filter(d => d !== day)
            : [...selectedDays, day].sort();

        setSelectedDays(newDays);
        updateSimulation(startDate, newDays);
    };

    // Initial calculation on mount only
    useEffect(() => {
        updateSimulation(startDate, selectedDays);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Simulação de Contrato (2025)</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Início do Contrato</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dias de Aula</label>
                        <div className="flex gap-2">
                            {DAYS.map(day => (
                                <button
                                    key={day.value}
                                    onClick={() => handleDayToggle(day.value)}
                                    className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${selectedDays.includes(day.value)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dashboard / Results */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    {result ? (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Total de Aulas:</span>
                                <span className="text-2xl font-bold text-blue-600">{result.totalClasses}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Término (1 ano):</span>
                                <span className="font-medium">{format(new Date(result.endDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                            </div>

                            <div className="pt-3 border-t border-slate-200">
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Dias Pulados ({result.skippedDates.length})</p>
                                <div className="max-h-32 overflow-y-auto text-xs text-gray-600 space-y-1 custom-scrollbar pr-2">
                                    {result.skippedDates.map((skip, i) => (
                                        <div key={i} className="flex justify-between">
                                            <span>{format(new Date(skip.date), "dd/MM")}</span>
                                            <span className="text-gray-400 truncate ml-2" title={skip.reason}>{skip.reason}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                            Selecione uma data e dias da semana
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContractConfig;
