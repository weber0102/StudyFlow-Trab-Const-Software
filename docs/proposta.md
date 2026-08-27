# ETAPA 01 — PROPOSTA E ESPECIFICAÇÃO DO PROJETO

## 1. Nome da Aplicação
**StudyFlow** - Gerenciador de Fluxo de Estudo e Produtividade

---

## 2. Descrição do Problema
Estudantes e profissionais enfrentam dificuldades em organizar e gerenciar seu tempo de estudo, acompanhar o progresso em diferentes disciplinas/módulos, e manter uma rotina consistente de aprendizado. Muitas vezes, faltam ferramentas que integrem gestão de tarefas, cronograma de estudo, acompanhamento de progresso e motivação em um único lugar.

---

## 3. Público-Alvo
- Estudantes de todos os níveis (fundamental, médio, superior)
- Profissionais em programas de capacitação e formação contínua
- Educadores que desejam acompanhar o progresso de seus alunos
- Qualquer pessoa buscando organizar melhor seu processo de aprendizagem

---

## 4. Objetivo Principal
Fornecer uma plataforma integrada que permita aos usuários criar, organizar e acompanhar seus planos de estudo de forma intuitiva, visualizar progresso através de métricas e gráficos, gerenciar tarefas e prazos, e manter-se motivado através de sistemas de recompensas e metas.

---

## 5. Funcionalidades Principais

1. **Gerenciamento de Disciplinas/Módulos**
   - Criar, editar e deletar disciplinas ou tópicos de estudo
   - Organizar disciplinas em estruturas hierárquicas
   - Associar cores e ícones às disciplinas

2. **Planejamento de Sessões de Estudo**
   - Criar sessões de estudo com data, hora, duração e disciplina associada
   - Visualizar calendário de estudos (semanal e mensal)
   - Receber notificações de sessões próximas

3. **Gestão de Tarefas e Atividades**
   - Criar tarefas (lições, exercícios, leitura, projeto)
   - Definir prioridade, data de vencimento e disciplina
   - Marcar tarefas como concluídas
   - Subtarefas e checklist

4. **Acompanhamento de Progresso**
   - Dashboard com resumo do progresso
   - Gráficos de horas de estudo por disciplina
   - Taxa de conclusão de tarefas
   - Estatísticas de desempenho

5. **Sistema de Metas e Recompensas**
   - Definir metas semanais/mensais de horas de estudo
   - Badges e conquistas ao alcançar metas
   - Histórico de realizações

---

## 6. Entidades/Conceitos Principais do Domínio

1. **Usuário**
   - Identidade do aluno/estudante
   - Preferências pessoais
   - Histórico de atividades

2. **Disciplina/Módulo**
   - Tópico ou matéria de estudo
   - Organização hierárquica
   - Metadados (cor, ícone, descrição)

3. **Sessão de Estudo**
   - Período dedicado ao estudo
   - Data, hora, duração
   - Disciplina associada
   - Anotações e observações

4. **Tarefa/Atividade**
   - Trabalho a ser realizado
   - Tipo (lição, exercício, leitura, projeto)
   - Status (pendente, em progresso, concluída)
   - Prioridade e data de vencimento

5. **Meta**
   - Objetivo a alcançar
   - Período (semanal, mensal)
   - Progresso e cumprimento

---

## 7. Descrição das Telas/Interfaces

### Tela 1: Dashboard Principal
- Resumo gráfico do progresso geral
- Cards com estatísticas (horas estudadas hoje, tarefas pendentes, meta semanal)
- Visualização das próximas sessões de estudo
- Atalhos rápidos para criar disciplinas, tarefas e sessões
- Seção de conquistas recentes

### Tela 2: Calendário de Estudo
- Visualização de calendário (semanal e mensal)
- Sessões de estudo exibidas nos dias
- Cores diferenciadas por disciplina
- Clicar no dia para visualizar/criar sessões
- Indicadores de dias com estudo realizado

### Tela 3: Gerenciamento de Tarefas
- Lista de tarefas agrupadas por disciplina ou por data
- Filtros (por status, prioridade, disciplina)
- Checkbox para marcar como concluída
- Opções para editar, deletar e visualizar detalhes
- Indicador visual de tarefas atrasadas

### Tela 4: Acompanhamento de Progresso
- Gráficos de desempenho (horas por disciplina, taxa de conclusão)
- Tabela de estatísticas detalhadas
- Comparação de períodos (semana, mês, trimestre)
- Tendências de produtividade

### Tela 5: Detalhes de Disciplina
- Informações da disciplina (nome, descrição, cor)
- Tarefas associadas
- Sessões de estudo registradas
- Progresso específico da disciplina
- Opção para editar ou deletar

