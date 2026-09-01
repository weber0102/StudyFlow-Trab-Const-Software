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

## Evolução planejada

Em etapas futuras, a estrutura estática poderá receber JavaScript para atualização da interface, uma API para operações de matérias e tarefas e persistência de dados. A separação entre páginas, estilos e documentação já permite essa evolução incremental.
