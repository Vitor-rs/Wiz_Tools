import { addDays, parseISO, addYears } from "date-fns";
import { isNonClassDay } from "../config/rules";
import type { SpecialDate } from "../types";

export interface SimulationResult {
  totalClasses: number;
  endDate: string;
  validDates: string[];
  skippedDates: { date: string; reason: string }[];
}

export const calculateContractClasses = (
  startDateStr: string,
  classDays: number[], // e.g., [2, 4] for Tue/Thu (1=Mon, 2=Tue, etc.)
  specialDates: SpecialDate[] = []
): SimulationResult => {
  const startDate = parseISO(startDateStr);
  // Contract is EXACTLY 1 year from start date
  const contractEndDate = addYears(startDate, 1);

  let currentDate = startDate;
  let totalClasses = 0;
  const validDates: string[] = [];
  const skippedDates: { date: string; reason: string }[] = [];

  // Iterate through each day until we reach the contract end date
  while (currentDate < contractEndDate) {
    const dayOfWeek = currentDate.getDay(); // 0=Sunday, 1=Monday, etc.
    const dateStr = currentDate.toISOString().split("T")[0];

    // Check if this day is a class day
    if (classDays.includes(dayOfWeek)) {
      // 1. Check User-Defined Special Dates first
      const specialDate = specialDates.find(sd => sd.date === dateStr);
      
      if (specialDate) {
         skippedDates.push({
          date: dateStr,
          reason: specialDate.description,
        });
      } else {
        // 2. Check System Rules (Holidays/Recess)
        const nonClassCheck = isNonClassDay(dateStr);
        if (nonClassCheck.isNonClass) {
          skippedDates.push({
            date: dateStr,
            reason: nonClassCheck.reason || "Feriado",
          });
        } else {
          validDates.push(dateStr);
          totalClasses++;
        }
      }
    }

    currentDate = addDays(currentDate, 1);
  }

  return {
    totalClasses,
    endDate: contractEndDate.toISOString().split("T")[0],
    validDates,
    skippedDates,
  };
};
