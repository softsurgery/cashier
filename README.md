# Cashier

A highly abstracted **Electron + Angular** desktop application for point-of-sale operations. This project combines the power of Electron with Angular's robust framework to deliver a production-grade desktop application with clean architecture patterns.

## 🏗️ Architecture Overview

### Highly Abstracted Layers

- **Main Process** (`src-electron/main.ts`) - Electron main process with database connectivity
- **Preload Script** (`src-electron/preload.ts`) - Secure IPC bridge between main and renderer
- **Module-Based Backend** (`src-electron/modules/`) - Organized business logic with:
  - **DTOs** - Data Transfer Objects for type-safe communication
  - **Entities** - Database entity definitions
  - **Repositories** - Data access abstraction layer
  - **Services** - Business logic encapsulation
- **Renderer Process** (`src/`) - Angular frontend with:
  - Standalone components
  - State management stores
  - Route-based page organization
  - Reusable UI component library

### IPC Communication

Type-safe inter-process communication between Electron main and renderer processes through well-defined IPC channels and handlers.

## 🚀 Development

Start the development server:

```bash
npm run electron:dev
```

This runs both the Electron main process and Angular development server with hot-reload.

## 🧪 Testing

Run unit tests with [Vitest](https://vitest.dev/):

```bash
npm test
```

## 🔨 Building

Build for production:

```bash
npm run build
```

Compiled artifacts are stored in the `dist/` and `dist-electron/` directories.

## 📦 Project Structure

- **`src/`** - Angular renderer process (UI components, pages, services, stores)
- **`src-electron/`** - Electron main process (backend logic, database, IPC handlers)
- **`libs/ui/`** - Shared UI component library
- **`dist/`** - Built Angular application
- **`dist-electron/`** - Built Electron main process

## 🎯 Key Features

- Clean separation of concerns with abstracted layers
- Type-safe IPC communication
- Module-based backend architecture
- Reusable component library
- State management with stores
- Database integration
- Local Storage Management
