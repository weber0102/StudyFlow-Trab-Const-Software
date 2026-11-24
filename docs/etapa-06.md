# StudyFlow — Etapa 06: API REST da aplicação

## 1. Objetivo e diagnóstico

A Etapa 06 acrescenta um servidor ao StudyFlow e conecta a interface existente à API REST própria. O HTML, a identidade visual, as cinco páginas e os módulos das etapas anteriores foram aproveitados.

Antes desta etapa, tarefas e matérias ficavam no `localStorage`. A Etapa 05 consultava `recomendacoes-estudo.json` por Fetch e enviava check-ins ao JSONPlaceholder. As entidades identificadas foram tarefas, matérias, check-ins e conta demonstrativa.

**Recurso principal: tarefas.** É o centro do planejamento acadêmico e já possui formulário, lista, filtros, detalhes, status e exclusão. A atualização por PATCH é demonstrada no aplicativo ao concluir/reabrir tarefas; a API também permite alterar os outros campos documentados.

A entrega foi conferida com o documento oficial **ETAPA 06 — API REST DA APLICAÇÃO** fornecido pelo professor. Os requisitos de CRUD, HTTP, JSON, códigos de resposta, validação, erros consistentes, rotas e testes estão cobertos pela matriz da seção 10. Os seis itens de entrega estão localizados abaixo:

| Obrigação do documento oficial | Localização na entrega |
| --- | --- |
| Código da API | `backend/src/` e arquivos de dependências em `backend/`. |
| Documentação dos endpoints | Seções 5, 6 e 7 deste documento. |
| Exemplos de requisições | Seção 5, coleção Postman e `evidencias/etapa-06/crud-http.json`. |
| Exemplos de respostas | Seções 5 e 7 e registro HTTP das evidências. |
| Coleção Postman, Insomnia ou equivalente | `docs/postman/etapa-06.postman_collection.json`. |
| Instruções para execução | Seção 2 e `README.md`. |

```text
Navegador → serviço JavaScript → Fetch/HTTP → rotas Express
         → controller → service → validação → dados em memória
         ← status HTTP + JSON ← atualização do DOM
```

## 2. Tecnologia e execução

- Node.js 22 ou superior, com npm instalado.
- Express 5.3.0, única dependência de execução; versão fixada no `package-lock.json`.
- ES Modules no servidor e no navegador.
- Testes HTTP com `node:test` e Fetch nativos do Node.
- Coleção Postman 2.1, executada também pelo Newman.

Na raiz do repositório:

```bash
cd backend
npm ci
npm start
```

Abra **http://127.0.0.1:3000/**. O mesmo processo serve o front-end e a API; não é necessário outro terminal para a interface. Não abra os HTML com `file://` para demonstrar a integração.

Outros comandos disponíveis, dentro de `backend`:

```bash
npm run dev
npm test
node scripts/record-evidence.js
```

`dev` reinicia o servidor quando o código muda. `test` cria servidores de teste isolados em portas disponíveis. O script de evidências usa uma instância isolada e grava as requisições e respostas reais em `docs/evidencias/etapa-06/crud-http.json`.

No PowerShell, para mudar a porta:

```powershell
$env:PORT = "3001"
npm start
```

`PORT` tem padrão 3000 e `HOST` tem padrão `127.0.0.1`. A configuração fica em `backend/src/server.js`. Para permitir teste pela rede local, configure conscientemente `HOST=0.0.0.0` e o firewall e acesse o IP do computador na porta configurada.

## 3. Organização e responsabilidades

