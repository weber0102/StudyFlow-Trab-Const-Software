# ETAPA 02 - Protótipo estrutural com HTML semântico

## Objetivo atendido

Esta entrega transforma a proposta do StudyFlow em uma primeira interface web. O protótipo representa o problema definido na Etapa 01: organizar matérias, tarefas acadêmicas, prazos, prioridades e status de conclusão.

## Páginas criadas

1. **Painel inicial** (`src/index.html`): apresenta um resumo das tarefas, prazos próximos e matérias ativas.
2. **Listagem de tarefas** (`src/tarefas.html`): exibe as tarefas de exemplo em uma tabela e oferece filtros estruturais por matéria, status e prioridade.
3. **Cadastro de tarefa** (`src/nova-tarefa.html`): apresenta o formulário para título, matéria, descrição, data, prioridade e status inicial.

## Funcionalidades representadas

- Navegação entre as três telas.
- Visualização de tarefas por matéria, prazo, prioridade e status.
- Campos de filtro que representarão a futura busca de tarefas.
- Formulário estruturado para o cadastro de uma nova tarefa.
- Feedback de campos obrigatórios oferecido pelo HTML nativo.

Os dados exibidos são exemplos estáticos. A gravação, os filtros reais, a API, o banco de dados, a autenticação e a persistência serão implementados em entregas futuras, pois não são requisitos desta etapa.

## Decisões de HTML semântico

- `header`, `nav`, `main` e `footer` definem as regiões globais de cada página.
- `section` agrupa blocos temáticos; `article` identifica cartões de informações independentes; `aside` contém avisos e ajuda contextual.
- A lista de atividades no painel utiliza `ul` e a listagem completa utiliza `table`, pois os dados têm colunas comparáveis.
- Todo campo de formulário possui `label` associado por `for` e `id`.
- Os controles de navegação e de formulário usam links, `button`, `input`, `select` e `textarea` com seus usos semânticos apropriados.
