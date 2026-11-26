# StudyFlow

Aplicação web para ajudar estudantes a organizar matérias, tarefas acadêmicas, prazos e o andamento de suas atividades.

## Problema resolvido

Quem cursa várias disciplinas precisa conciliar trabalhos, exercícios e leituras com datas diferentes. O StudyFlow centraliza essas atividades para facilitar a identificação de prioridades, prazos e pendências.

## Etapa atual

**Etapa 07 — Persistência e CRUD com banco de dados.** A API Node.js + Express agora usa SQLite em arquivo, com matérias relacionadas a tarefas e check-ins, repositories SQL, integridade referencial e persistência comprovada entre reinicializações. A modularização, os temas e o layout responsivo foram mantidos.

O front-end continua em HTML, CSS e JavaScript puro. O Express serve a interface e a API na mesma origem. Matérias, tarefas e check-ins ficam em `backend/data/studyflow.sqlite`; conta demonstrativa e preferências continuam no navegador.

## Funcionalidades implementadas

- Painel inicial dinâmico com totais de tarefas pendentes, concluídas, próximo prazo, próximas tarefas e matérias ativas.
- Cadastro de tarefas com validação JavaScript de título, matéria, data de entrega, prioridade, status, limite da descrição e prevenção de duplicidade.
- CRUD REST de tarefas via `GET`, `POST`, `PATCH` e `DELETE`, com loading, sucesso, erro e nova tentativa.
- Modo estático legado com tarefas na chave `studyflow-tasks` do `localStorage`, preservado para o GitHub Pages.
- Pesquisa por título, matéria ou descrição na página de tarefas.
- Filtros dinâmicos por matéria, status e prioridade.
- Ordenação por prazo, prioridade ou título.
- Conclusão e reabertura de tarefas na página **Tarefas**, com atualização imediata da tabela e do painel.
- Abertura dos detalhes de uma próxima tarefa diretamente pelo painel, sem alterar seu status.
- Exclusão de tarefas mediante confirmação em modal acessível.
- Recomendações acadêmicas carregadas por Fetch da API própria, reutilizando o JSON da Etapa 05.
- Check-in de estudo com validação no navegador e servidor, POST próprio e histórico consultado por GET.
- Cadastro, renomeação e remoção de matérias persistidas, com reutilização nas tarefas e check-ins.
- Chaves estrangeiras e bloqueio da exclusão de matérias que possuem tarefas ou check-ins vinculados.
- Migração versionada, seed opcional idempotente e consultas SQL parametrizadas.
- Tema claro/escuro persistente e menu lateral responsivo/recolhível.
- Login demonstrativo local para personalizar a sessão neste navegador.

## Tecnologias

- HTML5 semântico
- CSS3 com variáveis, Flexbox, CSS Grid e media queries
- JavaScript puro com ES Modules, DOM, eventos, `fetch`, `async`/`await`, Promises, `localStorage`, `filter`, `sort`, `map`, `reduce` e `some`
- Node.js 24+, SQLite com `node:sqlite`, Express 5.3.0, testes HTTP/multiprocesso e coleção Postman

## Páginas principais

| Página | Finalidade |
| --- | --- |
| `src/index.html` | Painel com resumo, próximas tarefas, recomendações carregadas por `fetch()` e check-in assíncrono. |
| `src/tarefas.html` | Busca, filtros, ordenação, conclusão/reabertura e exclusão de tarefas. |
| `src/nova-tarefa.html` | Cadastro de uma tarefa com validação JavaScript. |
| `src/materias.html` | Cadastro e gerenciamento das matérias do semestre. |
| `src/login.html` | Acesso demonstrativo salvo apenas no navegador. |

## Como executar

Pré-requisitos: Node.js 24 ou superior e npm. Não é necessário instalar um serviço SQLite separado. A partir da raiz do repositório:

```bash
cd backend
npm ci
npm run db:init
npm run db:seed
npm run db:check
npm start
```

