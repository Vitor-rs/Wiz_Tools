import { addDays, format, getDay, parseISO, isBefore } from "date-fns";
import { isNonClassDay } from "../config/rules";

export interface SimulationResult {
  totalClasses: number;
  endDate: string;
  validDates: string[]; // List of all valid class dates
  skippedDates: { date: string; reason: string }[];
}

export const calculateContractClasses = (
  startDateStr: string,
  daysOfWeek: number[] // 0=Sun, 1=Mon, ..., 6=Sat
): SimulationResult => {
  const startDate = parseISO(startDateStr);
  // Contract is exactly 1 year? Or until the syllabus is done?
  // User said: "Ele tem até dia 1 de março de 2026 para terminar o livro dele." (1 year fixed duration)
  // "Aí, o algoritmo vai ter que calcular quantas aulas ocorrem até lá."

  // Let's calculate for exactly 1 year from start date.
  const contractEndDate = new Date(startDate);
  contractEndDate.setFullYear(contractEndDate.getFullYear() + 1);

  let currentDate = startDate;
  const validDates: string[] = [];
  const skippedDates: { date: string; reason: string }[] = [];

  while (isBefore(currentDate, contractEndDate)) {
    const dateStr = format(currentDate, "yyyy-MM-dd");
    const dayOfWeek = getDay(currentDate);

    // Check if it's a class day (one of the selected days)
    if (daysOfWeek.includes(dayOfWeek)) {
      // Check if it's a holiday or recess
      const { isNonClass, reason } = isNonClassDay(dateStr);

      if (isNonClass) {
        skippedDates.push({
          date: dateStr,
          reason: reason || "Recess/Holiday",
        });
      } else {
        validDates.push(dateStr);
      }
    }

    currentDate = addDays(currentDate, 1);
  }

  return {
    totalClasses: validDates.length,
    endDate: format(contractEndDate, "yyyy-MM-dd"),
    validDates,
    skippedDates,
  };
};
