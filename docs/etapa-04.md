# StudyFlow — Etapa 04: Interatividade com JavaScript

## 1. Objetivo da etapa

A Etapa 04 transforma o StudyFlow de um protótipo predominantemente visual em uma aplicação com comportamentos acionados pelo usuário. As tarefas podem ser cadastradas, pesquisadas, filtradas, ordenadas, concluídas, reabertas e removidas diretamente pela interface.

Os dados são guardados no `localStorage` do navegador, na chave `studyflow-tasks`. Por isso, a persistência é demonstrativa e local ao navegador/dispositivo: ela não depende de servidor, banco de dados ou conta compartilhada entre pessoas.

## 2. Organização da implementação

| Caminho | Responsabilidade |
| --- | --- |
| `/src/assets/js/tarefas.js` | Gerencia o estado das tarefas, a validação, o cadastro, a busca, os filtros, a ordenação, a alteração de status, o modal de exclusão e o painel dinâmico. |
| `/src/nova-tarefa.html` | Contém o formulário de cadastro e a região de feedback acessível da tarefa. |
| `/src/tarefas.html` | Contém a busca, os filtros, a ordenação, a lista de tarefas e as ações de concluir/reabrir/excluir. |
| `/src/index.html` | Exibe indicadores, próximas tarefas e matérias ativas atualizados a partir das tarefas salvas. |
| `/src/assets/css/components.css` | Estiliza mensagens, ações das tarefas, estado vazio e modal de confirmação. |
| `/src/assets/css/responsive.css` | Mantém filtros, lista, ações e modal utilizáveis em tablet e smartphone. |
| `/src/assets/js/subjects.js` | Funcionalidade preservada: fornece as matérias cadastradas para os selects. |
| `/src/assets/js/theme.js`, `/src/assets/js/navigation.js` e `/src/assets/js/auth.js` | Funcionalidades preservadas das etapas anteriores: tema, menu e conta demonstrativa. |

O JavaScript novo foi concentrado em `tarefas.js` para manter, no mesmo arquivo, as regras e o estado de uma mesma entidade do sistema: a tarefa acadêmica. Os scripts preexistentes permanecem separados porque cuidam de responsabilidades diferentes.

## 3. Funcionalidades interativas

### 3.1 Cadastro persistente e validação de tarefas

**Descrição:** permite registrar uma nova atividade acadêmica em `nova-tarefa.html`.

**Como funciona:** o evento `submit` é interceptado. `getFormData()` normaliza os valores do formulário e `validateTask()` verifica as regras antes de salvar. Quando os dados são válidos, uma tarefa recebe identificador próprio, é acrescentada ao array retornado por `getTasks()` e é salva por `saveTasks()`. O feedback de sucesso inclui o atalho para a lista de tarefas.

**Arquivos envolvidos:**

- `/src/nova-tarefa.html`
- `/src/assets/js/tarefas.js`
- `/src/assets/css/components.css`

**Conceitos JavaScript utilizados:** `addEventListener("submit")`, `preventDefault()`, `form.elements`, `trim()`, funções, arrays, `some()`, `localStorage`, `textContent`, `replaceChildren()` e classes CSS dinâmicas.

**Como testar:** cadastre uma tarefa com título, matéria, prazo, prioridade e status válidos. Depois acesse a lista de tarefas ou recarregue a página para confirmar que a tarefa continua disponível no mesmo navegador.

### 3.2 Busca, filtros automáticos e ordenação

**Descrição:** permite localizar tarefas por texto, matéria, status e prioridade, além de alterar sua ordem de apresentação.

**Como funciona:** a página `tarefas.html` acompanha os eventos `input`, `change`, `submit` e `reset` dos controles. `getFilterState()` reúne os valores ativos; `filterAndSortTasks()` aplica `filter()` e `sort()` ao array; e `renderTaskTable()` redesenha as linhas, o contador e o estado de lista vazia sem recarregar a página.

**Arquivos envolvidos:**

- `/src/tarefas.html`
- `/src/assets/js/tarefas.js`
- `/src/assets/css/components.css`
- `/src/assets/css/responsive.css`

**Conceitos JavaScript utilizados:** `addEventListener()`, `filter()`, `sort()`, `forEach()`, `document.createElement()`, `append()`, `replaceChildren()`, `dataset` e `textContent`.

