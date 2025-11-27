export interface Config {
  startDate: string;
  contractDuration: number;
  monthsDuration: number;
  days: number[];
  time: string;
}

export interface Holiday {
  date: string;
  name: string;
  type?: "National" | "Municipal" | "Recess"; // Added type
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

export interface Tag {
  id: string;
  label: string;
  color: string;
}

export interface SpecialDate {
  id: string;
  date: string;
  description: string;
  tagIds: string[];
}
