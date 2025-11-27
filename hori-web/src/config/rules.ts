import { addDays, format, isWeekend } from "date-fns";

export interface HolidayRule {
  date: string; // YYYY-MM-DD
  name: string;
  type: "National" | "Municipal" | "Recess";
}

export interface RecessRule {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
  name: string;
}

export const IMMUTABLE_RULES = {
  year: 2025,

  // Fixed Holidays for 2025 (National + Common)
  holidays: [
    {
      date: "2025-01-01",
      name: "Confraternização Universal",
      type: "National",
    },
    { date: "2025-03-03", name: "Carnaval (Segunda)", type: "National" }, // Mobile
    { date: "2025-03-04", name: "Carnaval (Terça)", type: "National" }, // Mobile
    { date: "2025-04-18", name: "Paixão de Cristo", type: "National" }, // Mobile
    { date: "2025-04-21", name: "Tiradentes", type: "National" },
    { date: "2025-05-01", name: "Dia do Trabalho", type: "National" },
    { date: "2025-06-19", name: "Corpus Christi", type: "National" }, // Mobile
    { date: "2025-09-07", name: "Independência do Brasil", type: "National" },
    { date: "2025-10-12", name: "Nossa Senhora Aparecida", type: "National" },
    { date: "2025-11-02", name: "Finados", type: "National" },
    { date: "2025-11-15", name: "Proclamação da República", type: "National" },
    { date: "2025-11-20", name: "Dia da Consciência Negra", type: "National" }, // Now National
    { date: "2025-12-25", name: "Natal", type: "National" },
  ] as HolidayRule[],

  // Special Recess Periods (Immutable Heuristics)
  recessPeriods: [
    {
      // Semana do Saco Cheio (Usually around Oct 12/15)
      // Assuming the full week of Oct 13th to 17th for 2025
      start: "2025-10-13",
      end: "2025-10-17",
      name: "Semana do Saco Cheio",
    },
    {
      // End of Year Recess (Dec/Jan)
      // "segunda semana, terceira semana de dezembro" -> "segunda, terceira semana de janeiro"
      // Let's approximate: Dec 22, 2025 to Jan 18, 2026
      start: "2025-12-22",
      end: "2026-01-18",
      name: "Recesso de Fim de Ano",
    },
  ] as RecessRule[],

  // Attendance Heuristics (for future validation logic)
  attendance: {
    lateThresholdMinutes: 10, // > 10 min = Late
    differentTimeThresholdMinutes: 50, // > 50 min (or close to next hour) = Different Time
  },
};

// Helper to check if a date is a "Non-Class Day" (Holiday or Recess)
export const isNonClassDay = (
  dateStr: string
): { isNonClass: boolean; reason?: string } => {
  // Check Holidays
  const holiday = IMMUTABLE_RULES.holidays.find((h) => h.date === dateStr);
  if (holiday) return { isNonClass: true, reason: holiday.name };

  // Check Recess
  const recess = IMMUTABLE_RULES.recessPeriods.find(
    (r) => dateStr >= r.start && dateStr <= r.end
  );
  if (recess) return { isNonClass: true, reason: recess.name };

  return { isNonClass: false };
};
