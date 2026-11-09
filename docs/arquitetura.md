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
