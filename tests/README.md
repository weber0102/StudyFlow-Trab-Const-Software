# Testes

Os testes estão em `backend/test/` e usam `node:test`, `assert`, Fetch e SQLite nativos do Node.js 24, sem dependências de teste adicionais.

```bash
cd backend
npm ci
npm test
```

São 16 testes com instâncias isoladas. `api.test.js` preserva a regressão do CRUD/HTTP da Etapa 06. `database.test.js` verifica matérias, relacionamentos, restrições, seed, SQL Injection e falhas reais de leitura/gravação. `persistence.test.js` inicia e encerra três processos de servidor com o mesmo arquivo SQLite: confirma criação/alteração/histórico após reinício e exclusão mantida depois de outro reinício.

A coleção atual `docs/postman/etapa-07.postman_collection.json` contém 33 requisições e 70 asserções e cria/remove seus próprios registros. Inicie a API antes de executá-la no Postman ou Newman. `npm test` não precisa de um servidor aberto e não altera o banco de uso normal. A coleção histórica da Etapa 06 foi preservada e exige as matérias do seed.

`npm run evidence`, dentro de backend, repete a prova multiprocesso e gera `docs/evidencias/etapa-07/persistencia-http.json`, também com uma falha de gravação em banco somente leitura. Os detalhes dessa falha no console do servidor são esperados; a resposta HTTP é controlada.

O roteiro manual, resultados, três viewports e evidências estão em `docs/etapa-07.md`. As verificações históricas continuam nas documentações das etapas anteriores.
