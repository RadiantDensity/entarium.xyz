# Entarium Monorepo

This is the monorepo for Entarium, a modular artist platform and infrastructure.

## Structure

- `/apps` — All standalone frontends and backends (web, api, admin, etc)
- `/packages` — Shared code (UI components, db schema, contracts, utils, types)
- `/scripts` — DevOps, setup, automation
- `/docs` — Developer and platform documentation
- `/.github` — GitHub Actions/workflows

## Quick Start

1. Install pnpm globally: `npm i -g pnpm`
2. Install dependencies: `pnpm install`
3. Start dev server(s): `pnpm --filter web dev`, etc.
