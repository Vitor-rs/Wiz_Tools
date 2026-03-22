# 📋 Ficha de Frequência — Componente Isolado

Cópia auto-contida do componente de Ficha de Frequência do projeto `hori-web`.

## Estrutura de Arquivos

```
ficha-frequencia/
├── FichaFrequencia.tsx           ← Componente completo (1204 linhas)
└── layouts/
    ├── Header.tsx                ← Header genérico reutilizável
    └── PageContainer.tsx         ← Wrapper de página
```

## O que está dentro do FichaFrequencia.tsx

Este componente é **auto-contido** — tudo está no mesmo arquivo:

- **Tipos:** `AttendanceRecord` (interface completa de registro de presença)
- **Constantes:** `TEACHER_CONFIG`, `EVALUATION_COLORS`
- **Helpers:** `calculateDuration`, `calculateMinutesBetween`, `getCurrentTime`, `getMonthName`, `getDayOfWeek`, `getFormattedDate`, `getFullDate`, `getWeekOfMonth`
- **Renderers:** Avaliações com badges coloridos, engagement score, teacher pills, tarefas, crosshair
- **Estado:** Mock data com 20 registros de presença, controles, scroll-to-top
- **Features:** Crosshair com 4 barras + borda de célula, painel de controles colapsável, highlight de linhas

## Dependências NPM

```json
{
  "react": "^19.x",
  "lucide-react": "^0.555.x",
  "tailwindcss": "^4.x"
}
```

> **Nota:** NÃO precisa de `date-fns` — toda a lógica de data é feita com `Date` nativo.

## Como Integrar

1. Copie esta pasta inteira para o `src/` do projeto destino
2. Use o componente:
   ```tsx
   import FichaFrequencia from "./ficha-frequencia/FichaFrequencia";
   
   <FichaFrequencia />
   ```
3. O componente precisa de **Tailwind CSS v4** com a diretiva `@import "tailwindcss";`

## Notas

- Os imports internos já estão ajustados para funcionar dentro desta pasta
- O `Header.tsx` e `PageContainer.tsx` são genéricos — se seu projeto já tem equivalentes, ajuste os imports nas linhas 3-4
- O mock data pode ser substituído por dados reais de uma API
