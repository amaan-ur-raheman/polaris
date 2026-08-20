export interface ProjectTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    tags: string[];
    files: TemplateFile[];
}

export interface TemplateFile {
    path: string;
    content: string;
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
    {
        id: "react-ts",
        name: "React + TypeScript",
        description: "Modern React app with TypeScript, Vite, and Tailwind CSS",
        icon: "⚛️",
        tags: ["react", "typescript", "vite"],
        files: [
            {
                path: "package.json",
                content: `{
  "name": "my-react-app",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.1"
  }
}`,
            },
            {
                path: "index.html",
                content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
            },
            {
                path: "vite.config.ts",
                content: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});`,
            },
            {
                path: "tsconfig.json",
                content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}`,
            },
            {
                path: "src/main.tsx",
                content: `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
            },
            {
                path: "src/App.tsx",
                content: `function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Hello, World!</h1>
      <p>Welcome to your new React + TypeScript app.</p>
    </div>
  );
}

export default App;`,
            },
            {
                path: "src/vite-env.d.ts",
                content: `/// <reference types="vite/client" />`,
            },
        ],
    },
    {
        id: "nextjs-ts",
        name: "Next.js + TypeScript",
        description: "Full-stack Next.js app with App Router and TypeScript",
        icon: "▲",
        tags: ["nextjs", "typescript", "react"],
        files: [
            {
                path: "package.json",
                content: `{
  "name": "my-nextjs-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5"
  }
}`,
            },
            {
                path: "next.config.js",
                content: `/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;`,
            },
            {
                path: "tsconfig.json",
                content: `{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}`,
            },
            {
                path: "src/app/layout.tsx",
                content: `export const metadata = {
  title: "My Next.js App",
  description: "Created with Polaris",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
            },
            {
                path: "src/app/page.tsx",
                content: `export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Hello, World!</h1>
      <p>Welcome to your new Next.js app.</p>
    </main>
  );
}`,
            },
        ],
    },
    {
        id: "vue-ts",
        name: "Vue + TypeScript",
        description: "Modern Vue 3 app with Composition API and TypeScript",
        icon: "💚",
        tags: ["vue", "typescript", "vite"],
        files: [
            {
                path: "package.json",
                content: `{
  "name": "my-vue-app",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.5.3",
    "vite": "^5.4.1",
    "vue-tsc": "^2.0.0"
  }
}`,
            },
            {
                path: "index.html",
                content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Vue App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`,
            },
            {
                path: "src/main.ts",
                content: `import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");`,
            },
            {
                path: "src/App.vue",
                content: `<template>
  <div style="padding: 2rem; font-family: sans-serif">
    <h1>Hello, World!</h1>
    <p>Welcome to your new Vue app.</p>
  </div>
</template>

<script setup lang="ts">
</script>`,
            },
        ],
    },
    {
        id: "html-css",
        name: "HTML + CSS",
        description: "Simple static site with HTML, CSS, and vanilla JavaScript",
        icon: "🌐",
        tags: ["html", "css", "javascript"],
        files: [
            {
                path: "index.html",
                content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Website</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Welcome to your new website.</p>
  <script src="script.js"></script>
</body>
</html>`,
            },
            {
                path: "styles.css",
                content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 1rem;
}

p {
  color: #666;
  line-height: 1.6;
}`,
            },
            {
                path: "script.js",
                content: `console.log("Hello, World!");`,
            },
        ],
    },
    {
        id: "blank",
        name: "Blank Project",
        description: "Start from scratch with no predefined files",
        icon: "📄",
        tags: ["blank"],
        files: [],
    },
];

export function getTemplateById(id: string): ProjectTemplate | undefined {
    return PROJECT_TEMPLATES.find((t) => t.id === id);
}
