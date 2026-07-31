

![Captura de pantalla en ordenador](/packages/app/public/og.jpg)

<div align='center'>

### <img src="public/logo.svg" width='35' /> [Runts](https://runts.acbc.dev)
  ***Tu editor de playground para TypeScript/JavaScript***

</div>
<div align="center">

![](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)
![](https://img.shields.io/badge/Maintained%3F-Yes-brightgreen.svg)

</div>

¡Bienvenido a **RunTS**! Un playground de TypeScript/JavaScript ligero pero potente, construido con **Tauri**, **React** y **TypeScript**. Escribe y ejecuta código al instante en un entorno de worker aislado con salida en tiempo real.

## 🚀 Características

- **Monaco Editor** — el mismo editor que impulsa VS Code, con soporte completo para TypeScript
- **Nombres de pestañas en vivo** — los nombres de las pestañas se derivan de la primera línea de tu código y se actualizan mientras escribes
- **Editor multipestaña** — gestiona varios archivos con estado de pestañas persistente
- **Ejecución en tiempo real** — ejecuta código en un Web Worker aislado con captura de salida de consola y números de línea mapeados al código fuente
- **Asistente de IA** — chatea con modelos de OpenAI, Anthropic, Google o Mistral directamente dentro del editor
- **Paleta de comandos** — `Cmd+K` para acceso rápido a todas las acciones del editor
- **Temas y apariencia** — temas personalizados, configuración de fuentes y opciones de diseño
- **Soporte PWA** — instalable y funciona sin conexión
- **URLs de código compartido** — comparte fragmentos de código mediante URL

## 🛠 Stack Tecnológico

- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Frontend**: [React 19](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Escritorio**: [Tauri](https://tauri.app/)
- **Herramienta de compilación**: [Vite](https://vitejs.dev/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Gestión de estado**: [Zustand](https://github.com/pmndrs/zustand)
- **IA**: [Vercel AI SDK](https://sdk.vercel.ai/)
- **Transpilación de código**: [Babel Standalone](https://babeljs.io/)

## 📁 Configuración del Proyecto

### Requisitos previos

- **Node.js** v20 o superior
- **pnpm** v10 o superior
- **Rust** (solo necesario para la compilación de escritorio con Tauri)

### Instalación

```bash
git clone https://github.com/acbcdev/RunTS.git
cd RunTS
pnpm install
```

### Ejecución del Proyecto

```bash
pnpm dev          # Web version (Vite dev server)
pnpm tauri:dev    # Desktop app with hot reload
```

### Compilación

```bash
pnpm build        # Production web build
pnpm tauri:build  # Tauri desktop application
```

## 🧪 Pruebas

Las pruebas se ejecutan con [Vitest](https://vitest.dev/):

```bash
pnpm test       # Run test suite
pnpm test:ui    # Open Vitest UI
```

## ⚙️ Configuración

Las preferencias del editor, el tema, las claves del proveedor de IA y las opciones de diseño son completamente configurables a través del panel de ajustes o la Paleta de comandos. La configuración específica para escritorio se encuentra en `packages/app/src-tauri/tauri.conf.json`.

## 🤝 Contribuciones

¡Las contribuciones son muy apreciadas! Por favor, revisa la [guía de contribución](https://github.com/acbcdev/RunTS/blob/master/CONTRIBUTING.md) antes de abrir un pull request.

### Contribuyentes

<a href="https://github.com/acbcdev/runts/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=acbcdev/runts" />
</a>
