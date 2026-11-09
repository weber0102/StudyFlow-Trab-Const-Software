# StudyFlow — Etapa 05: Modularização e comunicação assíncrona

## 1. Objetivo

A Etapa 05 evolui o StudyFlow para uma arquitetura modular com ES Modules e comunicação assíncrona. As funcionalidades das Etapas 03 e 04 foram preservadas e agora convivem com uma consulta de recomendações acadêmicas e o envio de um check-in de estudo para um serviço REST simulado.

## 2. Estrutura atual e modularização

Antes da refatoração, `src/assets/js/tarefas.js` reunia armazenamento local, dados iniciais, validação, filtros, renderização, modais e eventos. O arquivo foi substituído por módulos menores, cada um responsável por uma parte real da aplicação. Todas as páginas carregam apenas `main.js` com `type="module"`.

| Arquivo | Responsabilidade | Importado por |
| --- | --- | --- |
| `/src/assets/js/main.js` | Inicializa os recursos adequados à página atual. | HTML de todas as páginas. |
| `/src/assets/js/core/helpers.js` | Normalização de texto, datas, identificadores, espera assíncrona e parâmetros de demonstração. | Módulos de tarefas e serviços. |
| `/src/assets/js/core/feedback.js` | Feedback visual, campos inválidos e estado de botões. | Controladores de tarefas e check-in. |
| `/src/assets/js/theme.js` | Tema claro/escuro preservado. | `main.js`. |
| `/src/assets/js/navigation.js` | Menu lateral/gaveta responsivo preservado. | `main.js`. |
| `/src/assets/js/auth.js` | Acesso demonstrativo local preservado. | `main.js`. |
| `/src/assets/js/subjects.js` | Persistência, selects, lista, inclusão e remoção de matérias. | `main.js` e validação de tarefas. |
| `/src/assets/js/tasks/store.js` | Estado local e tarefas iniciais. | Controlador e validação de tarefas. |
| `/src/assets/js/tasks/validation.js` | Leitura e validação do formulário de tarefa. | Controlador de tarefas. |
| `/src/assets/js/tasks/view.js` | Tabela, dashboard, filtros, badges e feedback de cadastro. | Controlador e modais de tarefas. |
| `/src/assets/js/tasks/modals.js` | Modal de detalhes e confirmação de exclusão. | Controlador de tarefas. |
| `/src/assets/js/tasks/controller.js` | Eventos e regras de cadastro, filtros, status, exclusão e atualização de tarefas. | `main.js`. |
| `/src/assets/js/services/api-client.js` | `fetch()`, leitura de JSON, `response.ok` e erros HTTP/rede. | Serviço de estudo. |
| `/src/assets/js/services/study-service.js` | `GET` de recomendações e `POST` de check-ins. | Painel de estudo. |
| `/src/assets/js/dashboard/study-panel.js` | Renderização, loading, validação e eventos do painel assíncrono. | `main.js`. |
| `/src/assets/data/recomendacoes-estudo.json` | Fonte JSON acadêmica usada na consulta. | Serviço de estudo via `fetch()`. |

Fluxo principal:

```text
HTML com type="module"
          ↓
       main.js
    ↓     ↓      ↓
 tarefas  matérias  painel de estudo
                       ↓
                study-service.js
                       ↓
                api-client.js
                  ↙          ↘
 JSON acadêmico (GET)   JSONPlaceholder (POST)
```

## 3. Fonte dos dados

### Consulta

O arquivo `/src/assets/data/recomendacoes-estudo.json` contém recomendações ligadas às matérias do StudyFlow. Ele é carregado com `fetch()` como um recurso externo ao JavaScript, o que permite uma demonstração estável tanto no servidor local quanto no GitHub Pages. A escolha evita uma API sem relação com o domínio acadêmico.

### Submissão

O endpoint `https://jsonplaceholder.typicode.com/posts` é usado como serviço REST simulado. Ele recebe um `POST` com os dados de check-in acadêmico e devolve uma confirmação demonstrativa. Após a resposta de sucesso, o histórico visível do aluno é atualizado e persistido localmente na chave `studyflow-study-checkins`.

JSONPlaceholder não persiste o check-in em um banco de dados real; seu uso é intencional nesta etapa para demonstrar comunicação HTTP sem criar um back-end desnecessário.

## 4. Operação de consulta

