# Context: RunTS

RunTS is a playground editor. The user writes code in a **Tab**, and the app
produces output. Until now every Tab held executable TypeScript/JavaScript;
multi-language support introduces Tabs whose output is *rendered*, not *run*.

## Glossary

### Language
The kind of content a Tab holds (e.g. `typescript`, `markdown`, `html`, `json`).
A Language is not just syntax highlighting — it determines whether the Tab is an
**Execute** language and which **Output Panel** is shown.

A Language is *derived from the Tab's name*: the filename extension decides it
(`notes.md` → markdown, `main.ts` → typescript). There is no separately stored
language — renaming a Tab's extension changes its Language. Derivation rule:
- An **unnamed** Tab defaults to **TypeScript** (the original RunTS behavior).
- A **named** Tab with no extension or an unrecognized one is **Plaintext**: not
  executed, no panel, plain editor.

"Convert to <Language>" (a Tab action) is sugar over renaming the extension — it
keeps the base name and swaps the extension, since the name is the single source
of truth.

### Execute
Whether a Language is *run*. An Execute language has its content transpiled and
run, and its console output captured (TypeScript, JavaScript; Python is a future
Execute language needing a new runtime). A non-Execute language is never run —
its content is shown as-is or transformed for display only.

### Output Panel
What fills the area beside the editor for a Tab. A Language declares exactly one
of three shapes:
- **Console** — captured logs. Used by Execute languages (TS, JS).
- **Preview** — a rendered visual view, supplied by the Language itself. Markdown
  renders a formatted document; HTML renders a sandboxed live page. Previews are
  language-specific and not interchangeable.
- **None** — no panel; the editor takes the full width. The Language relies on
  in-editor feedback only (JSON: validation squiggles + formatting, handled by
  the editor itself).

### Tab
A single named document in the editor (a "file"): its name (with extension), its
content, and its last output. The name's extension determines the Tab's Language;
there is no stored language field.
