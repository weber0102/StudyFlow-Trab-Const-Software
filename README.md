# StudyFlow

Aplicação web para ajudar estudantes a organizar matérias, tarefas acadêmicas, prazos e o andamento de suas atividades.

## Problema resolvido

Quem cursa várias disciplinas precisa conciliar trabalhos, exercícios e leituras com datas diferentes. O StudyFlow centraliza essas atividades para facilitar a identificação de prioridades, prazos e pendências.

## Etapa atual

**Etapa 04 — Interatividade com JavaScript.** A interface responsiva desenvolvida nas etapas anteriores agora possui comportamentos reais no navegador: as tarefas podem ser cadastradas, pesquisadas, filtradas, ordenadas, concluídas, reabertas e excluídas com confirmação.

O projeto continua sendo uma aplicação estática em HTML, CSS e JavaScript puro. Os dados de demonstração são persistidos localmente no navegador com `localStorage`.

## Funcionalidades implementadas

- Painel inicial dinâmico com totais de tarefas pendentes, concluídas, próximo prazo, próximas tarefas e matérias ativas.
- Cadastro de tarefas com validação JavaScript de título, matéria, data de entrega, prioridade, status, limite da descrição e prevenção de duplicidade.
- Persistência local das tarefas na chave `studyflow-tasks` do `localStorage`.
- Pesquisa por título, matéria ou descrição na página de tarefas.
- Filtros dinâmicos por matéria, status e prioridade.
- Ordenação por prazo, prioridade ou título.
- Conclusão e reabertura de tarefas com atualização imediata da tabela e do painel.
- Exclusão de tarefas mediante confirmação em modal acessível.
- Cadastro e remoção de matérias, com reutilização delas no formulário de tarefas.
- Tema claro/escuro persistente e menu lateral responsivo/recolhível.
- Login demonstrativo local para personalizar a sessão neste navegador.

## Tecnologias

- HTML5 semântico
- CSS3 com variáveis, Flexbox, CSS Grid e media queries
- JavaScript puro (DOM, eventos, funções, arrays, `filter`, `sort`, `map`, `reduce`, `some` e `localStorage`)

## Páginas principais

| Página | Finalidade |
| --- | --- |
| `src/index.html` | Painel com resumo e próximas tarefas. |
| `src/tarefas.html` | Busca, filtros, ordenação, conclusão/reabertura e exclusão de tarefas. |
| `src/nova-tarefa.html` | Cadastro de uma tarefa com validação JavaScript. |
| `src/materias.html` | Cadastro e gerenciamento das matérias do semestre. |
| `src/login.html` | Acesso demonstrativo salvo apenas no navegador. |

## Como executar

Não há dependências do projeto nem etapa de compilação. É recomendado iniciar um servidor estático a partir da raiz do repositório:

```bash
npx serve src
```

O comando exibirá um endereço local, normalmente `http://localhost:3000`. Abra esse endereço no navegador e utilize o menu para navegar entre as páginas.

Também é possível acessar a versão publicada no GitHub Pages:

[https://weber0102.github.io/StudyFlow-Trab-Const-Software/](https://weber0102.github.io/StudyFlow-Trab-Const-Software/)

## Como testar a Etapa 04

1. Abra **Nova tarefa** e tente enviar o formulário vazio ou com um título curto; a mensagem de validação será exibida no próprio formulário.
2. Cadastre uma tarefa válida. Ela será salva no navegador e poderá ser vista em **Tarefas**.
3. Em **Tarefas**, digite uma palavra no campo de pesquisa, combine os filtros e altere a ordenação. A tabela e o contador devem mudar sem recarregar a página.
4. Pesquise um termo inexistente para conferir o estado “Nenhuma tarefa encontrada”.
5. Clique em **Concluir** ou **Reabrir** para atualizar o status. Confira o reflexo no painel inicial.
6. Clique em **Excluir**, confirme ou cancele no modal e observe o resultado na lista.
7. Em **Matérias**, adicione uma disciplina; ela ficará disponível ao criar uma nova tarefa.
8. Use o botão de tema e o menu lateral em desktop, tablet ou smartphone para verificar que a responsividade foi preservada.

O detalhamento dos requisitos, cenários inválidos e matriz de evidências está em [docs/etapa-04.md](docs/etapa-04.md).

## Estrutura do repositório

```text
├── docs/                    # documentação e evidências das etapas
├── src/
│   ├── assets/css/          # estilos base, componentes e responsividade
│   ├── assets/js/           # tema, navegação, matérias, autenticação e tarefas
│   ├── index.html           # painel inicial
│   ├── tarefas.html         # lista interativa de tarefas
│   ├── nova-tarefa.html     # formulário de cadastro
│   ├── materias.html        # gerenciamento de matérias
│   └── login.html           # acesso demonstrativo
├── tests/                   # reservado para testes futuros
└── README.md
```

## Limitações conhecidas

- A persistência usa `localStorage`: dados ficam somente no navegador e no dispositivo atuais, não são compartilhados entre alunos ou dispositivos e podem ser apagados ao limpar os dados do site.
- Não há API, banco de dados ou sincronização em nuvem.
- O login é demonstrativo e local; não deve ser usado com senha real nem substitui autenticação de produção.
- Caso o navegador bloqueie ou limpe o armazenamento local, as tarefas e preferências podem não permanecer disponíveis.

## Documentação

- [Proposta da Etapa 01](docs/proposta.md)
- [Documentação da Etapa 02](docs/etapa-02.md)
- [Documentação da Etapa 03](docs/etapa-03.md)
- [Documentação da Etapa 04](docs/etapa-04.md)
- [Arquitetura e decisões técnicas](docs/arquitetura.md)
- [Evidências de funcionamento](docs/evidencias.md)

## Autor

Weber Filho — Disciplina de Tecnologia e Construção de Software
