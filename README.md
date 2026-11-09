# StudyFlow

Aplicação web para ajudar estudantes a organizar matérias, tarefas acadêmicas, prazos e o andamento de suas atividades.

## Problema resolvido

Quem cursa várias disciplinas precisa conciliar trabalhos, exercícios e leituras com datas diferentes. O StudyFlow centraliza essas atividades para facilitar a identificação de prioridades, prazos e pendências.

## Etapa atual

**Etapa 05 — Modularização e comunicação assíncrona.** A interface agora utiliza ES Modules, separa dados, validação, interface, modais e eventos, além de consultar recomendações acadêmicas e enviar check-ins de estudo de forma assíncrona.

O projeto continua sendo uma aplicação estática em HTML, CSS e JavaScript puro. Os dados de demonstração são persistidos localmente no navegador com `localStorage`.

## Funcionalidades implementadas

- Painel inicial dinâmico com totais de tarefas pendentes, concluídas, próximo prazo, próximas tarefas e matérias ativas.
- Cadastro de tarefas com validação JavaScript de título, matéria, data de entrega, prioridade, status, limite da descrição e prevenção de duplicidade.
- Persistência local das tarefas na chave `studyflow-tasks` do `localStorage`.
- Pesquisa por título, matéria ou descrição na página de tarefas.
- Filtros dinâmicos por matéria, status e prioridade.
- Ordenação por prazo, prioridade ou título.
- Conclusão e reabertura de tarefas na página **Tarefas**, com atualização imediata da tabela e do painel.
- Abertura dos detalhes de uma próxima tarefa diretamente pelo painel, sem alterar seu status.
- Exclusão de tarefas mediante confirmação em modal acessível.
- Recomendações acadêmicas carregadas assincronamente por `fetch()` a partir de JSON externo ao JavaScript.
- Check-in de estudo com validação, loading, `POST` ao serviço REST simulado, sucesso, erro e histórico local.
- Cadastro e remoção de matérias, com reutilização delas no formulário de tarefas.
- Tema claro/escuro persistente e menu lateral responsivo/recolhível.
- Login demonstrativo local para personalizar a sessão neste navegador.

## Tecnologias

- HTML5 semântico
- CSS3 com variáveis, Flexbox, CSS Grid e media queries
- JavaScript puro com ES Modules, DOM, eventos, `fetch`, `async`/`await`, Promises, `localStorage`, `filter`, `sort`, `map`, `reduce` e `some`

## Páginas principais

| Página | Finalidade |
| --- | --- |
| `src/index.html` | Painel com resumo, próximas tarefas, recomendações carregadas por `fetch()` e check-in assíncrono. |
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

## Como testar a Etapa 05

1. Abra **Nova tarefa** e tente enviar o formulário vazio ou com um título curto; a mensagem de validação será exibida no próprio formulário.
2. Cadastre uma tarefa válida. Ela será salva no navegador e poderá ser vista em **Tarefas**.
3. Em **Tarefas**, digite uma palavra no campo de pesquisa, combine os filtros e altere a ordenação. A tabela e o contador devem mudar sem recarregar a página.
4. Pesquise um termo inexistente para conferir o estado “Nenhuma tarefa encontrada”.
5. No painel inicial, observe **Carregando recomendações acadêmicas…**, aguarde os cards e clique em **Atualizar**.
6. Preencha o check-in com matéria e minutos; observe **Enviando check-in…**, a mensagem de sucesso e o histórico atualizado.
7. Para demonstrar os erros, abra `index.html?consulta=erro` ou `index.html?envio=erro`.
8. Em **Tarefas**, clique em **Concluir** ou **Reabrir** para atualizar o status. Confira o reflexo no painel inicial.
9. No painel inicial, clique no botão ↗ de uma próxima tarefa; confira os detalhes e que o status não foi alterado.
10. Clique em **Excluir**, confirme ou cancele no modal e observe o resultado na lista.
11. Em **Matérias**, adicione uma disciplina; ela ficará disponível ao criar uma nova tarefa.
12. Use o botão de tema e o menu lateral em desktop, tablet ou smartphone para verificar que a responsividade foi preservada.

O detalhamento dos requisitos, cenários inválidos, matriz e evidências está em [docs/etapa-05.md](docs/etapa-05.md).

## Estrutura do repositório

```text
├── docs/                    # documentação e evidências das etapas
├── src/
│   ├── assets/css/          # estilos base, componentes e responsividade
│   ├── assets/js/           # ES Modules: core, tarefas, serviços, painel, tema e autenticação
│   ├── assets/data/         # dados JSON usados pela consulta assíncrona
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
- Tarefas, matérias e histórico de check-ins continuam locais ao navegador; o POST usa JSONPlaceholder apenas como serviço REST simulado, sem persistência real em nuvem.
- O login é demonstrativo e local; não deve ser usado com senha real nem substitui autenticação de produção.
- Caso o navegador bloqueie ou limpe o armazenamento local, as tarefas e preferências podem não permanecer disponíveis.

## Documentação

- [Proposta da Etapa 01](docs/proposta.md)
- [Documentação da Etapa 02](docs/etapa-02.md)
- [Documentação da Etapa 03](docs/etapa-03.md)
- [Documentação da Etapa 04](docs/etapa-04.md)
- [Documentação da Etapa 05](docs/etapa-05.md)
- [Arquitetura e decisões técnicas](docs/arquitetura.md)
- [Evidências de funcionamento](docs/evidencias.md)

## Autor

Weber Filho — Disciplina de Tecnologia e Construção de Software