| Arquivo/diretório | Responsabilidade | Endpoints/relações |
| --- | --- | --- |
| `backend/package.json`, `package-lock.json` | Scripts e dependência reproduzível. | `npm ci`, `npm start`, `npm test`. |
| `backend/src/server.js` | Porta, host, configuração e abertura do servidor. | Importa `createApp()`. |
| `backend/src/app.js` | JSON, CORS, roteadores, configuração da interface e arquivos estáticos. | Prefixo `/api`; serve `src/`. |
| `backend/src/routes/task.routes.js` | Define os cinco endpoints REST de tarefas. | Usa `task.controller.js`. |
| `backend/src/controllers/task.controller.js` | Lê parâmetros/body, chama serviço, define status e Location. | GET, POST, PATCH, DELETE. |
| `backend/src/services/task.service.js` | Consulta, criação, atualização, remoção e duplicidade. | Usa validação e store. |
| `backend/src/validation.js` | Valida IDs, corpos JSON, tarefas e check-ins. | POST e PATCH; todos os IDs. |
| `backend/src/errors.js` | Erro HTTP e middleware central de respostas públicas. | Todos os erros. |
| `backend/src/data/store.js` | Cria os dados em memória de cada instância e carrega o JSON de recomendações existente. | Tarefas/check-ins/recomendações. |
| `backend/src/routes/study.routes.js` | Endpoints auxiliares da Etapa 05. | Recomendações e check-ins. |
| `backend/test/api.test.js` | Oito testes HTTP automatizados, incluindo erros. | Todas as operações. |
| `backend/scripts/record-evidence.js` | Registra requisições HTTP reais para evidência. | CRUD em instância isolada. |
| `src/assets/js/services/config.js` | Configuração estática sem API; o Express entrega este módulo com `/api` ativo. | Mantém GitHub Pages utilizável. |
| `src/assets/js/services/api-client.js` | Fetch, JSON, erros do servidor e resposta 204 sem JSON. | Compartilhado pelos serviços. |
| `src/assets/js/services/task-service.js` | Comunicação HTTP das tarefas e modo estático legado. | Cinco operações CRUD. |
| `src/assets/js/tasks/store.js` | Cache da lista da API, separado do armazenamento local legado. | Alimenta views e validação. |
| `src/assets/js/tasks/controller.js` | Eventos, loading, retry, formulário e ações assíncronas. | Consome `task-service.js`. |
| `src/assets/js/tasks/validation.js` | Validação inicial e limites no navegador. | Complementa a validação do servidor. |
| `src/assets/js/tasks/view.js`, `modals.js` | Lista, painel, detalhes, confirmação e erros de exclusão. | Renderização preservada. |
| `src/assets/js/services/study-service.js` | Troca JSONPlaceholder pela API própria na execução com servidor. | GET recomendações; POST/GET check-ins. |
| `src/assets/js/dashboard/study-panel.js` | Consulta o histórico e exibe loading, sucesso e erro. | Consome o serviço de estudo. |
| `src/assets/js/core/data-mode.js`, `main.js` | Inicialização e mensagens corretas sobre a fonte de dados. | Todas as páginas. |
| `src/*.html` | Referências atualizadas e mensagens dependentes do modo de execução. | As cinco páginas foram mantidas. |
| `src/assets/css/components.css`, `responsive.css` | Barra de sincronização e adaptação móvel. | Layout e temas existentes preservados. |
| `docs/postman/etapa-06.postman_collection.json` | Coleção importável, variável baseUrl, cenários válidos e inválidos. | 28 requisições. |

Os arquivos têm implementação completa no repositório; não há funções ou camadas vazias. Tema, navegação, autenticação demonstrativa e cadastro de matérias continuam nos módulos já existentes.

## 4. Dados e limites do escopo

Tarefas e check-ins ficam em **arrays na memória do processo**. Ao reiniciar o servidor, as tarefas voltam aos seis exemplos iniciais e os check-ins são esvaziados. Não há banco de dados nem persistência em disco. Essa escolha atende ao foco da etapa: REST, HTTP, JSON, validação e integração.

Os clientes que acessam a mesma instância da API compartilham tarefas e check-ins. Não há separação por aluno nem autenticação de servidor. O login continua demonstrativo/local e não protege as rotas. A aplicação deve ser demonstrada com dados acadêmicos de exemplo.

Matérias, preferências e conta demonstrativa continuam no navegador. `subject` é um texto de 1 a 60 caracteres no servidor; não existe catálogo de matérias remoto nesta etapa. O front-end exige uma matéria cadastrada localmente. Tarefas antigas continuam aparecendo mesmo se sua matéria for removida do catálogo local.

Os registros antigos do `localStorage` não são migrados nem apagados automaticamente. O modo API usa um cache próprio, separado deles, e não recorre a dados locais silenciosamente se uma requisição falhar.

