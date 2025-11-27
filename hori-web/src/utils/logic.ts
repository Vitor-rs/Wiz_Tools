import {
  addMonths,
  eachDayOfInterval,
  format,
  getDay,
  parseISO,
  isWithinInterval,
  differenceInMinutes,
} from "date-fns";

import type { Config, Holiday, CalendarEvent } from "../types";

// --- CONFIGURATION & CONSTANTS ---

export const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const FILL_COLORS: Record<string, string> = {
  Normal: "#22c55e",
  Reposição: "#fbbf24",
  Anteposição: "#c084fc",
  Falta: "#ef4444",
  Futuro: "#dcfce7",
  Atraso: "#f97316",
  HorarioDiferente: "#ec4899",
};

export interface KPI {
  kpiLiquid: number;
  kpiCompleted: number;
  kpiFaults: number;
  kpiRepos: number;
  kpiAntepos: number;
  kpiFuture: number;
  percentage: string;
}

// --- LOGIC ---

/**
 * Generates the full calendar data based on the student configuration.
 */
export function generateCalendarData(
  config: Config,
  holidays: Holiday[]
  // year: number // Removed unused parameter
): CalendarEvent[] {
  const contractStart = parseISO(config.startDate);
  const contractEnd = addMonths(contractStart, config.monthsDuration);

  const simulationStart = contractStart;
  const simulationEnd = contractEnd;

  const today = new Date();

  const data: CalendarEvent[] = [];
  const pendingFaults: { date: string; index: number }[] = [];
  const futureAbsencesMap = new Map<string, { paidDate: string }>();
  const eventsMap = new Map<string, CalendarEvent[]>();

  const studentDays = config.days;
  const [contractHour, contractMinute] = config.time.split(":").map(Number);

  const daysToSimulate = eachDayOfInterval({
    start: simulationStart,
    end: simulationEnd,
  });

  for (const day of daysToSimulate) {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayOfWeek = getDay(day);
    const isHoliday = holidays.some((h) => h.date === dateStr);

    if (!eventsMap.has(dateStr)) eventsMap.set(dateStr, []);
    const dailyEvents = eventsMap.get(dateStr)!;

    if (isHoliday) continue;

    // Skip July Recess (Hardcoded: 15-31 July)
    if (day.getMonth() === 6 && day.getDate() > 15 && day.getDate() < 31)
      continue;

    const isFuture = day > today;
    const isContractDay = studentDays.includes(dayOfWeek);

    // --- FUTURE LOGIC ---
    if (isFuture) {
      if (isContractDay) {
        if (futureAbsencesMap.has(dateStr)) {
          const info = futureAbsencesMap.get(dateStr)!;
          dailyEvents.push({
            id: `falta-${dateStr}`,
            date: dateStr,
            type: "Falta",
            attended: false,
            refDate: info.paidDate,
            refType: "Anteposição",
          });
        } else {
          dailyEvents.push({
            id: `futuro-${dateStr}`,
            date: dateStr,
            type: "Futuro",
            attended: false,
          });
        }
      }
      continue;
    }

    // --- PAST/PRESENT LOGIC ---
    let cameToDay = false;

    if (isContractDay) {
      if (futureAbsencesMap.has(dateStr)) {
        const info = futureAbsencesMap.get(dateStr)!;
        dailyEvents.push({
          id: `falta-${dateStr}`,
          date: dateStr,
          type: "Falta",
          attended: false,
          refDate: info.paidDate,
          refType: "Anteposição",
        });
        cameToDay = false;
      } else {
        const rand = Math.random();

        if (rand > 0.85) {
          dailyEvents.push({
            id: `falta-${dateStr}`,
            date: dateStr,
            type: "Falta",
            attended: false,
          });
          pendingFaults.push({ date: dateStr, index: dailyEvents.length - 1 });
          cameToDay = false;
        } else {
          let arrivalH = contractHour;
          let arrivalM = contractMinute;
          const rTime = Math.random();

          if (rTime > 0.9) {
            arrivalH += 2;
            arrivalM += 30;
          } else if (rTime > 0.8) {
            arrivalM += 50;
          } else if (rTime > 0.6) {
            arrivalM += 15;
          } else if (rTime < 0.1) {
            arrivalH -= 2;
          }

          const arrivalDate = new Date(day);
          arrivalDate.setHours(arrivalH, arrivalM);

          const contractDate = new Date(day);
          contractDate.setHours(contractHour, contractMinute);

          const diffMin = differenceInMinutes(arrivalDate, contractDate);

          const isLate = diffMin > 0 && diffMin <= 45;
          const isDiffTime = diffMin > 45 || diffMin < -15;
          const timeStr = format(arrivalDate, "HH:mm");

          dailyEvents.push({
            id: `normal-${dateStr}`,
            date: dateStr,
            type: "Normal",
            attended: true,
            late: isLate,
            differentTime: isDiffTime,
            arrivalTime: timeStr,
          });
          cameToDay = true;
        }
      }
    }

    // --- REPOSIÇÃO LOGIC ---
    const canRepo = !isContractDay || (isContractDay && cameToDay);

    if (pendingFaults.length > 0 && canRepo && dayOfWeek !== 0) {
      const chance = isContractDay ? 0.05 : 0.2;

      if (Math.random() < chance) {
        const debt = pendingFaults.shift()!;

        dailyEvents.push({
          id: `repo-${dateStr}`,
          date: dateStr,
          type: "Reposição",
          attended: true,
          refDate: debt.date,
          refType: "Falta",
          arrivalTime: "16:00",
        });

        const pastEvts = eventsMap.get(debt.date);
        if (pastEvts && pastEvts[debt.index]) {
          pastEvts[debt.index].refDate = dateStr;
          pastEvts[debt.index].refType = "Reposição";
        }
      }
    }

    // --- ANTEPOSIÇÃO LOGIC ---
    if (
      pendingFaults.length === 0 &&
      !isContractDay &&
      dayOfWeek !== 0 &&
      Math.random() > 0.95
    ) {
      const foundTargets: string[] = [];
      const targetDate = new Date(day);

      for (let k = 0; k < 60; k++) {
        targetDate.setDate(targetDate.getDate() + 1);
        if (targetDate > contractEnd) break;

        const tStr = format(targetDate, "yyyy-MM-dd");
        const tDay = getDay(targetDate);
        const tHol = holidays.some((h) => h.date === tStr);

        if (
          studentDays.includes(tDay) &&
          !tHol &&
          !futureAbsencesMap.has(tStr)
        ) {
          foundTargets.push(tStr);
          if (foundTargets.length === 2) break;
        }
      }

      foundTargets.forEach((tStr, idx) => {
        dailyEvents.push({
          id: `antepo-${dateStr}-${idx}`,
          date: dateStr,
          type: "Anteposição",
          attended: true,
          refDate: tStr,
          refType: "Falta",
          arrivalTime: `${9 + idx}:00`,
        });
        futureAbsencesMap.set(tStr, { paidDate: dateStr });
      });
    }
  }

  eventsMap.forEach((evts) => {
    data.push(...evts);
  });

  return data;
}

