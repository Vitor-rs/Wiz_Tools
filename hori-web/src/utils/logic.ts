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