## 5. Endpoints

Base padrão: `http://127.0.0.1:3000`.

| Método | Endpoint | Descrição | Sucesso |
| --- | --- | --- | --- |
| GET | `/api/tarefas` | Lista as tarefas. | 200 + array, inclusive `[]`. |
| GET | `/api/tarefas/:id` | Retorna uma tarefa. | 200 + objeto. |
| POST | `/api/tarefas` | Cria uma tarefa. | 201 + objeto e Location. |
| PATCH | `/api/tarefas/:id` | Atualiza apenas os campos enviados. | 200 + objeto atualizado. |
| DELETE | `/api/tarefas/:id` | Exclui uma tarefa. | 204 sem corpo. |
| GET | `/api/recomendacoes` | Consulta as recomendações da Etapa 05 pela API própria. | 200 + `{ "recommendations": [...] }`. |
| GET | `/api/checkins` | Lista o histórico de estudos do servidor. | 200 + array. |
| POST | `/api/checkins` | Registra uma sessão de estudo. | 201 + objeto criado. |

A busca, os filtros e a ordenação continuam no front-end sobre a lista recebida; não são parâmetros de consulta da API. Não há suporte a PUT; a operação de atualização implementada é PATCH.

### Modelo de tarefa

```json
{
  "id": "00000000-0000-4000-8000-000000000001",
  "title": "Preparar apresentação",
  "subject": "Construção de Software",
  "description": "Demonstrar os cinco endpoints.",
  "dueDate": "2099-12-10",
  "priority": "alta",
  "status": "pendente",
  "createdAt": "2026-11-24T12:00:00.000Z"
}
```

O UUID e o timestamp de novos registros são gerados pelo servidor. O exemplo de timestamp é ilustrativo. `updatedAt` é acrescentado ao atualizar. Os campos usam os nomes já presentes no front-end para evitar conversões desnecessárias.

### GET /api/tarefas

- Objetivo: listar todos os registros; sem body nem parâmetros obrigatórios.
- Sucesso: 200 e array de objetos no modelo acima, ou `[]` quando vazio.
- Possível erro: 500 em falha interna inesperada.
- Exemplo: `curl http://127.0.0.1:3000/api/tarefas`.

### GET /api/tarefas/:id

- Objetivo: consultar o recurso específico; `id` é um UUID no caminho; sem body.
- Sucesso: 200 e objeto de tarefa.
- Erros: 400 para formato inválido; 404 para UUID válido inexistente; 500 em falha interna.
- Exemplo: `curl http://127.0.0.1:3000/api/tarefas/00000000-0000-4000-8000-000000000001`.

### POST /api/tarefas

- Objetivo: criar uma tarefa; sem parâmetro de ID.
- Header: `Content-Type: application/json`.
- Body: `title`, `subject`, `dueDate` e `priority` obrigatórios; `description` opcional (padrão vazio) e `status` opcional (padrão `pendente`).
- Sucesso: 201, objeto completo e `Location: /api/tarefas/<uuid-gerado>`.
- Erros: 400 dados inválidos; 409 duplicidade; 413 corpo maior que 16 KB; 415 tipo/codificação inadequados; 500 erro interno.

```bash
curl -X POST http://127.0.0.1:3000/api/tarefas \
  -H "Content-Type: application/json" \
  -d '{"title":"Preparar apresentação","subject":"Construção de Software","dueDate":"2099-12-10","priority":"alta","status":"pendente","description":"Demonstrar os cinco endpoints."}'
```

A resposta segue o modelo de tarefa com UUID novo. O cliente não envia `id`, `createdAt` ou `updatedAt`.

### PATCH /api/tarefas/:id

- Objetivo: alterar campos de uma tarefa existente; `id` UUID no caminho.
- Header: `Content-Type: application/json`.
- Body: objeto não vazio com um ou mais campos editáveis do POST.
- Sucesso: 200 com a tarefa completa, os campos enviados alterados e `updatedAt`.
- Erros: 400 ID/body/valor inválido; 404 tarefa ausente; 409 duplicidade; 413 corpo muito grande; 415 tipo inadequado; 500 erro interno.

