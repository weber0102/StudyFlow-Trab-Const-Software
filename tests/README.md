# Testes

Os testes HTTP da Etapa 06 estão em `backend/test/api.test.js` e usam `node:test`, `assert` e Fetch nativos, sem dependências de teste adicionais.

```bash
cd backend
npm ci
npm test
```

São oito grupos de testes, com instâncias isoladas: CRUD completo, lista vazia, validação, normalização, defaults, duplicidade, IDs, JSON inválido, limites de corpo, Content-Type, CORS, endpoints de estudo e erro interno controlado.

A coleção `docs/postman/etapa-06.postman_collection.json` contém 28 requisições e 59 asserções. Para executá-la no Postman ou Newman, inicie a API antes. Os testes `npm test` não precisam de um servidor previamente aberto.

O roteiro de testes manuais, verificação dos três viewports e evidências está em `docs/etapa-06.md`. A verificação histórica da Etapa 02 continua em `docs/evidencias.md`.
