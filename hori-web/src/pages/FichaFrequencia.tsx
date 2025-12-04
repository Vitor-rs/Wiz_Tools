import React, { useState } from 'react';

// --- Types ---

interface AttendanceRecord {
    id: string;
    month: string;
    weekNumber: number;
    dayOfWeek: string;
    date: string;
    fullDate: string;
    classNumber: number | '';
    presence: 'P' | 'F' | 'X';
    startTime: string;
    endTime: string;
    content: string;
    notes: string;
    evaluations: {
        fala: number | '';
        audicao: number | '';
        leitura: number | '';
        escrita: number | '';
        tarefa: number | '';
        situacaoTarefa: string;
        checkingSentences: boolean;
        app: boolean;
        engajamento: number | '';
    };
    teacher: string;
}

// --- Mock Data (Cleaned) ---

const generateMockData = (): AttendanceRecord[] => {
    return [
        {
            id: '1', month: 'JUN', weekNumber: 5, dayOfWeek: '2ª', date: '27/06', fullDate: '2022-06-27',
            classNumber: 1, presence: 'P', startTime: '00:12', endTime: '15:05',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: false, app: false, engajamento: '' }, teacher: ''
        },
        {
            id: '2', month: 'JUN', weekNumber: 5, dayOfWeek: '3ª', date: '28/06', fullDate: '2022-06-28',
            classNumber: 2, presence: 'P', startTime: '22:52', endTime: '23:30',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: false, app: false, engajamento: '' }, teacher: ''
        },
        {
            id: '3', month: 'JUN', weekNumber: 5, dayOfWeek: '4ª', date: '29/06', fullDate: '2022-06-29',
            classNumber: 3, presence: 'F', startTime: '', endTime: '',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: false, app: false, engajamento: '' }, teacher: ''
        },
        {
            id: '4', month: 'JUN', weekNumber: 5, dayOfWeek: '5ª', date: '30/06', fullDate: '2022-06-30',
            classNumber: 4, presence: 'P', startTime: '22:53', endTime: '23:30',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: false, app: false, engajamento: '' }, teacher: ''
        },
        // July
        {
            id: '5', month: 'JUL', weekNumber: 1, dayOfWeek: '6ª', date: '01/07', fullDate: '2022-07-01',
            classNumber: 5, presence: 'P', startTime: '22:53', endTime: '23:30',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: false, app: false, engajamento: '' }, teacher: ''
        },
        {
            id: '6', month: 'JUL', weekNumber: 1, dayOfWeek: 'Sáb', date: '02/07', fullDate: '2022-07-02',
            classNumber: 6, presence: 'F', startTime: '', endTime: '',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: false, app: false, engajamento: '' }, teacher: ''
        },
        {
            id: '7', month: 'JUL', weekNumber: 2, dayOfWeek: 'Dom', date: '03/07', fullDate: '2022-07-03',
            classNumber: 7, presence: 'P', startTime: '22:53', endTime: '23:30',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: false, app: false, engajamento: '' }, teacher: ''
        },
        {
            id: '8', month: 'JUL', weekNumber: 2, dayOfWeek: '2ª', date: '04/07', fullDate: '2022-07-04',
            classNumber: 8, presence: 'P', startTime: '22:55', endTime: '23:30',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: false, app: false, engajamento: '' }, teacher: ''
        },
        {
            id: '9', month: 'JUL', weekNumber: 2, dayOfWeek: '2ª', date: '04/07', fullDate: '2022-07-04',
            classNumber: 9, presence: 'P', startTime: '23:35', endTime: '23:55',
            content: '', notes: '',
            evaluations: { fala: '', audicao: '', leitura: '', escrita: '', tarefa: '', situacaoTarefa: '', checkingSentences: false, app: false, engajamento: '' }, teacher: ''
        },
    ];
};

// --- Helper Functions ---

const calculateDuration = (start: string, end: string): string => {
    if (!start || !end) return '';
    try {
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);

        if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) return '';

        let diffM = (endH * 60 + endM) - (startH * 60 + startM);
        if (diffM < 0) diffM += 24 * 60; // Handle crossing midnight

        const hours = Math.floor(diffM / 60);
        const minutes = diffM % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    } catch {
        return '';
    }
};

const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
};

const getMonthName = (date: Date) => {
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    return months[date.getMonth()];
};

const getDayOfWeek = (date: Date) => {
    const days = ['Dom', '2ª', '3ª', '4ª', '5ª', '6ª', 'Sáb'];
    return days[date.getDay()];
};

const getFormattedDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};

const getFullDate = (date: Date) => {
    return date.toISOString().split('T')[0];
};

// --- Component ---