```bash
curl -X PATCH http://127.0.0.1:3000/api/tarefas/00000000-0000-4000-8000-000000000001 \
  -H "Content-Type: application/json" \
  -d '{"status":"concluida"}'
```

Campos omitidos são mantidos. A data é validada quando enviada; concluir/reabrir uma tarefa atrasada não exige trocar seu prazo original. Exemplo da resposta: mesmo objeto do GET, com `"status": "concluida"` e `updatedAt`.

### DELETE /api/tarefas/:id

- Objetivo: excluir; `id` UUID no caminho; sem body.
- Sucesso: 204 sem JSON; o cliente HTTP trata essa ausência de conteúdo.
- Erros: 400 ID inválido; 404 tarefa ausente ou já excluída; 500 erro interno.
- Exemplo: `curl -i -X DELETE http://127.0.0.1:3000/api/tarefas/00000000-0000-4000-8000-000000000001`.

Após excluir, GET do mesmo ID responde 404.

### Endpoints auxiliares de estudo

`GET /api/recomendacoes`: sem body/parâmetros; 200 com o objeto `recommendations` do JSON existente; 500 em falha inesperada. Exemplo: `curl http://127.0.0.1:3000/api/recomendacoes`.

`GET /api/checkins`: sem body/parâmetros; 200 com `[]` ou array de registros; 500 em falha inesperada. Exemplo: `curl http://127.0.0.1:3000/api/checkins`.

`POST /api/checkins`: exige `subject` textual de 1 a 60 caracteres e `minutes` inteiro de 1 a 600. `note` é opcional, textual, até 180 caracteres. Campos desconhecidos são rejeitados. Sucesso 201; erros 400/413/415/500 conforme as regras comuns.

```bash
curl -X POST http://127.0.0.1:3000/api/checkins \
  -H "Content-Type: application/json" \
  -d '{"subject":"Cálculo I","minutes":45,"note":"Revisão de exercícios."}'
```

```json
{
  "id": "<uuid-gerado>",
  "subject": "Cálculo I",
  "minutes": 45,
  "note": "Revisão de exercícios.",
  "createdAt": "<timestamp-gerado>"
}
```

Os exemplos multiline com `curl` usam sintaxe Bash. No Windows, importe a coleção Postman ou use `Invoke-RestMethod`, evitando diferenças de aspas do curl em diferentes versões do PowerShell:

```powershell
$baseUrl = "http://127.0.0.1:3000"
$body = @{ title = "Apresentar no PowerShell"; subject = "Construção de Software"; dueDate = "2099-12-10"; priority = "alta" } | ConvertTo-Json
Invoke-RestMethod "$baseUrl/api/tarefas" -Method Post -ContentType "application/json; charset=utf-8" -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
```

## 6. Validação no servidor

| Campo/situação | Regra |
| --- | --- |
| Body | Objeto JSON não vazio; arrays, null, escalares e propriedades não previstas são rejeitados. |
| ID | UUID textual, hexadecimal, formato 8-4-4-4-12; convertido para minúsculas. |
| title | String normalizada; 3–100 caracteres. |
| subject | String normalizada; 1–60 caracteres. |
| description | String normalizada; 0–500 caracteres. |
| dueDate | String YYYY-MM-DD; data real; sem prazo passado na criação ou ao enviar uma nova data no PATCH. |
| priority | `alta`, `media` ou `baixa`. |
| status | `pendente` ou `concluida`. |
| Duplicidade | Mesmo título e matéria (ignorando maiúsculas/minúsculas) e mesma data: 409. |
| Campos de controle | `id`, `createdAt`, `updatedAt` e campos extras não podem ser definidos pelo cliente. |
| PATCH | Aceita subconjunto não vazio dos campos editáveis; valida antes de modificar o array. |
| JSON | Body limitado a 16 KB; JSON malformado retorna 400. |

Texto com apenas espaços é rejeitado nos campos obrigatórios. A normalização elimina espaços excedentes. Dados inválidos não modificam os registros. A validação do navegador é uma primeira orientação; a integridade não depende dela.

## 7. Status HTTP e padrão de erros