**Como testar:** pesquise uma palavra existente no título, matéria ou descrição; combine os filtros; altere o critério de ordenação; e pesquise um termo inexistente para visualizar a mensagem de lista vazia.

### 3.3 Conclusão e reabertura de tarefas

**Descrição:** permite alterar uma tarefa entre os estados pendente e concluída.

**Como funciona:** ao clicar em “Concluir” ou “Reabrir”, `toggleTaskStatus()` procura a tarefa com `find()`, cria o array atualizado com `map()`, persiste a alteração e chama `refreshTaskInterfaces()`. A função atualiza a tabela, as próximas tarefas, os indicadores e as matérias ativas do painel.

**Arquivos envolvidos:**

- `/src/tarefas.html`
- `/src/index.html`
- `/src/assets/js/tarefas.js`

**Conceitos JavaScript utilizados:** delegação de evento `click`, `find()`, `map()`, `filter()`, `reduce()`, `forEach()`, `localStorage` e atualização dinâmica do DOM.

**Como testar:** na listagem, conclua uma tarefa e confirme a mudança do selo de status e do contador. Recarregue a página para confirmar a persistência. Em seguida, use “Reabrir” para retornar a tarefa ao acompanhamento.

### 3.4 Exclusão de tarefa com confirmação em modal

**Descrição:** remove uma tarefa somente após uma confirmação explícita do usuário.

**Como funciona:** `openDeleteModal()` guarda temporariamente o identificador da tarefa selecionada e cria/abre um diálogo acessível. O modal pode ser fechado pelo botão “Cancelar”, pelo clique no fundo ou pela tecla `Escape`. Ao confirmar, `confirmTaskDeletion()` usa `filter()` para gerar uma nova lista sem o item, salva o resultado e atualiza a interface.

**Arquivos envolvidos:**

- `/src/tarefas.html`
- `/src/assets/js/tarefas.js`
- `/src/assets/css/components.css`
- `/src/assets/css/responsive.css`

**Conceitos JavaScript utilizados:** estado temporário com `pendingDeletionId`, eventos `click` e `keydown`, `classList`, `hidden`, `focus()`, `find()`, `filter()`, criação de elementos e alteração dinâmica da interface.

**Como testar:** clique em “Excluir” em uma tarefa, cancele a operação e confirme que ela continua na lista. Depois abra o modal novamente, confirme a exclusão e verifique a redução do contador.

## 4. Conceitos de programação utilizados

| Conceito | Onde foi utilizado | Como verificar |
| --- | --- | --- |
| Manipulação do DOM | `renderTaskTable()`, `renderDashboard()`, `renderSubjectSummary()`, `ensureDeleteModal()` e funções auxiliares de criação de células, badges e ações. | Consulte `/src/assets/js/tarefas.js` e abra `tarefas.html`; as linhas, badges, contador e modal são inseridos/atualizados pelo script. |
| Tratamento de eventos | Formulário de tarefa, controles de busca/filtro/ordenação, botões da tabela, checkboxes do painel, modal, tecla `Escape` e evento `storage`. | Consulte os `addEventListener()` em `/src/assets/js/tarefas.js`. |
| Funções | Funções de leitura e persistência, validação, renderização, filtro, status e exclusão. | Consulte `getTasks()`, `saveTasks()`, `validateTask()`, `renderTaskTable()`, `toggleTaskStatus()` e `confirmTaskDeletion()` em `/src/assets/js/tarefas.js`. |
| Arrays | A lista de tarefas retornada por `getTasks()` e persistida em `studyflow-tasks`; também há tarefas iniciais em `createSeedTasks()`. | Consulte `/src/assets/js/tarefas.js` e o armazenamento local do navegador. |
| Métodos de iteração | `some()` para duplicidade, `filter()` para busca/exclusão, `sort()` para ordenação, `forEach()` para renderização, `find()` para localizar tarefas, `map()` para atualizar status e `reduce()` para os indicadores do painel. | Consulte `validateTask()`, `filterAndSortTasks()`, `renderDashboard()`, `toggleTaskStatus()` e `confirmTaskDeletion()` em `/src/assets/js/tarefas.js`. |
| Validação de formulários | `validateTask()` é chamada antes de salvar a tarefa. | Envie dados inválidos em `nova-tarefa.html` e consulte `cadastro-invalido.png`. |
| Alteração dinâmica da interface | Tabela, contador, feedback, painel, checkboxes, badges, estado vazio e modal são atualizados sem recarga. | Use busca, mudança de status e exclusão em `tarefas.html`. |
| Tratamento de situações inválidas | Campos incorretos, tarefa duplicada, busca sem resultado, identificador inexistente e armazenamento local inválido recebem tratamento seguro. | Consulte as condições de `validateTask()`, `toggleTaskStatus()`, `openDeleteModal()` e `getTasks()`. |