Abra [http://127.0.0.1:3000/](http://127.0.0.1:3000/). Um único processo serve a API e o front-end. Não há etapa de compilação nem necessidade de outro servidor estático. Para desenvolvimento, `npm run dev` acompanha mudanças; para testes, `npm test`.

`db:seed` é opcional: adiciona três matérias e seis tarefas de demonstração uma única vez. Sem seed, cadastre a primeira matéria na interface. `npm start` aplica migrações pendentes, mantém os dados existentes e não repõe registros excluídos. Para alterar a configuração, copie `backend/.env.example` para `backend/.env`. O arquivo do banco e `.env` ficam fora do Git.

O GitHub Pages continua oferecendo a demonstração estática das etapas anteriores:

[https://weber0102.github.io/StudyFlow-Trab-Const-Software/](https://weber0102.github.io/StudyFlow-Trab-Const-Software/)

O workflow de Pages publica apenas `src/`, sem executar Node. Para demonstrar a API desta etapa, use o endereço do Express acima. A publicação de uma API remota exige hospedagem própria de Node e configuração de URL/CORS. O modo estático continua usando o JSON, o serviço simulado e o armazenamento local anteriores, com indicação na interface.

## Como testar a Etapa 07

1. Execute o servidor e confira “Tarefas carregadas do servidor” no painel.
2. Em Nova tarefa, teste um formulário inválido e depois cadastre uma tarefa válida (POST 201).
3. Em Tarefas, pesquise o título, conclua/reabra (PATCH 200) e exclua com confirmação (DELETE 204).
4. Abra os detalhes de uma próxima tarefa no painel (GET individual).
5. Envie um check-in e recarregue a página; o histórico será consultado na API.
6. Abra DevTools → Network para observar os métodos HTTP e o JSON.
7. Em Matérias, cadastre/renomeie uma disciplina e tente remover uma matéria com tarefas; a API retorna 409 para proteger o vínculo.
8. Dentro de `backend`, execute `npm test`: são 16 testes, incluindo três processos reais usando o mesmo arquivo SQLite para comprovar a persistência.
9. Importe [a coleção Postman da Etapa 07](docs/postman/etapa-07.postman_collection.json): 33 requisições e 70 asserções. `baseUrl` tem padrão `http://127.0.0.1:3000`.
10. Execute `npm run evidence` para gerar a transcrição do CRUD, reinícios e falha de persistência em banco de teste isolado.

Endpoints principais: `GET /api/tarefas`, `GET /api/tarefas/:id`, `POST /api/tarefas`, `PATCH /api/tarefas/:id`, `DELETE /api/tarefas/:id`.

O CRUD de matérias usa os mesmos métodos em `/api/materias` e `/api/materias/:id`. Consulte [docs/etapa-07.md](docs/etapa-07.md) para instruções completas e [o modelo do banco](docs/banco/modelo.md) para atributos, tipos, PK/FK e restrições. A documentação histórica dos contratos da API continua em [docs/etapa-06.md](docs/etapa-06.md).

## Funcionalidades das etapas anteriores

1. Abra **Nova tarefa** e tente enviar o formulário vazio ou com um título curto; a mensagem de validação será exibida no próprio formulário.
2. Cadastre uma tarefa válida. Ela será salva conforme o modo ativo (API ou demonstração local) e poderá ser vista em **Tarefas**.
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
├── backend/                 # API Express, repositories, conexão/migração SQLite e testes
├── src/
│   ├── assets/css/          # estilos base, componentes e responsividade
│   ├── assets/js/           # ES Modules: core, tarefas, serviços, painel, tema e autenticação
│   ├── assets/data/         # dados JSON usados pela consulta assíncrona
│   ├── index.html           # painel inicial
│   ├── tarefas.html         # lista interativa de tarefas
│   ├── nova-tarefa.html     # formulário de cadastro
│   ├── materias.html        # gerenciamento de matérias
│   └── login.html           # acesso demonstrativo
├── tests/                   # orientação de testes; testes HTTP em backend/test
└── README.md
```

## Limitações conhecidas

- O arquivo SQLite precisa ser preservado em disco. Excluir o arquivo ou usar uma hospedagem com disco temporário elimina a persistência; para backup simples, pare o servidor e copie o arquivo.
- Os dados da API são compartilhados entre clientes da mesma instância; não há separação de tarefas por aluno.
- Conta demonstrativa e preferências usam `localStorage`. Dados locais antigos de tarefas/matérias não são migrados nem apagados automaticamente ao ativar a API.
- Na versão estática, tarefas e histórico também ficam locais; JSONPlaceholder continua sendo apenas o serviço simulado da Etapa 05.
- O login é demonstrativo e local; não deve ser usado com senha real nem substitui autenticação de produção.
- Caso o navegador bloqueie ou limpe o armazenamento local, as tarefas e preferências podem não permanecer disponíveis.

## Documentação

- [Proposta da Etapa 01](docs/proposta.md)
- [Documentação da Etapa 02](docs/etapa-02.md)
- [Documentação da Etapa 03](docs/etapa-03.md)
- [Documentação da Etapa 04](docs/etapa-04.md)
- [Documentação da Etapa 05](docs/etapa-05.md)
- [Documentação da Etapa 06](docs/etapa-06.md)
- [Documentação da Etapa 07](docs/etapa-07.md)
- [Modelo do banco](docs/banco/modelo.md)
- [Coleção Postman da Etapa 07](docs/postman/etapa-07.postman_collection.json)
- [Coleção Postman da Etapa 06](docs/postman/etapa-06.postman_collection.json)
- [Arquitetura e decisões técnicas](docs/arquitetura.md)
- [Evidências de funcionamento](docs/evidencias.md)

## Autor

Weber Filho — Disciplina de Tecnologia e Construção de Software