export function calculateKPIs(
  data: CalendarEvent[],
  config: Config,
  holidays: Holiday[]
): KPI {
  let kpiLiquid = 0,
    kpiCompleted = 0,
    kpiFaults = 0,
    kpiRepos = 0,
    kpiAntepos = 0,
    kpiFuture = 0;

  const contractStart = parseISO(config.startDate);
  const contractEnd = addMonths(contractStart, config.monthsDuration);

  const days = eachDayOfInterval({ start: contractStart, end: contractEnd });
  days.forEach((day) => {
    const dStr = format(day, "yyyy-MM-dd");
    const isHol = holidays.some((h) => h.date === dStr);
    if (config.days.includes(getDay(day)) && !isHol) {
      if (!(day.getMonth() === 6 && day.getDate() > 15 && day.getDate() < 31)) {
        kpiLiquid++;
      }
    }
  });

  data.forEach((d) => {
    const dt = parseISO(d.date);
    if (isWithinInterval(dt, { start: contractStart, end: contractEnd })) {
      if (d.attended && d.type !== "Futuro") kpiCompleted++;
      if (d.type === "Falta" && !d.attended) kpiFaults++;
      if (d.type === "Reposição") kpiRepos++;
      if (d.type === "Anteposição") kpiAntepos++;
      if (d.type === "Futuro") kpiFuture++;
    }
  });

  const totalPast = kpiCompleted + kpiFaults;
  const percentage =
    totalPast > 0 ? ((kpiCompleted / totalPast) * 100).toFixed(1) : "0";

  return {
    kpiLiquid,
    kpiCompleted,
    kpiFaults,
    kpiRepos,
    kpiAntepos,
    kpiFuture,
    percentage,
  };
}
