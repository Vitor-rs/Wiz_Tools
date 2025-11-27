import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Tag as TagIcon, Trash2, Play } from 'lucide-react';
import { IMMUTABLE_RULES } from '../config/rules';

const DAYS = [
    { label: 'Seg', value: 1 },
    { label: 'Ter', value: 2 },
    { label: 'Qua', value: 3 },
    { label: 'Qui', value: 4 },
    { label: 'Sex', value: 5 },
    { label: 'Sáb', value: 6 },
];

const SimulationPage: React.FC = () => {
    const {
        config,
        updateConfig,
        simulationResult,
        specialDates,
        addSpecialDate,
        removeSpecialDate,
        tags,
        addTag,
        generateMockedClasses
    } = useSimulation();

    const [newDate, setNewDate] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#3b82f6');

    useEffect(() => {
        if (specialDates.length === 0) {
            IMMUTABLE_RULES.holidays.forEach(holiday => {
                addSpecialDate({
                    id: crypto.randomUUID(),
                    date: holiday.date,
                    description: holiday.name,
                    tagIds: ['feriado']
                });
            });
        }
    }, [addSpecialDate, specialDates.length]);

    const handleDayToggle = (day: number) => {
        const currentDays = config.days || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day].sort();

        const newSchedules = [...(config.daySchedules || [])];

        if (!currentDays.includes(day)) {
            newSchedules.push({ dayOfWeek: day, startTime: '13:00', endTime: '14:00' });
            updateConfig({ days: newDays, daySchedules: newSchedules });
        } else {
            const filtered = newSchedules.filter(s => s.dayOfWeek !== day);
            updateConfig({ days: newDays, daySchedules: filtered });
        }
    };

    const handleAddSpecialDate = () => {
        if (!newDate || !newDesc) return;
        addSpecialDate({
            id: crypto.randomUUID(),
            date: newDate,
            description: newDesc,
            tagIds: selectedTagIds
        });
        setNewDate('');
        setNewDesc('');
        setSelectedTagIds([]);
    };

    const handleAddTag = () => {
        if (!newTagName) return;
        addTag({
            id: crypto.randomUUID(),
            label: newTagName,
            color: newTagColor
        });
        setNewTagName('');
        setIsTagModalOpen(false);
    };

    const toggleTagSelection = (tagId: string) => {
        setSelectedTagIds(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
    };

    return (
        <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto custom-scrollbar">
            <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <span className="bg-blue-600 p-2 rounded-lg text-white">
                    <TagIcon size={24} />
                </span>
                Simulador de Contrato & Datas Especiais
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Configuração do Contrato</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Nome do Aluno</label>
                                <input
                                    type="text"
                                    value={config.studentName || ''}
                                    onChange={(e) => updateConfig({ studentName: e.target.value })}
                                    placeholder="Ex: João Silva"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Início do Contrato</label>
                                <input
                                    type="date"
                                    value={config.startDate}
                                    onChange={(e) => updateConfig({ startDate: e.target.value })}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">Dias de Aula</label>
                                <div className="flex flex-wrap gap-2">
                                    {DAYS.map(day => (
                                        <button
                                            key={day.value}
                                            onClick={() => handleDayToggle(day.value)}
                                            className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${config.days.includes(day.value)
                                                    ? 'bg-blue-600 text-white shadow-md scale-105'
                                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                }`}
                                        >
                                            {day.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {config.days.length > 0 && (
                                <div className="border-t pt-4 space-y-2">
                                    <button
                                        onClick={() => updateConfig({ days: [...config.days] })}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <Play size={20} />
                                        Gerar Aulas do Contrato
                                    </button>
                                    <button
                                        onClick={() => {
                                            updateConfig({ days: [...config.days] });
                                            setTimeout(() => generateMockedClasses(), 100);
                                        }}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
                                    >
                                        🎲 Gerar Dados Mocados
                                    </button>

                                    <label className="block text-sm font-medium text-slate-600 mb-3 mt-4">Horários das Aulas</label>
                                    <div className="space-y-3">
                                        {config.days.map(dayValue => {
                                            const dayLabel = DAYS.find(d => d.value === dayValue)?.label || '';
                                            const schedule = config.daySchedules?.find(s => s.dayOfWeek === dayValue);

                                            return (
                                                <div key={dayValue} className="bg-slate-50 p-3 rounded-lg">
                                                    <div className="text-xs font-bold text-slate-700 mb-2">{dayLabel}</div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <label className="block text-[10px] text-slate-500 mb-1">Início</label>
                                                            <input
                                                                type="time"
                                                                value={schedule?.startTime || '13:00'}
                                                                onChange={(e) => {
                                                                    const newSchedules = config.daySchedules?.filter(s => s.dayOfWeek !== dayValue) || [];
                                                                    newSchedules.push({
                                                                        dayOfWeek: dayValue,
                                                                        startTime: e.target.value,
                                                                        endTime: schedule?.endTime || '14:00'
                                                                    });
                                                                    updateConfig({ daySchedules: newSchedules });
                                                                }}
                                                                className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] text-slate-500 mb-1">Término</label>
                                                            <input
                                                                type="time"
                                                                value={schedule?.endTime || '14:00'}
                                                                onChange={(e) => {
                                                                    const newSchedules = config.daySchedules?.filter(s => s.dayOfWeek !== dayValue) || [];
                                                                    newSchedules.push({
                                                                        dayOfWeek: dayValue,
                                                                        startTime: schedule?.startTime || '13:00',
                                                                        endTime: e.target.value
                                                                    });
                                                                    updateConfig({ daySchedules: newSchedules });
                                                                }}
                                                                className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {simulationResult && (
                            <div className="mt-6 bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-slate-600">Total de Aulas:</span>
                                    <span className="text-2xl font-bold text-blue-600">{simulationResult.totalClasses}</span>
                                </div>
                                <div className="text-xs text-slate-500">
                                    Término: {format(new Date(simulationResult.endDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                </div>
                                {config.studentName && (
                                    <div className="text-xs text-slate-600 mt-2 font-medium">
                                        Aluno: {config.studentName}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-slate-800">Datas Especiais & Feriados</h2>
                            <button
                                onClick={() => setIsTagModalOpen(true)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                            >
                                <Plus size={16} /> Gerenciar Tags
                            </button>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                            <h3 className="text-sm font-bold text-slate-700 mb-3">Adicionar Nova Data</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Data</label>
                                    <input
                                        type="date"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Descrição</label>
                                    <input
                                        type="text"
                                        value={newDesc}
                                        onChange={(e) => setNewDesc(e.target.value)}
                                        placeholder="Ex: Natal, Recesso..."
                                        className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm"
                                    />
                                </div>
                                <div>
                                    <button
                                        onClick={handleAddSpecialDate}
                                        disabled={!newDate || !newDesc}
                                        className="w-full bg-blue-600 text-white rounded px-3 py-1.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Adicionar
                                    </button>
                                </div>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <button
                                        key={tag.id}
                                        onClick={() => toggleTagSelection(tag.id)}
                                        className={`px-2 py-1 rounded-md text-xs font-medium border transition-all flex items-center gap-1 ${selectedTagIds.includes(tag.id)
                                                ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }}></span>
                                        {tag.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-slate-200">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 w-32">Data</th>
                                        <th className="px-4 py-3">Descrição</th>
                                        <th className="px-4 py-3">Tags</th>
                                        <th className="px-4 py-3 w-16 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {specialDates.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">
                                                Nenhuma data especial cadastrada.
                                            </td>
                                        </tr>
                                    ) : (
                                        specialDates.map(date => (
                                            <tr key={date.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-4 py-3 font-medium text-slate-700">
                                                    {format(new Date(date.date + 'T12:00:00'), 'dd/MM/yyyy')}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">{date.description}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {date.tagIds.map(tagId => {
                                                            const tag = tags.find(t => t.id === tagId);
                                                            if (!tag) return null;
                                                            return (
                                                                <span
                                                                    key={tag.id}
                                                                    className="px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1"
                                                                    style={{ backgroundColor: tag.color }}
                                                                >
                                                                    {tag.label}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => removeSpecialDate(date.id)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Remover"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {isTagModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-80 animate-scale-in">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Nova Tag</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Nome</label>
                                <input
                                    type="text"
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Cor</label>
                                <div className="flex gap-2 flex-wrap">
                                    {['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#64748b'].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setNewTagColor(color)}
                                            className={`w-6 h-6 rounded-full border-2 transition-transform ${newTagColor === color ? 'border-slate-800 scale-110' : 'border-transparent hover:scale-110'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => setIsTagModalOpen(false)}
                                    className="flex-1 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAddTag}
                                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                >
                                    Criar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimulationPage;
