# Hori Calendar - Sistema de Gestão Pedagógica

Este projeto é uma aplicação web moderna desenvolvida para auxiliar na gestão pedagógica e administrativa de unidades de ensino (com foco no contexto Wizard by Pearson), oferecendo ferramentas avançadas para simulação de contratos, visualização de calendário acadêmico e controle de frequência (Check-in).

## 🚀 Funcionalidades Principais

### 📅 Simulador de Frequência Anual

- **Visualização de Calendário:** Interface visual intuitiva (Grid Anual) mostrando todos os dias letivos, feriados e recessos.
- **Simulação de Contratos:** Configure a data de início, dias de aula (ex: Terça e Quinta) e duração do contrato para projetar o cronograma completo do aluno.
- **Regras de Negócio Automáticas:** Aplicação de feriados nacionais, municipais e recessos escolares definidos nas configurações do sistema.
- **Datas Especiais Editáveis:** Permite adicionar, editar e remover datas específicas (ex: emendas de feriado, eventos locais) que afetam o calendário letivo, recalculando automaticamente as aulas.
- **Gerenciamento de Tags:** Sistema de etiquetas coloridas personalizáveis para categorizar datas especiais.

### ✅ Sistema de Check-in

- **Controle de Fluxo:** Interface dedicada para a recepção registrar a chegada dos alunos.
- **Visão do Professor:** Painel para professores visualizarem em tempo real quais alunos estão presentes, faltantes ou em aula.
- **Status Dinâmicos:** Monitoramento de status como "A vir", "Entrada", "Em aula", "Faltou".

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Manipulação de Datas:** [date-fns](https://date-fns.org/)
- **Gerenciamento de Estado:** React Context API (`SimulationContext`)

## 📂 Estrutura do Projeto

O repositório funciona como um monorepo contendo:

- **`hori-web/`**: Aplicação principal (Gestão Pedagógica).
- **`hori-flow/`**: Laboratório de testes para diagramas com ReactFlow.
- **`hori-electron/`**: (Em desenvolvimento) Versão desktop.

### Detalhes do `hori-web`
O código-fonte principal encontra-se na pasta `hori-web`:

- **`src/components`**: Componentes de UI reutilizáveis (CalendarGrid, Sidebar, Modal, Header, etc.).
- **`src/pages`**: Páginas principais da aplicação (`SimulationPage`, `CheckInPage`).
- **`src/context`**: Gerenciamento de estado global (`SimulationContext`).
- **`src/config`**: Regras de negócio imutáveis, como lista de feriados e regras de recesso (`rules.ts`).
- **`src/utils`**: Lógica pura para cálculo de datas, geração de calendário e simulação de contratos (`simulation.ts`, `logic.ts`).
- **`src/types`**: Definições de interfaces TypeScript compartilhadas.

## 🔧 Como Executar (Automação)

Este projeto está configurado como um **Monorepo**. Você pode gerenciar tudo da raiz.

### 1. Instalação Geral
Para instalar as dependências de **todos** os projetos (`hori-web`, `hori-flow`, etc.) de uma vez:

```bash
npm install
```

### 2. Executando os Projetos
Você pode usar as **Tasks do VS Code** (recomendado) ou o terminal.

**Via VS Code:**
1. Pressione `Ctrl + Shift + P` (ou `Cmd + Shift + P`).
2. Digite `Tasks: Run Task`.
3. Escolha uma das opções:
   - **Run: Hori Web**: Inicia o sistema principal.
   - **Run: Hori Flow (ReactFlow)**: Inicia o laboratório de testes do ReactFlow.

**Via Terminal (Raiz):**
```bash
# Rodar o projeto principal
npm run dev:web

# Rodar o laboratório ReactFlow
npm run dev:flow
```

## 📋 Contexto de Negócio

O sistema visa resolver dores comuns na gestão de escolas de idiomas:

- **Previsibilidade:** Garantir que o aluno e a escola saibam exatamente quando o contrato termina, considerando todos os feriados e emendas.
- **Transparência:** Visualização clara dos dias letivos e não letivos.
- **Operacional:** Agilizar o processo de check-in e controle de presença diário.

---
**Desenvolvido por:** Vitor-rs
**Branch Atual:** feature/web-migration