| Item | Implementação |
| --- | --- |
| Funcionalidade | Carregar recomendações acadêmicas no painel inicial. |
| Método HTTP | `GET`. |
| Endpoint | `/assets/data/recomendacoes-estudo.json`. |
| Arquivo responsável | `/src/assets/js/services/study-service.js`, função `loadRecommendations()`. |
| Cliente HTTP | `/src/assets/js/services/api-client.js`, função `requestJson()`. |
| Interface | Bloco **Recomendações para estudar** em `index.html`. |
| Loading | Mensagem **Carregando recomendações acadêmicas…**, `aria-busy="true"` e botão **Atualizar** temporariamente desabilitado. |
| Sucesso | Cards são criados no DOM e a mensagem informa a quantidade carregada. |
| Erro | Mensagem integrada, botão **Atualizar** disponível e interface sem quebra. |

Fluxo:

```text
Abrir Início → loading → fetch GET → response.ok → JSON → cards no DOM
                                    ↘ erro HTTP/rede → mensagem + Atualizar
```

## 5. Operação de submissão

| Item | Implementação |
| --- | --- |
| Funcionalidade | Registrar um check-in de estudo. |
| Método HTTP | `POST`. |
| Endpoint | `https://jsonplaceholder.typicode.com/posts`. |
| Arquivo responsável | `/src/assets/js/services/study-service.js`, função `submitStudyCheckin()`. |
| Dados enviados | Matéria, minutos estudados, observação e identificador demonstrativo do usuário. |
| Validação | Matéria cadastrada, duração inteira entre 1 e 600 minutos e observação de até 180 caracteres. |
| Loading | Botão troca para **Enviando check-in…**, recebe `disabled` e `aria-busy="true"`. |
| Sucesso | Feedback integrado e novo item em **Últimos check-ins**. |
| Erro | Feedback integrado; botão é restaurado no `finally` para permitir nova tentativa. |

Dados inválidos interrompem o fluxo antes da requisição. Portanto, o serviço só é acionado após a validação JavaScript.

## 6. Comunicação assíncrona e Promises

- `requestJson()` é `async` e utiliza `await fetch(...)` e `await response.json()`.
- `fetch()` devolve uma `Promise`; `await` pausa apenas a função assíncrona até que a Promise seja resolvida ou rejeitada.
- `loadRecommendations()` e `submitStudyCheckin()` usam `Promise.all()` com `wait(700)` para manter o loading perceptível durante a demonstração.
- `try/catch/finally` no painel atualiza o DOM em sucesso, trata a falha sem depender do console e sempre restaura o botão de envio.
- `response.ok` é verificado em `requestJson()`; um status HTTP como `404` gera `ApiError`, em vez de ser aceito como sucesso.

## 7. Estado de carregamento

| Operação | Início | Durante | Fim |
| --- | --- | --- | --- |
| Consulta | Ao abrir `index.html` ou clicar em **Atualizar**. | Mensagem de carregamento, spinner, `aria-busy` no painel e botão desabilitado. | Cards no sucesso ou mensagem com opção de nova tentativa no erro. |
| Envio | Após submit válido do check-in. | Botão desabilitado com texto **Enviando check-in…**. | `finally` restaura o botão, tanto em sucesso como em erro. |

## 8. Tratamento de sucesso

| Operação | Retorno visual |
| --- | --- |
| GET de recomendações | Cards renderizados e mensagem “3 recomendações carregadas com sucesso.” |
| POST de check-in | Mensagem “Check-in enviado com sucesso e registrado no seu histórico.” e item inserido na lista. |

## 9. Tratamento de erro

| Situação | Tratamento | Como demonstrar |
| --- | --- | --- |
| Erro HTTP na consulta | `requestJson()` identifica `response.ok === false`; o painel mostra o status e mantém **Atualizar** disponível. | Abra `index.html?consulta=erro`. A aplicação solicita um arquivo inexistente e recebe `404`. |
| Serviço indisponível/rede sem conexão | Exceção de `fetch()` é convertida em mensagem orientada ao usuário. | Abra as DevTools, ative **Offline** e atualize a página. |
| Falha no envio | O `catch` do formulário mostra a falha e o `finally` reabilita o botão. | Abra `index.html?envio=erro` e envie um check-in válido. |
| Resposta JSON inesperada | `requestJson()` lança `ApiError`; não há atualização do histórico. | Pode ser reproduzido apontando temporariamente o serviço a uma resposta não JSON durante teste técnico. |
| Formulário inválido | O foco vai ao campo incorreto e nenhuma chamada é feita. | Envie sem escolher matéria ou com minutos fora do intervalo. |

