# Hori Calendar - Sistema de Gestão Pedagógica

Hori Calendar é um sistema completo de apoio à gestão pedagógica (com forte inspiração no contexto Wizard by Pearson). O monorepo combina um front-end web, um laboratório visual em ReactFlow e uma versão desktop em Electron para oferecer simulação de contratos, visualização do calendário acadêmico anual e controle de frequência (Check-in).

## Visão Geral do Monorepo

| Pasta | Módulo | Descrição rápida |
| --- | --- | --- |
| `hori-web/` | Gestão Pedagógica (Vite + React 19) | Simulador de contratos, calendário letivo anual e painel de check-in com `SimulationContext` centralizado |
| `hori-flow/` | ReactFlow Lab | Espaço isolado para prototipar fluxos, diagramas e futuras automações visuais |
| `hori-electron/` | Desktop (Electron Forge + Tailwind) | Evolução para app offline com SQLite embutido (WIP) |
| `contexto_negocio/` | Documentação | Materiais funcionais: requisitos, desenhos de tela e guias de sistema |

## Funcionalidades Principais

### Simulador de Frequência Anual

- Visualização anual em grid, mostrando aulas, feriados, recessos e datas personalizadas.
- Configuração detalhada de contrato: aluno, início, dias de aula, horários por dia e duração.
- Regras imutáveis (`config/rules.ts`) aplicam automaticamente feriados oficiais e recessos escolares.
- CRUD de datas especiais com tags coloridas para destacar eventos locais ou ajustes de calendário.

### Sistema de Check-in

- Fluxo para recepção acompanhar chegadas, atrasos e faltas em tempo real.
- Painel para professores com estados "A vir", "Entrada", "Em aula" e "Faltou".
- Ações rápidas para alterar status do aluno e gerar dados mockados para testes internos.

### Laboratório ReactFlow (`hori-flow`)

- Ambiente isolado baseado em Vite para explorar fluxos operacionais futuros (por exemplo, cadência de atendimento, integrações, etc.).
- Compartilha stack React 19 + TypeScript e facilita experimentos sem impactar a aplicação principal.

### Versão Desktop (`hori-electron`)

- Configurada com Electron Forge + Webpack para portar o simulador para desktop.
- Inclui Tailwind, React 19 e `better-sqlite3` para persistência local.
- Scripts de package/make/publish já preparados; desenvolvimento ativo.

## Tecnologias

- React 19 + Vite 7 + TypeScript 5 (web e flow).
- Tailwind CSS v4 (via `@tailwindcss/vite` no front e Tailwind + PostCSS no Electron).
- date-fns + Lucide Icons.
- Electron Forge 7 + SQLite embarcado para o cliente desktop.

## Pré-requisitos

- Node.js 20 LTS ou superior (Vite 7 e Electron 39 requerem recursos modernos).
- npm 10+ (necessário para workspaces).
- VS Code recomendado (tasks pré-configuradas facilitam o dia a dia).

## Instalação e Setup

1. Clone o repositório e acesse a pasta `Hori_Calendar`.
2. Instale todas as dependências de uma vez:

   ```bash
   npm install
   ```

3. (Opcional) Use `Tasks: Run Task` no VS Code para executar `Install All Dependencies` caso prefira a automação integrada.

## Execução Rápida

| Contexto | Comando | Descrição |
| --- | --- | --- |
| Web | `npm run dev:web` | Inicia `hori-web` em modo desenvolvimento (Vite) |
| ReactFlow Lab | `npm run dev:flow` | Abre o playground `hori-flow` |
| Electron | `npm run start --workspace=hori-electron` | Sobe o app desktop via Electron Forge |
| Build geral | `npm run build:all` | Executa `vite build` + `tsc -b` para os workspaces suportados |
| Lint web | `npm run lint --workspace=hori-web` | Roda ESLint em todo o front principal |
| Lint flow | `npm run lint --workspace=hori-flow` | Lint do laboratório ReactFlow |
| Lint desktop | `npm run lint --workspace=hori-electron` | ESLint para o projeto Electron |

> 💡 Tasks VS Code: `Run: Hori Web` e `Run: Hori Flow (ReactFlow)` já encapsulam os comandos acima em processos em background.

## Estrutura de Código (hori-web)

- `src/components/`: componentes reusáveis (CalendarGrid, Sidebar, Modal, Legend, Tooltip, etc.).
- `src/pages/`: telas `SimulationPage` e `CheckInPage` que orquestram os componentes.
- `src/context/SimulationContext.tsx`: guarda configurações de contrato, datas especiais e helpers como `generateMockedClasses`.
- `src/utils/logic.ts` e `src/utils/simulation.ts`: funções puras para geração de calendário, cálculo de aulas e manipulação de datas.
- `src/config/rules.ts`: feriados e regras fixas aplicadas automaticamente ao calendário.
- `src/types/`: contratos TypeScript compartilhados (tags, datas, configuração de aula).

### Outras pastas relevantes

- `hori-flow/src/`: setup leve do ReactFlow para testar nodes, edges e interações.
- `hori-electron/src/`: entrypoints (`main`, `preload`, `renderer`) com Tailwind e integração SQLite.
- `contexto_negocio/`: documentação funcional e mockups (por exemplo `documentação/Wizard-Gestao-Sistema.md`).

## Contexto de Negócio

O sistema endereça três pilares principais nas escolas de idiomas:

- **Previsibilidade:** Datas finais de contrato sempre refletem feriados nacionais, locais e recessos escolares.
- **Transparência:** Calendário anual deixa claro dias letivos, pausas e eventos especiais.
- **Operacional:** Recepção e professores registram presença em tempo real, agilizando o atendimento diário.

Os artefatos em `contexto_negocio/documentação/` expandem os requisitos funcionais e o design de telas usados durante a migração para web.

## Próximos Passos Sugeridos

1. Consolidar o fluxo de publicação do Electron (`npm run make --workspace=hori-electron`) para gerar instaladores.
2. Adicionar testes de lógica (por exemplo, unitários para `simulation.ts`).
3. Automatizar deploy do `hori-web` (Vercel, Netlify ou container) e versionar as regras de calendário por franquia.

---
**Autor:** Vitor-rs · Branch principal atual: `feature/web-migration`
