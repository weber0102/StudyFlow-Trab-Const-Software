# Evidências de funcionamento - Etapa 02

## Verificação realizada

Foi feita uma validação estrutural dos arquivos HTML: presença das regiões semânticas, existência das três páginas, destinos dos links internos e associação entre cada `label` e seu respectivo campo de formulário.

| Tela | Evidência observada |
| --- | --- |
| Painel inicial | Contém `header`, `nav`, `main`, `section`, `article` e `footer`, além dos links para as demais telas. |
| Listagem de tarefas | Contém a tabela de tarefas, o formulário de filtros e os rótulos associados aos três seletores. |
| Cadastro de tarefa | Contém formulário, seis campos rotulados e três campos obrigatórios com validação nativa do navegador. |

## Como reproduzir

Abra `src/index.html` diretamente no navegador ou, a partir da raiz do repositório, execute um servidor estático, por exemplo:

```bash
npx serve src
```

Em seguida, navegue entre `index.html`, `tarefas.html` e `nova-tarefa.html` pelos links do cabeçalho.
