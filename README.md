# StudyFlow

Aplicação web para ajudar estudantes a organizar matérias, tarefas acadêmicas, prazos e o andamento de suas atividades.

## Problema resolvido

Quem cursa várias disciplinas precisa conciliar trabalhos, exercícios e leituras com datas diferentes. O StudyFlow centraliza essas atividades para facilitar a identificação de prioridades e prazos próximos.

## Etapa atual

**Etapa 02 - Protótipo estrutural com HTML semântico.** Esta entrega apresenta três interfaces estáticas e navegáveis, sem API, banco de dados, autenticação ou persistência.

## Funcionalidades implementadas

- Painel inicial com resumo de pendências, tarefas próximas e matérias ativas.
- Listagem de tarefas com matéria, prazo, prioridade e status.
- Controles estruturais de filtro por matéria, status e prioridade.
- Formulário de cadastro de tarefa com campos rotulados e validação nativa para os obrigatórios.
- Navegação entre todas as páginas do protótipo.

## Tecnologias

- HTML5 semântico
- CSS3 responsivo

## Como executar

Não há dependências para esta etapa. Abra `src/index.html` em um navegador ou inicie um servidor estático a partir da raiz do repositório:

```bash
npx serve src
```

## Como testar

1. Abra a página inicial e use a navegação do cabeçalho.
2. Confira a listagem em `tarefas.html`.
3. Abra `nova-tarefa.html`, tente enviar o formulário sem preencher os campos obrigatórios e confirme a validação nativa.

O procedimento de verificação e as evidências estão em [docs/evidencias.md](docs/evidencias.md).

## Limitações conhecidas

- Os dados são exemplos estáticos e não são persistidos.
- Os filtros e o cadastro ainda não alteram a lista.
- Não há autenticação, API, banco de dados ou testes automatizados nesta etapa.

## Documentação

- [Proposta da Etapa 01](docs/proposta.md)
- [Documentação da Etapa 02](docs/etapa-02.md)
- [Arquitetura e decisões técnicas](docs/arquitetura.md)
- [Evidências de funcionamento](docs/evidencias.md)

## Estrutura do repositório

```text
├── docs/     # documentação do projeto e das entregas
├── src/      # páginas HTML e estilos
├── tests/    # reservado para testes futuros
└── README.md
```

## Autor

Weber Filho - Disciplina de Tecnologia e Construção de Software