| Código | Uso real |
| --- | --- |
| 200 | GET e PATCH bem-sucedidos. |
| 201 | Tarefa/check-in criado. |
| 204 | DELETE bem-sucedido e preflight OPTIONS permitido; sem body. |
| 400 | ID, dados, JSON ou URL inválidos. |
| 403 | Origem cruzada não autorizada. |
| 404 | Registro, rota ou página inexistente. |
| 409 | Duplicidade de tarefa. |
| 413 | Body maior que 16 KB. |
| 415 | Falta de Content-Type JSON ou codificação não suportada. |
| 500 | Falha interna inesperada, com resposta controlada. |

Formato consistente; `campo` só aparece quando aplicável:

```json
{
  "erro": "DADOS_INVALIDOS",
  "mensagem": "O campo title deve ter entre 3 e 100 caracteres.",
  "campo": "title"
}
```

Exemplo de recurso inexistente, HTTP 404:

```json
{ "erro": "TAREFA_NAO_ENCONTRADA", "mensagem": "Tarefa não encontrada." }
```

Erro inesperado, HTTP 500:

```json
{ "erro": "ERRO_INTERNO", "mensagem": "Erro interno do servidor." }
```

Detalhes internos são registrados somente no console do servidor. Não são enviados stack traces, caminhos locais ou mensagens privadas. Não existe endpoint público para provocar erro interno; o teste injeta uma fonte de dados defeituosa em uma instância isolada.

## 8. Integração com a interface e CORS

1. O Express entrega o módulo `/assets/js/services/config.js` com `API_BASE_URL = "/api"` e modo API ativo.
2. O controlador consulta GET `/api/tarefas`, mostra carregamento e renderiza a lista recebida.
3. Nova tarefa valida o formulário, envia POST, recebe 201 e mostra sucesso.
4. Concluir/reabrir consulta a tarefa por ID e envia PATCH de status.
5. Abrir uma próxima tarefa usa GET individual e mostra o modal sem alterar o status.
6. Excluir abre confirmação; a confirmação envia DELETE e atualiza a lista após 204.
7. Falhas exibem mensagens integradas. A consulta possui botão **Atualizar tarefas** para nova tentativa. Falhas de exclusão também aparecem dentro do modal.
8. Recomendações usam GET `/api/recomendacoes`; o check-in usa POST `/api/checkins` e o histórico é consultado por GET, sobrevivendo ao reload do navegador enquanto o servidor permanece em execução.

Loading, bloqueio de envios simultâneos, `try/catch/finally`, DOM, pesquisa, filtros, ordenação e modais continuam presentes. A renderização do filtro de texto no evento `change` foi ajustada para não remover o botão durante o primeiro clique após a digitação.

Na execução padrão, front-end e API têm a mesma origem, portanto não é necessário liberar CORS para outros sites. Se houver uma interface em outra origem, ajuste explicitamente `API_BASE_URL` no módulo estático e configure uma lista exata de origens permitidas no servidor:

```powershell
$env:CORS_ORIGINS = "http://localhost:5500,http://127.0.0.1:5500"
npm start
```

Não há `*` nem credenciais em CORS. Preflight permite GET, POST, PATCH, DELETE e Content-Type. CORS controla leitura pelo navegador, não substitui autenticação.

### Versão estática e publicação

GitHub Pages hospeda somente `src/`: não executa a API Node. O módulo de configuração salvo no disco tem `API_BASE_URL = null` e ativa a demonstração anterior com armazenamento local, JSON e JSONPlaceholder. A interface informa qual fonte está usando.

Para demonstrar **a Etapa 06 completa**, utilize `npm start` e o endereço local do Express. A entrega no GitHub inclui o backend completo, a interface, a documentação, a coleção e as evidências. O workflow do Pages publica a interface em modo estático. Disponibilizar também a API na internet exige hospedagem de Node e configuração da URL/CORS; essa hospedagem não é exigida no documento oficial.

## 9. Testes e coleção Postman

Arquivo: [`postman/etapa-06.postman_collection.json`](postman/etapa-06.postman_collection.json).

