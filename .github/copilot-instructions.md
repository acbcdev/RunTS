<project>
  <name>Runts</name>
  <description>
    A JavaScript/TypeScript playground running in a Web Worker with instant code execution and a “Quick Console” that injects a console.log for every expression.
  </description>
  <stack>
    <tech>React</tech>
    <tech>TypeScript</tech>
    <tech>Tailwind CSS</tech>
    <tech>shadcn/ui</tech>
    <tech>Vite</tech>
    <tech>@monaco-editor/react</tech>
    <tech>Zustand</tech>
  </stack>
</project>

<paths>
  <path alias="root" value="src"/>
</paths>

<rules>
  <rule>Ask before any breaking change.</rule>
  <rule>Before starting a feature, list affected folders/files and what will change.</rule>
  <rule>Prefer TypeScript everywhere; ask if types are unclear.</rule>
  <rule>Use shadcn/ui props (e.g., size, variant) instead of raw className where applicable.</rule>
  <rule>Optimize for performance (selectors, memoization, lazy imports, Web Worker offloading).</rule>
  <rule>If a new shadcn/ui component is needed, request it via CLI:
    <example_shadcn_cli>bunx --bun shadcn@latest add &lt;ComponentName&gt;</example_shadcn_cli>
  </rule>
  <rule>Don’t use barrel files (no index.ts re-exports).</rule>
  <rule>Don’t add m-&lt;number&gt; classes on &lt;DropdownMenuItem /&gt;.</rule>
  <rule>Apply S.O.L.I.D. principles.</rule>
  <rule>Make components reusable and composable.</rule>
  <rule>Split long components; if too many props, introduce React Context.</rule>
  <rule>No inline styles; use Tailwind utilities.</rule>
  <rule>Use custom Tailwind color tokens (CSS vars) for text/bg/border.</rule>
  <rule>File-scoped routing: each route has its own folder with page.tsx.</rule>
  <rule>Avoid setting text-foreground; it’s the default color.</rule>
  <rule>Use arrow functions for components.</rule>
  <rule>Names (variables, functions, identifiers) in English.</rule>
</rules>

<coding_style>
<principle>Use lucide-react for icons.</principle>
<principle>Prefer functional components.</principle>
<principle>Prioritize readability and maintainability.</principle>
<principle>Use descriptive, consistent names.</principle>
<principle>Files: PascalCase. Folders: camelCase. Components: UpperCamelCase. Utilities/helpers: camelCase.</principle>
</coding_style>

<ui>
  Always use shadcn/ui and its props.
  <example_ui>
    &lt;Button size="lg" variant="destructive"&gt;Delete&lt;/Button&gt;
    &lt;p className="text-foreground"&gt;Hello&lt;/p&gt;
  </example_ui>
</ui>

<theme>
  <colors format="css-variables">
    --color-background, --color-foreground, --color-card, --color-card-foreground,
    --color-popover, --color-popover-foreground, --color-primary, --color-primary-foreground,
    --color-secondary, --color-secondary-foreground, --color-muted, --color-muted-foreground,
    --color-accent, --color-accent-foreground, --color-destructive, --color-destructive-foreground,
    --color-border, --color-input, --color-ring,
    --color-chart-1, --color-chart-2, --color-chart-3, --color-chart-4, --color-chart-5,
    --color-sidebar, --color-sidebar-foreground, --color-sidebar-primary, --color-sidebar-primary-foreground,
    --color-sidebar-accent, --color-sidebar-accent-foreground, --color-sidebar-border, --color-sidebar-ring
    <use_shadcn_ui>Use in classNames, e.g., "bg-sidebar text-sidebar-foreground".</use_shadcn_ui>
  </colors>
</theme>

<tasks>
  <task>When adding a route, scaffold: folder + page.tsx + components/.</task>
  <task>Create strongly-typed hooks and Zustand slices with selectors.</task>
</tasks>

<workflow>
  <step name="PLAN">
    <task>List affected folders/files and justify changes.</task>
    <task>Outline data flow, state updates, and involved UI components.</task>
    <task>Flag potential breaking changes and request approval.</task>
  </step>
  <step name="IMPLEMENT">
    <task>Proceed only after agreement.</task>
    <task>Use TypeScript for all code; share types from `types/`.</task>
    <task>Keep platform entrypoints minimal (e.g., Tauri commands or extension stubs); move business logic to `lib/`.</task>
  </step>
  <step name="VERIFY">
    <task>Provide brief test notes: happy path + key edge cases.</task>
    <task>Run a performance checklist (selectors, memo/useCallback, lazy loading, deps).</task>
    <task>Check basic a11y (ARIA, roles, keyboard navigation).</task>
  </step>
</workflow>

<folder_structure>

- src/
  - components/ # Reusable shared UI
  - const/ # Constants & config
  - context/ # React providers
  - hooks/ # Custom hooks
  - lib/ # Utilities/helpers
  - store/ # Zustand slices
  - types/ # Global TS types
  - svg/ # SVG assets
  - themes/ # Theme definitions
  - workers/ # Web Workers
  - src-tauri/ # Tauri-specific code

</folder_structure>

<pending_features>
<feature>Implement a global error boundary.</feature>
<feature>Make Tauri app work.</feature>
<feature>Theme creator.</feature>
<feature>Allow installing npm packages and running them in the editor.</feature>
<feature>Customizable editor layout.</feature>
<feature>Better tab/shortcut workflow.</feature>
<feature>Fix UI issues on chat aside.</feature>
</pending_features>
