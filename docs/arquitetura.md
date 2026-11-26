# Arquitetura e organização do código

## Decisão da Etapa 02

O StudyFlow foi iniciado como um protótipo estático em HTML5 e CSS3. A decisão mantém o escopo da etapa concentrado na definição de uma estrutura semântica e na representação das telas do domínio, sem antecipar API, banco de dados, autenticação ou persistência.

## Estrutura de diretórios

```text
StudyFlow-Trab-Const-Software/
├── docs/                    # documentação do projeto e das entregas
├── src/                     # código da interface
│   ├── assets/css/           # estilos compartilhados
│   ├── index.html            # painel inicial
│   ├── tarefas.html          # listagem de tarefas
│   └── nova-tarefa.html      # formulário de cadastro
├── tests/                    # reservado para testes futuros
└── README.md                 # visão geral e instruções de uso
```

## Estrutura HTML

Todas as páginas usam a mesma base: `header` para marca e navegação, `nav` para os links principais, `main` para o conteúdo exclusivo da página e `footer` para informações institucionais. As áreas internas são agrupadas com `section`, os cartões de resumo usam `article` e os conteúdos complementares usam `aside`.

Na tela de cadastro, o elemento `form` reúne todos os campos. Cada controle possui `label` vinculado pelo atributo `for`, com identificadores únicos nos campos correspondentes. Isso melhora a semântica e a acessibilidade da interface.

## Evolução implementada — Etapa 05

A estrutura foi evoluída para módulos nativos do JavaScript, carregados por `main.js` com `type="module"`. O domínio de tarefas foi separado entre armazenamento, validação, renderização, modais e controlador; tema, menu, autenticação e matérias também passaram a expor inicializadores próprios.

O painel inicial agora consulta um JSON acadêmico por `fetch()` e envia check-ins por `POST` a um serviço REST simulado. A camada `api-client.js` concentra a comunicação HTTP, incluindo `response.ok`, JSON e erros de rede, enquanto `study-service.js` concentra os endpoints. Essa organização preserva o protótipo de tarefas local e permite a evolução incremental para uma API real nas próximas etapas.

Para a documentação detalhada da modularização, consulte [etapa-05.md](etapa-05.md).

## Evolução implementada — Etapa 06

O backend em `backend/` usa Express e ES Modules. `server.js` abre a porta; `app.js` configura JSON, CORS, rotas e entrega do front-end. O recurso `/api/tarefas` possui router, controller, service, validação e armazenamento em memória separados. Endpoints auxiliares fornecem recomendações e check-ins para aproveitar os fluxos assíncronos da Etapa 05.

A interface conversa com a API através de `services/task-service.js`, `study-service.js` e `api-client.js`. A configuração entregue pelo Express ativa `/api` na mesma origem. O arquivo estático de configuração mantém a demonstração local utilizável no Pages. Não existe troca automática para dados locais ao ocorrer uma falha da API.

Os arrays de tarefas e check-ins pertencem a cada instância da aplicação e são reiniciados com o processo. Não há autenticação de servidor nem banco de dados; matérias e conta demonstrativa permanecem locais. Consulte [etapa-06.md](etapa-06.md) para contratos HTTP, limitações, execução, testes e evidências.

## Evolução implementada — Etapa 07

A fonte em memória foi substituída por SQLite em arquivo. `database/connection.js` configura a conexão e aplica migrações versionadas; `repositories/` concentra SQL parametrizado. Services recebem esses repositories, mantendo controllers e rotas separados do armazenamento.

Matérias passaram ao banco e possuem duas relações 1:N: tarefas e check-ins. Chaves estrangeiras e ON DELETE RESTRICT impedem excluir disciplinas em uso. Tarefas continuam retornando o campo textual `subject` por JOIN, além de `subjectId`. O seed é opcional, transacional e registrado uma única vez.

A interface aguarda a consulta de matérias antes de preencher os formulários e utiliza GET/POST/PATCH/DELETE no catálogo. Conta demonstrativa e preferências permanecem locais. A persistência foi verificada encerrando e iniciando processos reais do servidor sobre o mesmo arquivo. O esquema, as instruções e os resultados estão em [etapa-07.md](etapa-07.md) e [banco/modelo.md](banco/modelo.md).