## 10. Instruções de execução

O projeto continua sendo HTML, CSS e JavaScript puro. Não há dependências de instalação ou etapa de compilação.

1. Clone o repositório.
2. Entre na pasta do projeto.
3. Inicie um servidor estático a partir da raiz:

   ```bash
   npx serve src
   ```

4. Abra o endereço informado pelo comando, normalmente `http://localhost:3000`.
5. Acesse **Início** para testar o `GET` e o `POST` da Etapa 05.
6. Para o envio real ao serviço simulado, mantenha conexão com a internet.

A versão publicada é disponibilizada em:

<https://weber0102.github.io/StudyFlow-Trab-Const-Software/>

## 11. Instruções de teste

### Teste 1 — Consulta com sucesso

1. Abra `index.html`.
2. Observe “Carregando recomendações acadêmicas…”.
3. Aguarde os três cards de recomendação.
4. Confira a mensagem de sucesso e clique em **Atualizar** para repetir a consulta.

### Teste 2 — Erro HTTP da consulta

1. Abra `index.html?consulta=erro`.
2. Aguarde a mensagem de erro `HTTP 404`.
3. Confira que a página permanece utilizável e que o botão **Atualizar** continua disponível.

### Teste 3 — Envio válido

1. Abra `index.html`.
2. Selecione uma matéria, informe minutos entre 1 e 600 e, opcionalmente, uma observação.
3. Clique em **Enviar check-in**.
4. Observe o botão desabilitado e o texto **Enviando check-in…**.
5. Aguarde a mensagem de sucesso e confirme o registro em **Últimos check-ins**.

### Teste 4 — Validação antes do envio

1. Abra `index.html`.
2. Clique em **Enviar check-in** sem selecionar uma matéria.
3. Confira a mensagem de validação e o foco no campo.
4. Confirme que não aparece o estado de envio.

### Teste 5 — Falha do envio

1. Abra `index.html?envio=erro`.
2. Preencha o formulário com dados válidos.
3. Envie o check-in.
4. Confira a mensagem de indisponibilidade e que o botão volta a ficar disponível.

### Teste 6 — Regressão das etapas anteriores

1. Cadastre uma tarefa válida em `nova-tarefa.html` e tente também um envio inválido.
2. Em `tarefas.html`, pesquise, filtre, ordene, conclua/reabra e abra a confirmação de exclusão.
3. No painel, abra detalhes de uma próxima tarefa pelo botão ↗.
4. Em `materias.html`, adicione e remova uma matéria.
5. Teste tema, menu e login demonstrativo.

### Teste 7 — Responsividade e console

1. Repita os fluxos nos tamanhos 1440 × 900, 768 × 1024 e 390 × 844.
2. Confirme que não há rolagem horizontal indevida, que cards e formulário se reorganizam e que botões permanecem tocáveis.
3. Abra o console e repita o fluxo normal; não deve haver erros JavaScript.

## 12. Matriz de requisitos

