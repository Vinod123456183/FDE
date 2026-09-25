# Express + TypeScript Backend Setup

A beginner-friendly backend project using Node.js, Express, TypeScript, `ts-node`, and Nodemon.

This guide documents the full setup process, common problems encountered during development, and their fixes.

## 1. Project overview

This project creates a simple Express backend using TypeScript.

The first endpoint is `GET /`. It returns:

```text
Hello World
```

The development server runs at <http://localhost:3000>.

## 2. Create the project

```bash
mkdir 2026-tsx-install-with-express-backend
cd 2026-tsx-install-with-express-backend
npm init -y
```

`npm init -y` creates `package.json`.

## 3. Install dependencies

Install Express as a production dependency:

```bash
npm install express
```

Install the development dependencies:

```bash
npm install -D typescript ts-node nodemon @types/express @types/node
```

- **TypeScript** compiles and type-checks the project.
- **ts-node** runs TypeScript files directly during development.
- **Nodemon** restarts the server when files change.
- **@types/express** and **@types/node** provide TypeScript type definitions.

## 4. Initialize and configure TypeScript

Create the TypeScript configuration:

```bash
npx tsc --init
```

Replace the contents of `tsconfig.json` with:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

| Option | Purpose |
| --- | --- |
| `target` | JavaScript version to compile to |
| `module` | Uses CommonJS modules |
| `outDir` | Puts compiled JavaScript in `dist` |
| `rootDir` | Places TypeScript source files in `src` |
| `strict` | Enables strict TypeScript checking |
| `esModuleInterop` | Makes imports such as Express easier |
| `skipLibCheck` | Skips checking declaration files |
| `forceConsistentCasingInFileNames` | Prevents casing-related file problems |

## 5. Create the server

Create `src/index.ts`:

```ts
import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

The project structure is now:

```text
2026-tsx-install-with-express-backend/
├── src/
│   └── index.ts
├── node_modules/
├── package-lock.json
├── package.json
└── tsconfig.json
```

## 6. Configure `package.json`

Add a `dev` script. A working `package.json` can look like this:

```json
{
  "name": "2026-tsx-install-with-express-backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^5.2.1"
  },
  "devDependencies": {
    "@types/express": "^5.0.6",
    "@types/node": "^22.20.2",
    "nodemon": "^3.1.14",
    "ts-node": "^10.9.2",
    "typescript": "^5.9.3"
  }
}
```

Package versions can differ depending on when dependencies are installed.

> **Important:** JSON properties must be separated by commas. Without the comma after the `dev` script, npm reports `EJSONPARSE: Expected ',' or '}' after property value`.

## 7. Validate and run

Check the TypeScript configuration without generating compiled files:

```bash
npx tsc --noEmit
```

Start the development server:

```bash
npm run dev
```

You should see:

```text
Server running on http://localhost:3000
```

Open <http://localhost:3000>. The expected response is:

```text
Hello World
```

## 8. Common problems and fixes

### Invalid `package.json` (`EJSONPARSE`)

**Cause:** A missing comma in the `scripts` object.

Incorrect:

```json
"scripts": {
  "dev": "nodemon src/index.ts"
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

Correct:

```json
"scripts": {
  "dev": "nodemon src/index.ts",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

### Do not paste TypeScript into Command Prompt

TypeScript code belongs in `src/index.ts`, not in Command Prompt. For example, pasting `const app = express();` into CMD causes this error:

```text
'const' is not recognized as an internal or external command
```

Likewise, JSON belongs in `package.json` or `tsconfig.json`.

### `ts-node` and TypeScript compatibility

If `ts-node` crashes with an error such as the following, check the installed versions:

```text
TypeError: Cannot read properties of undefined (reading 'fileExists')
```

For this project, use TypeScript 5.9.3 with `ts-node` 10.9.2:

```bash
npm uninstall typescript
npm install -D typescript@5.9.3
npx tsc --version
npx ts-node --version
```

Expected versions:

```text
Version 5.9.3
v10.9.2
```

Then run `npm run dev` again.

## 9. Recommended development versions

| Tool | Version |
| --- | --- |
| Node.js | 22.14.0 |
| Express | 5.x |
| TypeScript | 5.9.3 |
| ts-node | 10.9.2 |
| Nodemon | 3.1.14 |

The key compatibility combination in this setup is TypeScript 5.9.3 with `ts-node` 10.9.2.

## 10. Final project structure

```text
2026-tsx-install-with-express-backend/
├── node_modules/
├── src/
│   └── index.ts
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

## 11. Development workflow

1. Create the project and run `npm init -y`.
2. Install Express, TypeScript, `ts-node`, Nodemon, and type definitions.
3. Run `npx tsc --init` and configure `tsconfig.json`.
4. Create `src/index.ts`.
5. Add the `dev` script to `package.json`.
6. Run `npx tsc --noEmit`.
7. Run `npm run dev`.
8. Visit <http://localhost:3000> and confirm that it returns `Hello World`.

## 12. Useful commands

```bash
# Install all dependencies from package.json
npm install

# Install TypeScript
npm install -D typescript

# Install a compatible TypeScript version
npm install -D typescript@5.9.3

# Install ts-node and Nodemon
npm install -D ts-node nodemon

# Install Express and Node types
npm install -D @types/express @types/node

# Check versions
npx tsc --version
npx ts-node --version

# Type-check without compiling
npx tsc --noEmit

# Compile TypeScript
npx tsc

# Start development server
npm run dev
```

## 13. Next steps

After the basic server is working, extend the project with:

- Express middleware
- Environment variables
- REST API routes
- Controllers and services
- Error handling and validation
- MongoDB or PostgreSQL
- Authentication
- Production builds, API tests, and deployment