## 5. Validações implementadas

O formulário de `nova-tarefa.html` usa `novalidate` para que as mensagens da aplicação sejam produzidas pelo JavaScript, em vez de depender apenas dos avisos nativos do navegador.

| Campo ou situação | Regra JavaScript | Resultado quando inválido |
| --- | --- | --- |
| Título | Não pode ficar vazio após normalização. | O envio é interrompido e aparece “Preencha o título da tarefa.” |
| Título curto | Deve possuir pelo menos 3 caracteres. | O envio é interrompido e aparece “O título deve ter pelo menos 3 caracteres.” |
| Matéria | Deve existir na lista de matérias cadastradas. | O envio é interrompido e aparece “Selecione uma matéria cadastrada.” |
| Descrição | Pode possuir no máximo 500 caracteres. | O envio é interrompido e aparece uma mensagem específica sobre o limite. |
| Prazo | Deve possuir formato de data válido e não pode estar no passado. | O envio é interrompido e aparece uma mensagem correspondente. |
| Prioridade | Deve ser `alta`, `media` ou `baixa`. | O envio é interrompido e aparece “Selecione uma prioridade válida.” |
| Status | Deve ser `pendente` ou `concluida`. | O envio é interrompido e aparece “Selecione um status válido.” |
| Duplicata | Não pode haver tarefa com mesmo título, matéria e prazo. | O envio é interrompido e aparece “Já existe uma tarefa com este título, matéria e prazo.” |
| Dados válidos | Todas as regras anteriores precisam ser atendidas. | A tarefa é salva e aparece “Tarefa cadastrada com sucesso.” com link para a listagem. |

Em cada erro, o campo relacionado recebe `aria-invalid="true"`, a classe `is-invalid` e foco, enquanto a região `data-task-feedback` anuncia a mensagem para tecnologias assistivas.

## 6. Situações inválidas tratadas

| Situação | Tratamento | Resultado para o usuário |
| --- | --- | --- |
| Envio com campo vazio, curto ou preenchido apenas com espaços | Normalização e validação interrompem o cadastro. | Feedback integrado ao formulário e foco no campo com problema. |
| Tentativa de criar uma tarefa duplicada | `some()` compara título, matéria e prazo antes da gravação. | A tarefa não é gravada e a mensagem de duplicidade é exibida. |
| Prazo anterior ao dia atual ou data sem formato válido | `parseDate()` e a comparação com a data atual impedem a gravação. | A tarefa não é gravada e o prazo é marcado como inválido. |
| Busca ou filtros sem correspondência | A tabela fica sem linhas e o estado vazio é exibido. | A interface informa que nenhuma tarefa foi encontrada, sem quebrar o layout. |
| Ação sobre tarefa inexistente | `find()` confirma a existência do identificador antes de atualizar ou remover. | Uma mensagem de erro é mostrada e a lista existente é preservada. |
| Exclusão cancelada | `closeDeleteModal()` limpa o identificador temporário sem alterar o array. | O modal fecha e a tarefa permanece disponível. |
| `localStorage` corrompido ou em formato inadequado | `getTasks()` usa `try/catch`, filtra itens inválidos e restaura as tarefas iniciais quando necessário. | A aplicação continua utilizável, sem erro de JavaScript no fluxo normal. |

## 7. Instruções de execução

O projeto não possui dependências de instalação, framework ou etapa de compilação. É uma aplicação estática com HTML, CSS e JavaScript.

1. Clone o repositório:

   ```bash
   git clone https://github.com/weber0102/StudyFlow-Trab-Const-Software.git
   ```

2. Acesse a pasta clonada:

   ```bash
   cd StudyFlow-Trab-Const-Software
   ```

3. Inicie um servidor estático apontando para `src`:

   ```bash
   npx serve src
   ```

4. Abra no navegador o endereço informado no terminal, normalmente `http://localhost:3000`.

