# StudyFlow - Gerenciador de Fluxo de Estudo e Produtividade

## Visão Geral

**StudyFlow** é uma aplicação web desenvolvida como trabalho da disciplina de Tecnologia e Construção de Software. O projeto visa fornecer uma plataforma integrada e intuitiva para estudantes e profissionais gerenciarem seu tempo de estudo, acompanharem seu progresso e manterem-se motivados através de metas e conquistas.

## Problema Resolvido

Estudantes e profissionais enfrentam dificuldades em:
- Organizar e gerenciar seu tempo de estudo
- Acompanhar o progresso em diferentes disciplinas/módulos
- Manter uma rotina consistente de aprendizado
- Visualizar e analisar seu desempenho

O StudyFlow integra gestão de tarefas, cronograma de estudo, acompanhamento de progresso e sistema de motivação em um único lugar.

## Funcionalidades Principais

✅ **Gerenciamento de Disciplinas** - Criar e organizar disciplinas/tópicos de estudo  
✅ **Planejamento de Sessões** - Agendar e acompanhar sessões de estudo no calendário  
✅ **Gestão de Tarefas** - Criar, organizar e marcar tarefas como concluídas  
✅ **Acompanhamento de Progresso** - Visualizar gráficos e estatísticas de desempenho  
✅ **Sistema de Metas** - Definir metas de estudo e acompanhar conquistas  

## Tecnologias

### Frontend
- **Linguagem**: JavaScript/TypeScript
- **Framework**: React.js
- **Estilização**: Tailwind CSS ou Material-UI
- **Gráficos**: Chart.js ou Recharts
- **Calendário**: React Calendar
- **Notificações**: React Toastify

### Backend
- **Linguagem**: Node.js
- **Framework**: Express.js
- **Autenticação**: JWT (JSON Web Tokens)
- **Testes**: Jest

### Banco de Dados
- **Banco**: PostgreSQL
- **ORM**: Sequelize ou TypeORM
- **Cache**: Redis (futuro)

## Arquitetura

```
FRONTEND (React.js)          BACKEND (Node.js + Express)      DATABASE (PostgreSQL)
├─ Dashboard               ├─ API REST                       ├─ users
├─ Calendar               ├─ Authentication                  ├─ subjects
├─ Tasks Manager          ├─ Business Logic                  ├─ tasks
├─ Progress Tracking      └─ Database Integration            ├─ sessions
└─ Goals & Achievements                                      ├─ goals
                                                              └─ achievements
```

## Entidades Principais

1. **Usuário** - Identidade do aluno/estudante
2. **Disciplina/Módulo** - Tópico ou matéria de estudo
3. **Sessão de Estudo** - Período dedicado ao estudo
4. **Tarefa/Atividade** - Trabalho a ser realizado
5. **Meta** - Objetivo a alcançar
6. **Conquista** - Badges e recompensas

## Telas Principais

1. **Dashboard** - Resumo gráfico do progresso geral
2. **Calendário** - Visualização de sessões de estudo agendadas
3. **Gerenciamento de Tarefas** - Lista de tarefas com filtros
4. **Acompanhamento de Progresso** - Gráficos e estatísticas
5. **Detalhes de Disciplina** - Informações específicas por disciplina

## Operações Principais

- CRUD de Disciplinas
- CRUD de Tarefas
- CRUD de Sessões de Estudo
- Acompanhamento de Metas
- Visualização de Relatórios e Gráficos

## Estrutura do Repositório

```
StudyFlow-Trab-Const-Software/
├── docs/
│   └── proposta.md          # Especificação detalhada da ETAPA 01
├── README.md                # Este arquivo
└── [Estrutura de código será adicionada nas próximas etapas]
```

## Desenvolvimento

Este é um projeto em desenvolvimento incremental. A implementação seguirá as seguintes etapas:

- **ETAPA 01** ✅ - Proposta e Especificação (ATUAL)
- **ETAPA 02** - Modelagem de Dados e Arquitetura
- **ETAPA 03** - Setup de Ambiente e Scaffolding
- **ETAPA 04** - Implementação de Features Básicas
- **ETAPA 05** - Implementação de Features Intermediárias
- **ETAPA 06** - Integração Frontend-Backend
- **ETAPA 07** - Testes e Qualidade
- **ETAPA 08** - Deploy e Finalização

## Autor

**Weber Filho** - Disciplina de Tecnologia e Construção de Software

## Licença

Este projeto é desenvolvido como trabalho acadêmico.

---

**Última Atualização**: ETAPA 01 - Proposta e Especificação do Projeto
