# ETAPA 03 - Interface responsiva com CSS

## Objetivo atendido

Nesta etapa, a estrutura HTML semântica criada anteriormente foi transformada em uma interface visualmente consistente, responsiva e adequada para desktop, tablet e smartphone. As funcionalidades continuam estáticas, como definido nas etapas anteriores: não foram adicionados API, persistência, autenticação ou regras de negócio.

## 1. Interfaces apresentadas

1. **Painel inicial** - `src/index.html`: resumo de tarefas, cards de indicadores, próximas atividades e matérias ativas.
2. **Listagem de tarefas** - `src/tarefas.html`: filtros estruturais e tabela com tarefa, matéria, prazo, prioridade e status.
3. **Cadastro de tarefa** - `src/nova-tarefa.html`: formulário com título, matéria, descrição, prazo, prioridade e status inicial.

## 2. Viewports utilizados

| Tipo | Resolução |
| --- | --- |
| Desktop | 1440 x 900 px |
| Tablet | 768 x 1024 px |
| Smartphone | 390 x 844 px |

## 3. Breakpoints utilizados

```css
@media (max-width: 64rem)   /* 1024 px: tablet */
@media (max-width: 37.5rem) /* 600 px: smartphone */
```

O primeiro breakpoint atende ao tablet de 768 px e reorganiza áreas que antes estavam em múltiplas colunas. O segundo cobre o smartphone de 390 px, quando menu, tabelas, formulários e ações precisam de uma apresentação prioritariamente vertical e apropriada para toque.

## 4. Principais decisões de responsividade

- **Desktop:** o painel usa Grid com três cards de indicadores e uma área principal em duas colunas; o cabeçalho usa Flexbox para distribuir marca e navegação.
- **Tablet:** os cards passam a duas colunas, com o terceiro ocupando a largura disponível; painel e formulário passam a uma coluna e os filtros são distribuídos em duas colunas.
- **Smartphone:** a navegação fica vertical e ocupa toda a largura; cards, filtros e campos ficam em uma coluna; ações ficam com largura total; espaçamentos são reduzidos sem diminuir a legibilidade.
- **Tabela:** em telas maiores, mantém cabeçalho e colunas para comparação rápida. No smartphone, o cabeçalho é ocultado e cada linha passa a ser um card; os atributos `data-label` exibem o nome de cada informação, evitando rolagem horizontal e perda de contexto.
- **Acessibilidade e usabilidade:** as cores mantêm contraste adequado, elementos interativos possuem foco visível, botões têm área mínima de toque e labels continuam associados aos campos.

## 5. Arquivos CSS responsáveis

| Arquivo | Responsabilidade |
| --- | --- |
| `src/assets/css/style.css` | variáveis, reset, tipografia, containers e layouts com CSS Grid. |
| `src/assets/css/components.css` | cabeçalho, navegação, botões, cards, listas, formulários, tabela e rodapé. |
| `src/assets/css/responsive.css` | media queries e adaptações para tablet e smartphone. |

## Mapa das evidências

| Evidência | Página | Resolução |
| --- | --- | --- |
| `desktop-tela-01.png` | Painel inicial (`index.html`) | 1440 x 900 px |
| `desktop-tela-02.png` | Listagem de tarefas (`tarefas.html`) | 1440 x 900 px |
| `desktop-tela-03.png` | Cadastro de tarefa (`nova-tarefa.html`) | 1440 x 900 px |
| `tablet-tela-01.png` | Painel inicial (`index.html`) | 768 x 1024 px |
| `tablet-tela-02.png` | Listagem de tarefas (`tarefas.html`) | 768 x 1024 px |
| `tablet-tela-03.png` | Cadastro de tarefa (`nova-tarefa.html`) | 768 x 1024 px |
| `smartphone-tela-01.png` | Painel inicial (`index.html`) | 390 x 844 px |
| `smartphone-tela-02.png` | Listagem de tarefas (`tarefas.html`) | 390 x 844 px |
| `smartphone-tela-03.png` | Cadastro de tarefa (`nova-tarefa.html`) | 390 x 844 px |

As imagens ficam em `docs/evidencias/etapa-03/` e registram as mesmas três interfaces nos três viewports padronizados.

## Verificação final

- [x] CSS organizado em arquivos por responsabilidade.
- [x] Flexbox aplicado em cabeçalho, navegação, grupos de botões, cabeçalhos de painéis e rodapé.
- [x] CSS Grid aplicado em cards, áreas de conteúdo, filtros e formulário.
- [x] Duas media queries com breakpoints relevantes.
- [x] Menu, cards, filtros, formulário e tabela adaptados para telas menores.
- [x] Verificação nos viewports desktop, tablet e smartphone.
- [x] Nove evidências em `docs/evidencias/etapa-03/`.