| Requisito | Implementação | Arquivo(s) | Como verificar |
| --- | --- | --- | --- |
| Separação em módulos | Funções separadas por domínio e responsabilidade. | `main.js`, `core/`, `tasks/`, `services/`, `dashboard/`. | Inspecione os `import` e `export` dos módulos. |
| Sem arquivo único concentrador | O antigo `tarefas.js` foi removido; tarefas possuem store, validation, view, modals e controller. | `/src/assets/js/tasks/`. | Compare os módulos e suas responsabilidades na tabela da seção 2. |
| ES Modules | Um único carregamento `type="module"` inicializa a aplicação. | Todos os HTML e `/src/assets/js/main.js`. | Inspecione a tag de script e os imports de `main.js`. |
| Chamadas assíncronas | Consulta e envio são funções `async`. | `study-service.js` e `study-panel.js`. | Consulte `loadRecommendations()` e `submitStudyCheckin()`. |
| Fetch API | Cliente HTTP centraliza a requisição e valida a resposta. | `/src/assets/js/services/api-client.js`. | Consulte `requestJson()` e `fetch(url, options)`. |
| Promises / async-await | `await fetch`, `await response.json` e `Promise.all`. | `api-client.js` e `study-service.js`. | Consulte as funções assíncronas citadas. |
| Dados externos/mock | JSON acadêmico e JSONPlaceholder. | `recomendacoes-estudo.json` e `study-service.js`. | Abra o painel e DevTools > Network. |
| Operação de consulta | GET de recomendações acadêmicas. | `study-service.js` e `study-panel.js`. | Abra Início e observe loading, cards e feedback. |
| Operação submetida | POST de check-in. | `study-service.js` e `study-panel.js`. | Envie formulário válido e observe histórico. |
| Estado de carregamento | Spinner/mensagem e botão temporariamente desabilitado. | `study-panel.js`, `feedback.js` e CSS. | Capturas `consulta-carregamento.png` e `checkin-carregamento.png`. |
| Tratamento de sucesso | Cards e histórico atualizados com feedback integrado. | `study-panel.js`. | Capturas `consulta-sucesso.png` e `checkin-sucesso.png`. |
| Tratamento de erro | HTTP, rede, resposta inválida e falha de envio tratados. | `api-client.js`, `study-service.js`, `study-panel.js`. | Use `?consulta=erro`, `?envio=erro` ou modo Offline. |
| Validações da Etapa 04 preservadas | Validação de tarefa continua antes do armazenamento local. | `tasks/validation.js` e `tasks/controller.js`. | Tente cadastrar tarefa vazia, curta ou duplicada. |
| Responsividade preservada | Grid de recomendações e check-in adapta colunas. | `components.css` e `responsive.css`. | Teste 1440 × 900, 768 × 1024 e 390 × 844. |

## 13. Evidências visuais

As capturas estão em `/docs/evidencias/etapa-05/`.

| Evidência | Página | Ação | Requisito demonstrado |
| --- | --- | --- | --- |
| `consulta-carregamento.png` | Início | Abrir o painel durante o atraso controlado. | Loading do GET. |
| `consulta-sucesso.png` | Início | Aguardar a consulta normal. | GET, `fetch`, sucesso e cards renderizados. |
| `consulta-erro.png` | Início | Abrir `index.html?consulta=erro`. | `response.ok`, erro HTTP e feedback visual. |
| `checkin-carregamento.png` | Início | Enviar formulário válido. | POST pendente e prevenção de envio duplicado. |
| `checkin-sucesso.png` | Início | Aguardar retorno do serviço simulado. | Sucesso e atualização dinâmica do histórico. |
| `checkin-erro.png` | Início | Abrir `index.html?envio=erro` e enviar dados válidos. | Tratamento de falha de envio. |
| `checkin-invalido.png` | Início | Enviar sem matéria selecionada. | Validação impede a requisição. |
| `responsivo-checkin-mobile.png` | Início | Abrir em 390 × 844. | Interface dinâmica sem overflow horizontal. |

## 14. Auditoria e checklist final

### Consulta

- [x] Requisição normal.
- [x] Loading visível.
- [x] Retorno com dados.
- [x] Erro HTTP tratado.
- [x] Indisponibilidade de rede tratada por `catch`.

### Submissão

- [x] Formulário válido.
- [x] Formulário inválido sem requisição.
- [x] Loading e botão desabilitado.
- [x] Envio bem-sucedido.
- [x] Falha de envio tratada.
- [x] Prevenção de envio duplicado durante a Promise pendente.

### Etapa 05

- [x] Código JavaScript separado em módulos.
- [x] Não existe um único arquivo concentrando toda a lógica.
- [x] ES Modules e `import`/`export` utilizados.
- [x] Fetch API, `async`/`await` e Promises usados.
- [x] Fonte JSON acadêmica e serviço REST simulado utilizados.
- [x] Operação GET e operação POST implementadas.
- [x] Loading, sucesso, erro HTTP e erro de comunicação tratados.
- [x] Feedback visual integrado ao usuário.
- [x] Validações e funcionalidades da Etapa 04 preservadas.
- [x] Responsividade verificada em desktop, tablet e smartphone.
- [x] `/docs/etapa-05.md`, matriz e oito evidências criados.
- [x] Fluxo normal verificado sem erros JavaScript no console.

## 15. Comandos Git

O repositório utiliza a branch `main` e as etapas anteriores seguem o padrão de tags. Depois de revisar a entrega:

```bash
git status
git add .
git commit -m "Etapa 05 - Modularização e comunicação assíncrona"
git push origin main
git tag etapa-05
git push origin etapa-05
```

Crie a tag somente depois do commit final, para que `etapa-05` aponte exatamente para a versão entregue.
