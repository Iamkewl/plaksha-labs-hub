# Contributing

## Prerequisites

- Node 20+
- npm 10+
- A Postgres database (local Docker or hosted)

## Setup

```bash
git clone <repo>
cd ILGC-Project
npm install
cp .env.example .env.local   # fill in DATABASE_URL + NEXTAUTH_SECRET
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open http://localhost:3000.

Demo accounts (after seed): see `prisma/seed.ts` for hashed credentials.

## Working on a feature

1. Branch from `master`: `git checkout -b feat/<short-name>`.
2. Read [conventions.md](./conventions.md) before touching anything.
3. Run `npm run lint` and `npm run build` before committing.
4. Use Conventional Commit messages (`feat(scope):`, `fix(scope):`).
5. Open a PR against `master`. Self-review the diff first.

## When to write an ADR

If your change involves a non-obvious architectural choice (a new library, a pattern change, a data-model trade-off), add a numbered ADR in `docs/adr/`. Use [adr/template.md](./adr/template.md).

## Code review

- Small PRs ship faster. Aim for < 400 changed lines.
- A second pair of eyes is required for any change to `prisma/schema.prisma`, `middleware.ts`, or `src/lib/auth*.ts`.

## Reporting bugs

Open an issue with: what you did, what you expected, what actually happened, and (if possible) a reproduction.
