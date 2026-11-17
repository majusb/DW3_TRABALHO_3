# DW3 - Trabalho 3 - Pastejo Rotacionado

Base montada no mesmo molde do Trabalho 2 (clínica).

## O que já está pronto (Yasmim)
- **Base**: login (JWT), `app.js` do back e do front, `database`, `routes`, `views` (layout, home, login, error), `public`, `package.json`, `.env`.
- **animal** (tabela simples): back (`apps/animal`: model, controller, test) + front (`apps/animal`: vwLst, vwForm) + `routes/rtAnimal.js` + rotas no `router.js` e no `app.js`.
- **alocado** (N:N animal x piquete): back (`apps/alocado`) + front (`apps/alocado`) + `routes/rtAlocado.js` + rotas.
- **SQL**: `pastejoDatabase.sql` com `usuarios`, `animal` e `alocado` (+ usuário de teste girl/girl).

## O que falta (Maria Julia)
- Módulos **pasto** e **piquete** (back + front), no mesmo molde.
- Criar as tabelas **pasto** e **piquete** no `pastejoDatabase.sql` (tem o modelo comentado lá) e descomentar a FK `fk_piquete` em `alocado`.
- Descomentar as linhas marcadas com "Maria Julia:" no `router.js`, no `app.js`, no `layout.njk` e adicionar os cards no `home.njk`.
- **Docker**: configurar os arquivos conforme a aula (os `Dockerfile` vieram da base, mas é a sua parte verificar/ajustar).

## Como rodar (teste local, sem Docker)
1. No `backend/backend.env`, troque `DB_HOST=host.docker.internal` por `DB_HOST=localhost`.
2. Crie o banco: `CREATE DATABASE pastejo;` e rode o `pastejoDatabase.sql`.
3. `cd backend && npm install && node app.js`  (porta 40000)
4. `cd frontend && npm install && node app.js`  (porta 40100)
5. Abra `http://localhost:40100`, login **girl** / senha **girl**.

Campos (do DER): animal {animalid, nome, datanasc, removido} | alocado {alocadoid, animalidifk, piqueteidfk, datainicio, datafinal, removido}. Soft delete pelo campo `removido`.
