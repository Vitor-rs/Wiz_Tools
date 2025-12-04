export interface DaySchedule {
  dayOfWeek: number; // 1=Monday, 2=Tuesday, etc.
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface Holiday {
  date: string;
  name: string;
  type?: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  type: "Normal" | "Falta" | "Reposição" | "Anteposição" | "Futuro";
  attended: boolean;
  late?: boolean;
  differentTime?: boolean;
  arrivalTime?: string;
  refDate?: string;
  refType?: string;
}