---

## 8. Operações Principais da Aplicação

1. **CRUD de Disciplinas**
   - Criar nova disciplina
   - Listar disciplinas do usuário
   - Atualizar informações da disciplina
   - Deletar disciplina (com cascata de tarefas/sessões associadas)

2. **CRUD de Tarefas**
   - Criar tarefa com detalhes (tipo, prioridade, prazo, disciplina)
   - Listar tarefas (com filtros e ordenação)
   - Atualizar status, prioridade ou informações
   - Deletar tarefa
   - Marcar como concluída

3. **CRUD de Sessões de Estudo**
   - Criar sessão com data, hora e duração
   - Visualizar sessões no calendário
   - Editar sessão (ajustar horário, duração, disciplina)
   - Deletar sessão
   - Registrar notas durante/após a sessão

4. **Acompanhamento de Metas**
   - Definir meta de horas semanais/mensais
   - Calcular progresso em relação à meta
   - Gerar notificações de meta alcançada

5. **Visualização de Relatórios e Gráficos**
   - Gerar gráfico de horas por disciplina
   - Gerar gráfico de taxa de conclusão
   - Exportar relatório em PDF (futuro)

---

## 9. Tecnologias do Cliente (Frontend)

- **Linguagem**: JavaScript/TypeScript
- **Framework**: React.js
- **Gerenciador de Estado**: Redux ou Context API
- **Estilização**: Tailwind CSS ou Material-UI
- **Gráficos**: Chart.js ou Recharts
- **Calendário**: React Calendar ou similar
- **Notificações**: React Toastify ou SweetAlert

---

## 10. Tecnologias do Servidor (Backend)

- **Linguagem**: Node.js com Express.js
- **Autenticação**: JWT (JSON Web Tokens)
- **Validação**: Express Validator ou Joi
- **Logging**: Winston ou Morgan
- **Testes**: Jest

---

## 11. Tecnologia de Persistência

- **Banco de Dados**: PostgreSQL
- **ORM**: Sequelize ou TypeORM
- **Cache**: Redis (opcional, para otimizações futuras)

---

## 12. Diagrama de Visão Geral da Solução

```
┌─────────────────────────────────────────────────────────────────┐
│                       STUDYFLOW APPLICATION                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐           ┌──────────────┐                   │
│  │   FRONTEND   │           │   BACKEND    │                   │
│  │  (React.js)  │───────────│ (Node.js +   │                   │
│  │              │   REST    │  Express)    │                   │
│  │ Components:  │    API    │              │                   │
│  │ • Dashboard  │           │ Routes:      │                   │
│  │ • Calendar   │           │ • Auth       │                   │
│  │ • Tasks      │           │ • Users      │                   │
│  │ • Progress   │           │ • Subjects   │                   │
│  │ • Metas      │           │ • Tasks      │                   │
│  │              │           │ • Sessions   │                   │
│  └──────────────┘           │ • Goals      │                   │
│                             └──────────────┘                   │
│                                    │                           │
│                                    │                           │
│                             ┌──────▼──────────┐               │
│                             │    DATABASE     │               │
│                             │  (PostgreSQL)   │               │
│                             │                 │               │
│                             │ Tables:         │               │
│                             │ • users         │               │
│                             │ • subjects      │               │
│                             │ • tasks         │               │
│                             │ • sessions      │               │
│                             │ • goals         │               │
│                             │ • achievements  │               │
│                             └─────────────────┘               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Fluxo de Dados:
1. Usuário interage com Frontend
2. Frontend envia requisições HTTP ao Backend
3. Backend processa lógica de negócio
4. Backend acessa/manipula dados no PostgreSQL
5. Backend retorna dados ao Frontend
6. Frontend renderiza interface atualizada
```

---

## Considerações Técnicas

- A aplicação será desenvolvida de forma incremental
- O foco inicial será em funcionalidades básicas (CRUD de disciplinas, tarefas e sessões)
- Autenticação e autorização serão implementadas desde o início
- Responsividade mobile será considerada no design
- A arquitetura seguirá padrões RESTful no backend
- Componentes React serão reutilizáveis e bem estruturados

---

## Cronograma Tentativo

- **ETAPA 01** (Atual): Proposta e Especificação
- **ETAPA 02**: Modelagem de Dados e Arquitetura
- **ETAPA 03**: Setup de Ambiente e Scaffolding
- **ETAPA 04**: Implementação de Features Básicas
- **ETAPA 05**: Implementação de Features Intermediárias
- **ETAPA 06**: Integração Frontend-Backend
- **ETAPA 07**: Testes e Qualidade
- **ETAPA 08**: Deploy e Finalização
