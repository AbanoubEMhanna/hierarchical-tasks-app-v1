# Hierarchical Task Management System


## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `api`: a [Nest.js](https://nestjs.com/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd hierarchical-tasks-app-v1
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd hierarchical-tasks-app-v1
pnpm dev
```