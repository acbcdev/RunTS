<project>
  <name>Runts</name>
  <description>
  A JavaScript/TypeScript Playground that run in a web worker and has features like instant code execution, Quick Console that its inject a console.log for every expression code.
  </description>
  <stack>
    <tech>React</tech>
    <tech>TypeScript</tech>
    <tech>Tailwind CSS</tech>
    <tech>shadcn/ui</tech>
    <tech>Vite.js</tech>
    <tech>MonacoEditor/react</tech>
    <tech>Zustand</tech>
  </stack>
</project>

<paths>
  <path alias="root" value="src"/>
</paths>
<rules>
  <rule>Ask before any breaking change.</rule>
  <rule>before starting making a feature, explain which folders will be affected. and what you plan to change.</rule>
  <rule>Prefer TypeScript. If unsure, ask about types.</rule>
  <rule>Use shadcn/ui props (size, variant) instead of raw className for components.</rule>
  <rule>don't forget the code must be with performance in mind.</rule>
  <rule>If you need a new component, from shadcn/ui. resquest using his CLI
  <example_shadcn_cli>
    bunx --bun shadcn@latest add <ComponentName>
  </example_shadcn_cli>
  </rule>
  <rule>Don't use barrel files.</rule>
  <rule>Don't add m-<number> margin classes. on <DropdownMenuItem /> components</rule>
  <rule>Always use S.O.L.I.D principles.</rule>
  <rule>Make components reusable and composable.</rule>
  <rule>When a component is too long, split it into smaller subcomponents but if there are a big number of props, consider using a React Context.</rule>
  <rule>No inline styles. Use Tailwind utility classes.</rule>
  <rule>Use custom Tailwind color tokens (CSS vars) for text/bg/border.</rule>
  <rule>File-scoped routing: each route has its own folder with page.tsx.</rule>
</rules>
<coding_style>
  <principle>Prefer functional components over class components.</principle>
  <principle>Prioritize readability and maintainability.</principle>
  <principle>Use descriptive names for variables and functions.</principle>
  <principle>Names, identifiers, and variables in English.</principle>
  <principle>For new Files use PascalCase naming convention.</principle>
  <principle>For new folders use CamelCase naming convention.</principle>
  <principle>For new components use UpperCamelCase naming convention.</principle>
  <principle>For new utilities/helpers use camelCase naming convention.</principle>
</coding_style>

<ui>
  siempre usa shadcn/ui y sus props
  <example_ui>
    <Button size="lg" variant="destructive">Delete</Button>
    <p className="text-foreground">Hello</p>
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
    <use_shadcn_ui>use on classNames like "bg-sidebar text-sidebar-foreground"</use_shadcn_ui>
  </colors>
</theme>

<tasks>
  <task>When adding a route, scaffold folder + page.tsx + components/.</task>
  <task>Create strongly-typed hooks and Zustand slices with selectors.</task>
</tasks>

<workflow>
  <step name="PLAN">
    <task>List affected folders/files and justify the reason for the changes.</task>
    <task>Outline the data flow, state changes, and UI components involved.</task>
    <task>Identify any potential breaking changes and explicitly ask for approval before proceeding.</task>
  </step>
  <step name="IMPLEMENT">
    <task>This Part Make only When a Agreement is Reached</task>
    <task>Use TypeScript for all new code. Export and reuse shared types from `types/`.</task>
    <task>Keep WXT entrypoints (e.g., `background.ts`, `content.ts`) minimal. Move all business logic to `lib/`.</task>
  </step>
  <step name="VERIFY">
    <task>Include brief test notes covering the happy path and key edge cases.</task>
    <task>Perform a performance checklist review (e.g., use of selectors, `memo`/`useCallback`, lazy loading, and dependency arrays).</task>
    <task>Verify basic accessibility (e.g., ARIA labels, roles, and keyboard navigation).</task>
  </step>
</workflow>

<folder_structure>
src/
components/ # Reusable shared UI
const/ # Constants & config
context/ # React providers
hooks/ # Custom hooks
lib/ # Utilities/helpers
store/ # Zustand slices
types/ # Global TS types
svg/ # SVG assets
themes/ # Theme definitions
workers/ # Web Workers
src-tauri/ # Tauri-specific code
</folder_structure>

<pending_features>
<feature>Implement a global error boundary.</feature>
<feature>make tauri app works</feature>
<feature>Creator of themes</feature>
<feature>npm package for the app the user can install npm package a run in the editor</feature>
<feature>Implement a way to customize the editor layout.</feature>
<feature>Implement a better way of works tabs shortcuts</feature>
<feature>Fix ui issues on chat aside</feature>
</pending_features>
