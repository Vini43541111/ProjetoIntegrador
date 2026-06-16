# Convênios G9 — Front-end

Interface React do módulo de Convênios (Sistema de Saúde Integrado).
Consome a API do back-end (Node + Express).

## Stack
- React (Create React App)
- React Router
- Tailwind CSS

## Telas
- **Planos** — cadastro, listagem e ativar/desativar planos
- **Vínculo** — vincular paciente a plano e consultar vínculo
- **Cobertura** — validar cobertura de procedimento

## Como rodar

```bash
npm install
npm start
```

O app sobe em http://localhost:3000 e faz proxy para a API em
http://localhost:3009 (configurado no package.json).

Se a API estiver em outra URL, crie um arquivo `.env`:

```
REACT_APP_API_URL=http://localhost:3009
```

## Pré-requisito
O back-end (API de Convênios) precisa estar rodando para o front funcionar.
