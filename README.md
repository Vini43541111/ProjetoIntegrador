# G9 — Módulo de Convênios

Módulo de Convênios do **Sistema de Saúde Integrado** (Projeto Integrador 2026).
Responsável por gerenciar planos de saúde, vincular pacientes e validar cobertura de procedimentos.

## Stack

- **Back-end:** Node.js + Express
- **Banco de Dados:** PostgreSQL
- **Front-end:** React (em pasta separada)
- **Autenticação:** JWT

## Integrações

- **Consome:** G1 (Pacientes) — valida o paciente no momento do vínculo
- **Fornece:** G10 (Faturamento) e G13 (Autorização) — dados de cobertura

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# edite o .env com as credenciais do seu PostgreSQL

# 3. Criar o banco e rodar as migrations
# (criar o banco convenios_g9 no PostgreSQL primeiro)
npm run migrate

# 4. Subir o servidor
npm run dev
```

O servidor sobe por padrão na porta `3009`. Teste com:

```bash
curl http://localhost:3009/health
```

## Estrutura de pastas

```
src/
  config/        conexão com o banco
  controllers/   recebem a requisição e chamam os services
  services/      regras de negócio (inclui cliente do G1)
  repositories/  acesso ao banco (queries)
  routes/        definição dos endpoints
  middlewares/   autenticação JWT, etc.
  utils/         funções auxiliares
db/
  migrations/    scripts de criação do banco
tests/           testes automatizados
```

## Endpoints principais

| Método | Rota | Descrição | RF |
|--------|------|-----------|-----|
| POST | /planos | Cadastrar plano | RF01 |
| GET | /planos | Consultar planos | RF07 |
| PUT | /planos/:id | Editar plano | RF02 |
| PATCH | /planos/:id/status | Ativar/desativar | RF03 |
| POST | /pacientes/:id/plano | Vincular paciente | RF04 |
| PUT | /pacientes/:id/plano | Atualizar vínculo | RF05 |
| GET | /pacientes/:id/plano | Consultar vínculo | RF08 |
| GET | /cobertura | Validar cobertura | RF06 |

## Equipe

- (integrante 1)
- (integrante 2)
- (integrante 3)

> Documentação completa da API: _a definir (E4)_