Também é possível executar a versão publicada em [GitHub Pages](https://weber0102.github.io/StudyFlow-Trab-Const-Software/).

Para repetir os testes em um estado limpo, abra as ferramentas de desenvolvedor do navegador, acesse **Application/Aplicativo > Local Storage**, remova a chave `studyflow-tasks` e recarregue a página. As tarefas iniciais serão recriadas automaticamente.

## 8. Instruções para testar

### Teste 1 — Cadastro válido e persistência

1. Acesse `nova-tarefa.html`.
2. Informe um título com três ou mais caracteres.
3. Selecione uma matéria cadastrada, uma data de hoje ou futura, prioridade e status.
4. Clique em **Salvar tarefa**.
5. Confirme a mensagem de sucesso.
6. Abra `tarefas.html` pelo link exibido e confirme a nova tarefa.
7. Recarregue a página para confirmar que o item persiste.

### Teste 2 — Validação e duplicidade

1. Em `nova-tarefa.html`, envie o formulário sem título ou com apenas espaços.
2. Confirme que o envio é bloqueado e a mensagem aparece no formulário.
3. Informe uma data passada e confirme a validação do prazo.
4. Cadastre uma tarefa válida.
5. Tente cadastrá-la novamente com o mesmo título, matéria e prazo.
6. Confirme a mensagem de duplicidade e que a lista não recebe outro item.

### Teste 3 — Busca, filtros e ordenação

1. Acesse `tarefas.html`.
2. Digite parte do nome de uma tarefa no campo de busca.
3. Confirme que o contador e as linhas são atualizados automaticamente.
4. Selecione matéria, status e/ou prioridade para combinar filtros.
5. Altere o seletor de ordenação e observe a nova ordem da lista.
6. Pesquise um termo inexistente e confirme o estado “Nenhuma tarefa encontrada”.
7. Limpe ou redefina os controles e confirme a volta da lista completa.

### Teste 4 — Concluir e reabrir

1. Em `tarefas.html`, clique em **Concluir** em uma tarefa pendente.
2. Confirme a alteração do selo de status e a mensagem de sucesso.
3. Acesse `index.html` e confirme a atualização do painel.
4. Recarregue a página e confirme que o status foi preservado.
5. Clique em **Reabrir** e confirme o retorno ao estado pendente.

### Teste 5 — Exclusão com confirmação

1. Em `tarefas.html`, clique em **Excluir**.
2. No modal, clique em **Cancelar** e confirme que a tarefa permanece.
3. Abra novamente a confirmação.
4. Clique em **Excluir tarefa**.
5. Confirme a mensagem de sucesso, a remoção da linha e a atualização do contador.
6. Repita em 390 x 844 px para verificar que o modal continua acessível no smartphone.

### Teste 6 — Responsividade e console

1. Teste as páginas em 1440 x 900 px, 768 x 1024 px e 390 x 844 px.
2. Em cada viewport, abra a busca/filtros, execute uma ação de tarefa e abra o modal de exclusão.
3. Confirme que não existe rolagem horizontal desnecessária, que os controles permanecem acessíveis e que o modal cabe na tela.
4. Abra o console do navegador, recarregue as páginas e repita o fluxo normal.
5. Confirme que nenhum erro JavaScript é registrado.

## 9. Evidências visuais

As evidências da Etapa 04 ficam em:

```text
/docs/evidencias/etapa-04/
```

Serão registradas exatamente 10 capturas:

| Arquivo da evidência | Página | Ação necessária | O que comprova |
| --- | --- | --- | --- |
| `cadastro-invalido.png` | `nova-tarefa.html` | Enviar título vazio, curto ou prazo inválido. | Validação JavaScript, foco/campo inválido e feedback integrado. |
| `cadastro-sucesso.png` | `nova-tarefa.html` | Preencher e salvar uma tarefa válida. | Feedback de sucesso e criação persistente da tarefa. |
| `tarefas-lista-inicial.png` | `tarefas.html` | Abrir a página sem filtros. | Tabela e contador renderizados a partir do array de tarefas. |
| `tarefas-busca-filtrada.png` | `tarefas.html` | Pesquisar termo existente e/ou aplicar filtros. | Busca e filtros dinâmicos com `filter()`. |
| `tarefas-sem-resultado.png` | `tarefas.html` | Pesquisar um termo inexistente. | Estado vazio e tratamento de ausência de resultados. |
| `tarefas-ordenadas.png` | `tarefas.html` | Escolher um critério de ordenação. | Ordem visual modificada por `sort()`. |
| `tarefa-concluida.png` | `tarefas.html` | Concluir uma tarefa pendente. | Alteração de status, mensagem e atualização do DOM. |
| `painel-atualizado.png` | `index.html` | Voltar ao painel após concluir/reabrir uma tarefa. | Indicadores, próximas tarefas e matérias ativas atualizados. |
| `exclusao-confirmacao.png` | `tarefas.html` | Em 390 × 844 px, clicar em Excluir sem confirmar ainda. | Modal de confirmação responsivo e estado temporário da interface. |
| `exclusao-concluida.png` | `tarefas.html` | Em 390 × 844 px, confirmar a exclusão de uma tarefa de demonstração. | Remoção persistente da linha e atualização do contador sem overflow horizontal. |

## 10. Matriz de evidências

| Requisito | Funcionalidade relacionada | Arquivo(s) | Evidência |
| --- | --- | --- | --- |
| Manipulação do DOM | Renderização de tarefas, painel e modal | `/src/assets/js/tarefas.js` | Funções `renderTaskTable()`, `renderDashboard()` e `ensureDeleteModal()`; capturas `tarefas-lista-inicial.png` e `exclusao-confirmacao.png`. |
| Tratamento de eventos | Cadastro, filtros, status e exclusão | `/src/assets/js/tarefas.js` | Listeners de `submit`, `input`, `change`, `click`, `keydown` e `storage`; capturas `cadastro-sucesso.png` e `tarefa-concluida.png`. |
| Validação de formulários | Cadastro de tarefa | `/src/assets/js/tarefas.js`, `/src/nova-tarefa.html` | Função `validateTask()` e captura `cadastro-invalido.png`. |
| Alteração dinâmica da interface | Busca, status, painel e modal | `/src/assets/js/tarefas.js`, `/src/index.html`, `/src/tarefas.html` | Capturas `tarefas-busca-filtrada.png`, `tarefa-concluida.png`, `painel-atualizado.png` e `exclusao-confirmacao.png`. |
| Uso de funções | Organização das regras de tarefas | `/src/assets/js/tarefas.js` | Funções `getTasks()`, `saveTasks()`, `validateTask()`, `filterAndSortTasks()`, `toggleTaskStatus()` e `confirmTaskDeletion()`. |
| Uso de arrays | Estado persistente das tarefas | `/src/assets/js/tarefas.js` | Array de `createSeedTasks()` e lista retornada por `getTasks()`; captura `tarefas-lista-inicial.png`. |
| Métodos de iteração | Duplicidade, consulta, ordem, atualização, resumo e exclusão | `/src/assets/js/tarefas.js` | `some()`, `filter()`, `sort()`, `forEach()`, `find()`, `map()` e `reduce()` nas funções de validação, filtro, painel, status e exclusão; capturas de busca e ordenação. |
| Tratamento de situações inválidas | Formulário, busca, identificadores e armazenamento | `/src/assets/js/tarefas.js` | `validateTask()`, `getTasks()`, `toggleTaskStatus()` e `openDeleteModal()`; capturas `cadastro-invalido.png` e `tarefas-sem-resultado.png`. |

## 11. Checklist final da Etapa 04

- [x] Manipulação do DOM
- [x] Tratamento de eventos
- [x] Validação de formulários
- [x] Alteração dinâmica da interface
- [x] Uso de funções
- [x] Uso de arrays
- [x] Métodos de iteração
- [x] Tratamento de situações inválidas
- [x] Pelo menos 3 funcionalidades interativas
- [x] Funcionalidade impossível de realizar apenas com HTML e CSS
- [x] Responsividade preservada em desktop, tablet e smartphone
- [x] Código JavaScript organizado
- [x] `/docs/etapa-04.md` criado
- [x] Funcionalidades, arquivos e conceitos documentados
- [x] Validações e situações inválidas documentadas
- [x] Instruções de execução e teste documentadas
- [x] Matriz de evidências criada
- [x] 10 evidências visuais registradas em `/docs/evidencias/etapa-04/`
- [x] Ausência de erros JavaScript no fluxo normal verificada
- [x] Capturas em `/docs/evidencias/etapa-04/` registradas
- [x] Tag `etapa-04` criada após o commit final