1. Inicie `npm start` dentro de `backend`.
2. No Postman, use **Import → File** e selecione a coleção.
3. A variável de coleção `baseUrl` é `http://127.0.0.1:3000`; ajuste se a porta mudar.
4. Execute a coleção em ordem no Collection Runner. Ela cria título único e salva o UUID criado em `taskId`.
5. Observe o ciclo lista → POST → GET individual → PATCH → GET → DELETE → GET 404.
6. Observe também os testes de ausência, espaços, tipos, data impossível, prioridade, campo desconhecido, ID inválido, duplicidade e recursos inexistentes.

Execução opcional por CLI (requer internet para obter Newman na primeira utilização):

```bash
cd backend
npx --yes newman run ../docs/postman/etapa-06.postman_collection.json
```

Resultado observado na validação desta entrega: **28 requisições e 59 asserções, zero falhas**. O check-in válido da coleção permanece na memória até o reinício do servidor. O registro de tarefa criado pela coleção é excluído ao final.

`npm test` executa oito grupos de testes HTTP isolados. Eles incluem lista vazia, todos os endpoints CRUD, defaults, normalização, duplicidade em POST e PATCH, campos inválidos, IDs, JSON malformado, body excessivo, Content-Type, CORS, serviços auxiliares e resposta 500 sem vazamento de detalhes.

### Roteiro de demonstração no navegador

1. Abra `http://127.0.0.1:3000/`; confira “Tarefas carregadas do servidor”.
2. Abra Nova tarefa; envie vazio e veja a validação; depois cadastre uma tarefa válida.
3. Abra Tarefas; pesquise o título; conclua e reabra. No Network, observe GET individual e PATCH.
4. Exclua com confirmação; observe DELETE 204 e nova consulta GET.
5. No painel, abra detalhes pelo botão ↗; o status não muda.
6. Envie um check-in, recarregue e veja o histórico fornecido pelo servidor.
7. Para erro de recomendação, use `index.html?consulta=erro`. Para a falha de envio demonstrativa, use `index.html?envio=erro`. Os parâmetros da Etapa 05 foram mantidos.
8. Para falha real de comunicação, carregue Tarefas, interrompa o servidor no terminal e clique Atualizar tarefas. Reinicie o servidor e repita para observar a recuperação.
9. Verifique 1440 × 900, 768 × 1024 e 390 × 844, inclusive tema e menu. No fluxo normal, o console não deve registrar erros JavaScript.

Os testes de navegador desta entrega confirmaram CRUD integrado, validação, pesquisa, GET individual, histórico após reload, erro/retry, conflito 409 criado por outro cliente e uso de matéria local em uma nova tarefa. As cinco páginas abriram sem erros JavaScript nem overflow nos três viewports. O modo estático também foi verificado com cadastro local.

## 10. Matriz de requisitos

| Requisito | Implementação | Arquivo(s) | Como testar |
| --- | --- | --- | --- |
| GET consulta | Lista de tarefas, inclusive vazia. | `routes/task.routes.js`, `task.controller.js`, `task.service.js` | Postman 01; primeiro teste de `api.test.js`. |
| GET individual | UUID, consulta e 404. | Mesmos arquivos e `validation.js` | Postman 03, 13 e 14; abrir detalhes no painel. |
| POST | Criação validada, 201 e Location. | Controller e service de tarefas | Postman 02; formulário Nova tarefa. |
| PATCH | Atualização parcial validada. | Controller e service de tarefas | Postman 04/05; Concluir/Reabrir. |
| DELETE | Exclusão e 204 sem body. | Controller e service de tarefas | Postman 19–23; modal de exclusão. |
| JSON | Parser, limite e respostas estruturadas. | `app.js`, `errors.js` | `npm test`: JSON inválido e corpo excessivo. |
| Códigos HTTP | Sucessos e falhas distintos. | Controller, validação, middleware | Conferir asserções Postman e testes. |
| Validação | Campos, tipos, datas, UUID e duplicidade. | `validation.js`, `task.service.js` | Postman 06–18 e `npm test`. |
| Erros consistentes | `erro`, `mensagem`, `campo` opcional. | `errors.js` | Requisição inválida e teste 500. |
| Rotas organizadas | Router separado de controller e regras. | `routes/`, `controllers/`, `services/` | Inspecionar imports e métodos HTTP. |
| Integração Fetch | Camada de serviço preservada. | `src/assets/js/services/` | DevTools → Network durante CRUD. |
| Loading/sucesso/erro | Feedback, botões desabilitados e retry. | `tasks/controller.js`, `dashboard/study-panel.js` | Roteiro de navegador e evidências. |
| Responsividade | Layout existente e barra de sincronização adaptados. | CSS compartilhado e `responsive.css` | Três viewports documentados. |
| Etapas anteriores | Cinco páginas, filtros, matérias, tema, menu, login demo. | `src/` | Roteiro e modo estático. |