const FichaFrequencia: React.FC = () => {
    const [records, setRecords] = useState<AttendanceRecord[]>(() => generateMockData());
    const [selectedStudent, setSelectedStudent] = useState('Vitor');
    const [newClassNumber, setNewClassNumber] = useState<number | ''>('');

    const handleLaunchPresence = () => {
        if (!newClassNumber) return; // Prevent empty class number if desired, or allow it.

        const now = new Date();
        const newRecord: AttendanceRecord = {
            id: Date.now().toString(),
            month: getMonthName(now),
            weekNumber: 0, // Logic for week number would be needed, defaulting to 0 or placeholder
            dayOfWeek: getDayOfWeek(now),
            date: getFormattedDate(now),
            fullDate: getFullDate(now),
            classNumber: newClassNumber,
            presence: 'P',
            startTime: getCurrentTime(),
            endTime: '',
            content: '',
            notes: '',
            evaluations: {
                fala: '', audicao: '', leitura: '', escrita: '', tarefa: '',
                situacaoTarefa: '', checkingSentences: false, app: false, engajamento: ''
            },
            teacher: ''
        };

        setRecords([...records, newRecord]);
        setNewClassNumber('');
    };

    const handleFinalizeClass = (id: string) => {
        const updatedRecords = records.map(record => {
            if (record.id === id) {
                return { ...record, endTime: getCurrentTime() };
            }
            return record;
        });
        setRecords(updatedRecords);
    };

    const handleUpdateRecord = (id: string, field: keyof AttendanceRecord | string, value: string | number | boolean) => {
        const updatedRecords = records.map(record => {
            if (record.id === id) {
                if (field.startsWith('evaluations.')) {
                    const evalField = field.split('.')[1] as keyof typeof record.evaluations;
                    return {
                        ...record,
                        evaluations: {
                            ...record.evaluations,
                            [evalField]: value
                        }
                    };
                }
                // Use type assertion here since we know the field is valid based on usage, 
                // but dynamic access is tricky for TS to verify perfectly without complex mapping.
                return { ...record, [field]: value } as AttendanceRecord;
            }
            return record;
        });
        setRecords(updatedRecords);
    };

    // --- Styling Constants ---
    const cellBase = "p-1 border border-slate-300 text-center text-xs h-8 align-middle";
    const inputBase = "w-full h-full bg-transparent text-center focus:outline-none focus:bg-blue-50";
    const headerBase = "p-2 border border-slate-400 font-normal bg-slate-100 text-slate-700";

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden font-sans">
            {/* Top Form */}
            <div className="bg-white p-4 border-b border-slate-200 flex items-end gap-4 shadow-sm z-10">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Aluno</label>
                    <select
                        className="border border-slate-300 rounded px-2 py-1 text-sm w-40"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                    >
                        <option value="Vitor">Vitor</option>
                        <option value="Joao">João</option>
                        <option value="Maria">Maria</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Aula</label>
                    <input
                        type="number"
                        className="border border-slate-300 rounded px-2 py-1 text-sm w-20"
                        value={newClassNumber}
                        onChange={(e) => setNewClassNumber(Number(e.target.value))}
                        placeholder="#"
                    />
                </div>
                <button
                    onClick={handleLaunchPresence}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
                >
                    Lançar Presença
                </button>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-auto p-4 bg-slate-50">
                <div className="bg-white shadow-sm border border-slate-300 inline-block min-w-full">
                    <table className="w-full text-sm border-collapse">
                        <thead className="sticky top-0 z-20">
                            <tr>
                                <th className={`${headerBase} w-12`}>Mês</th>
                                <th className={`${headerBase} w-10`}>NS</th>
                                <th className={`${headerBase} w-10`}>DS</th>
                                <th className={`${headerBase} w-16`}>D/M</th>
                                <th className={`${headerBase} w-10`}>Aula</th>
                                <th className={`${headerBase} w-10`}>Pres</th>
                                <th className={`${headerBase} w-16`}>Entrada</th>
                                <th className={`${headerBase} w-16`}>Saída</th>
                                <th className={`${headerBase} min-w-[150px]`}>Lição / Conteúdo</th>
                                <th className={`${headerBase} min-w-[150px]`}>Observações</th>
                                <th className={`${headerBase} w-8`} title="Fala">F</th>
                                <th className={`${headerBase} w-8`} title="Audição">A</th>
                                <th className={`${headerBase} w-8`} title="Leitura">L</th>
                                <th className={`${headerBase} w-8`} title="Escrita">E</th>
                                <th className={`${headerBase} w-8`} title="Tarefa">Trf</th>
                                <th className={`${headerBase} w-8`} title="Situação Tarefa">ST</th>
                                <th className={`${headerBase} w-8`} title="Checking Sentences">CS</th>
                                <th className={`${headerBase} w-8`} title="App">App</th>
                                <th className={`${headerBase} w-8`} title="Engajamento">Eng</th>
                                <th className={`${headerBase} min-w-[80px]`}>Prof.</th>
                                <th className={`${headerBase} w-16`}>Duração</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700 bg-white">
                            {records.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50">
                                    <td className={cellBase}>{row.month}</td>
                                    <td className={cellBase}>{row.weekNumber}</td>
                                    <td className={cellBase}>{row.dayOfWeek}</td>
                                    <td className={cellBase}>{row.date}</td>
                                    <td className={cellBase}>
                                        <input
                                            type="number"
                                            className={inputBase}
                                            value={row.classNumber}
                                            onChange={(e) => handleUpdateRecord(row.id, 'classNumber', e.target.value)}
                                        />
                                    </td>
                                    <td className={cellBase}>
                                        {row.presence === 'P' && <div className="w-3 h-3 rounded-full bg-green-500 mx-auto"></div>}
                                        {row.presence === 'F' && <div className="w-3 h-3 rounded-full bg-red-500 mx-auto"></div>}
                                        {row.presence === 'X' && <div className="w-3 h-3 rounded-full bg-slate-300 mx-auto"></div>}
                                    </td>
                                    <td className={`${cellBase} font-mono text-[10px]`}>{row.startTime}</td>
                                    <td className={`${cellBase} font-mono text-[10px]`}>
                                        {row.endTime ? (
                                            row.endTime
                                        ) : (
                                            <button
                                                onClick={() => handleFinalizeClass(row.id)}
                                                className="text-[10px] bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded px-1 text-slate-600"
                                            >
                                                Finalizar
                                            </button>
                                        )}
                                    </td>
                                    <td className={cellBase}>
                                        <input
                                            type="text"
                                            className={`${inputBase} text-left px-1`}
                                            value={row.content}
                                            onChange={(e) => handleUpdateRecord(row.id, 'content', e.target.value)}
                                        />
                                    </td>
                                    <td className={cellBase}>
                                        <input
                                            type="text"
                                            className={`${inputBase} text-left px-1`}
                                            value={row.notes}
                                            onChange={(e) => handleUpdateRecord(row.id, 'notes', e.target.value)}
                                        />
                                    </td>

                                    {/* Evaluations Inputs */}
                                    <td className={cellBase}><input type="text" className={inputBase} value={row.evaluations.fala} onChange={(e) => handleUpdateRecord(row.id, 'evaluations.fala', e.target.value)} /></td>
                                    <td className={cellBase}><input type="text" className={inputBase} value={row.evaluations.audicao} onChange={(e) => handleUpdateRecord(row.id, 'evaluations.audicao', e.target.value)} /></td>
                                    <td className={cellBase}><input type="text" className={inputBase} value={row.evaluations.leitura} onChange={(e) => handleUpdateRecord(row.id, 'evaluations.leitura', e.target.value)} /></td>
                                    <td className={cellBase}><input type="text" className={inputBase} value={row.evaluations.escrita} onChange={(e) => handleUpdateRecord(row.id, 'evaluations.escrita', e.target.value)} /></td>
                                    <td className={cellBase}><input type="text" className={inputBase} value={row.evaluations.tarefa} onChange={(e) => handleUpdateRecord(row.id, 'evaluations.tarefa', e.target.value)} /></td>
                                    <td className={cellBase}><input type="text" className={inputBase} value={row.evaluations.situacaoTarefa} onChange={(e) => handleUpdateRecord(row.id, 'evaluations.situacaoTarefa', e.target.value)} /></td>
                                    <td className={cellBase}>
                                        <input
                                            type="checkbox"
                                            checked={row.evaluations.checkingSentences}
                                            onChange={(e) => handleUpdateRecord(row.id, 'evaluations.checkingSentences', e.target.checked)}
                                        />
                                    </td>
                                    <td className={cellBase}>
                                        <input
                                            type="checkbox"
                                            checked={row.evaluations.app}
                                            onChange={(e) => handleUpdateRecord(row.id, 'evaluations.app', e.target.checked)}
                                        />
                                    </td>
                                    <td className={cellBase}><input type="text" className={inputBase} value={row.evaluations.engajamento} onChange={(e) => handleUpdateRecord(row.id, 'evaluations.engajamento', e.target.value)} /></td>

                                    <td className={cellBase}>
                                        <input
                                            type="text"
                                            className={inputBase}
                                            value={row.teacher}
                                            onChange={(e) => handleUpdateRecord(row.id, 'teacher', e.target.value)}
                                        />
                                    </td>
                                    <td className={`${cellBase} font-mono text-[10px]`}>
                                        {calculateDuration(row.startTime, row.endTime)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FichaFrequencia;
