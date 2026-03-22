# 🗓️ Calendário Horizontal — Componente Isolado

Cópia auto-contida do componente de Calendário Horizontal do projeto `hori-web`.

## Estrutura de Arquivos

```
horizontal-calendar/
├── CalendarPage.tsx              ← Componente de página (state, refs, handlers)
├── components/
│   ├── CalendarGrid.tsx          ← Grid SVG principal (744 linhas)
│   ├── CalendarHeader.tsx        ← Navegação de ano + busca de datas
│   ├── MonthsSidebar.tsx         ← Sidebar fixa com meses em pt-BR
│   ├── Legend.tsx                ← Legenda de cores (use se necessário)
│   └── Tooltip.tsx               ← Tooltip de hover para feriados/eventos
├── layouts/
│   ├── Header.tsx                ← Header genérico reutilizável
│   └── PageContainer.tsx         ← Wrapper de página
├── types/
│   └── index.ts                  ← Interfaces: CalendarEvent, Holiday, DaySchedule
├── utils/
│   └── logic.ts                  ← Constantes: FILL_COLORS, WEEK_DAYS, KPI
├── config/
│   └── rules.ts                  ← Feriados 2025, recessos, regras
└── styles/
    └── calendar.css              ← Animação carnival-pulse para busca de datas
```

## Dependências NPM

```json
{
  "react": "^19.x",
  "date-fns": "^4.x",
  "lucide-react": "^0.555.x",
  "tailwindcss": "^4.x"
}
```

## Como Integrar

1. Copie esta pasta inteira para o `src/` do projeto destino
2. Importe a animação CSS no seu stylesheet global:
   ```css
   @import "./horizontal-calendar/styles/calendar.css";
   ```
3. Use o componente:
   ```tsx
   import CalendarPage from "./horizontal-calendar/CalendarPage";
   
   // Dentro do seu layout:
   <CalendarPage />
   ```

## Notas

- Os **imports internos são relativos** dentro desta pasta
- O `CalendarHeader` usa o layout `Header.tsx` — se seu projeto já tem um Header, 
  ajuste o import em `CalendarHeader.tsx` linha 4
- O `config/rules.ts` contém feriados hardcoded para 2025 — ajuste para o ano desejado
- A prop `data={[]}` no `CalendarPage.tsx` deve receber `CalendarEvent[]` com seus dados reais