Todos os caminhos de backend da matriz são relativos a `backend/src`, exceto onde indicado.

## 11. Evidências

Diretório: `docs/evidencias/etapa-06/`.

As imagens 01–07 apresentam registros reais de requisições capturados por Node.js Fetch, identificado como ferramenta na própria imagem. Não são capturas do Postman. O arquivo `crud-http.json` contém os dados originais, sem depender das imagens. Para obter evidências no Postman, abra os mesmos itens da coleção e capture método, URL, body, status e JSON de resposta.

| Arquivo | Página/ferramenta | Ação | O que comprova |
| --- | --- | --- | --- |
| `01-get-lista.png` | Registro HTTP Fetch | GET `/api/tarefas` | Lista e 200. |
| `02-get-individual.png` | Registro HTTP Fetch | GET do UUID criado | Consulta individual e 200. |
| `03-post-sucesso.png` | Registro HTTP Fetch | POST válido | Body, UUID criado e 201. |
| `04-post-invalido.png` | Registro HTTP Fetch | POST com entrada inválida | 400 e erro JSON. |
| `05-patch-sucesso.png` | Registro HTTP Fetch | PATCH de status | Atualização parcial e 200. |
| `06-delete-sucesso.png` | Registro HTTP Fetch | DELETE do UUID | 204 sem conteúdo. |
| `07-get-nao-encontrado.png` | Registro HTTP Fetch | GET após DELETE | 404 e mensagem. |
| `08-integracao-desktop.png` | Tarefas, 1440 × 900 | Abrir após GET | Interface conectada ao servidor. |
| `09-integracao-tablet.png` | Tarefas, 768 × 1024 | Abrir após GET | Reorganização no tablet. |
| `10-integracao-smartphone.png` | Tarefas, 390 × 844 | Abrir após GET | Barra de sincronização e formulário em largura móvel. |
| `crud-http.json` | Node.js Fetch | `node scripts/record-evidence.js` | Transcrição reproduzível do CRUD. |

## 12. Auditoria final

- [x] Recurso principal coerente: tarefas.
- [x] GET todos, GET individual, POST, PATCH e DELETE.
- [x] Métodos HTTP, JSON e status coerentes.
- [x] Validação no servidor, IDs e recursos ausentes tratados.
- [x] Duplicidade, campos inadequados, JSON inválido e erros internos tratados.
- [x] Rotas, controllers, serviços e dados organizados.
- [x] Dados em memória explicitados.
- [x] CORS restrito e configurável; padrão na mesma origem.
- [x] API e coleção testadas por requisições HTTP reais.
- [x] Fetch e modularização da Etapa 05 aproveitados.
- [x] Loading, sucesso, erro e retry na interface.
- [x] Validação inicial e funcionalidades das etapas anteriores preservadas.
- [x] Responsividade nas cinco páginas e três viewports verificada.
- [x] Endpoints, exemplos, execução, testes e matriz documentados.
- [x] Coleção Postman e evidências incluídas.
- [x] README atualizado.

## 13. Git e entrega

Branch identificada: `main`. Depois da revisão:

```bash
git status
git diff --check
git add backend src docs README.md tests/README.md
git commit -m "Etapa 06 - API REST da aplicação"
git push origin main
```

O documento oficial da Etapa 06 não determina uma tag específica; por isso não há tag adicional para esta entrega. Commit e push registram os arquivos completos na branch `main`; o workflow do GitHub Pages publica a interface estática. A execução da API segue as instruções da seção 2.

Referências técnicas: [instalação do Express](https://expressjs.com/en/starter/installing/) e [tratamento de erros do Express](https://expressjs.com/en/guide/error-handling/).
