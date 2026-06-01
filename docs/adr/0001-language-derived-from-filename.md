# 1. Language derived from filename

Date: 2026-05-31

## Status

Accepted

## Context

A tab in RunTS needs a language: it drives Monaco syntax highlighting, whether
the code is executable in the worker, and which output panel (console / preview)
renders alongside the editor.

Until now each `Tab` carried a stored `language: string` field. This denormalized
the tab's state: the filename (`main.ts`) and the language (`typescript`) were two
independent fields that could drift out of sync. Renaming a tab's extension did not
change its language, and every new code path that created a tab had to remember to
set `language` correctly (it was defaulted to `"typescript"` in several places).

We are about to add more languages (Markdown, and beyond). We need a single,
unambiguous source of truth for a tab's language and a seam those future languages
plug into without rewiring the editor.

## Decision

Derive a tab's language **on read** from its filename extension. Remove the stored
`Tab.language` field entirely.

A small **language registry** (`features/editor/language/`) is the seam:

- `LanguageId` is a **closed union** (`"typescript" | "javascript" | "plaintext"`),
  not `string`. The compiler enforces exhaustiveness as languages are added.
- `LanguageDef` carries the per-language behaviour: the Monaco language id, an
  `execute` flag (can it run in the worker?), and an `OutputPanel` shape
  (`"console" | "preview" | "none"`).
- `langFromName(name?)` returns the full `LanguageDef` for a filename, applying the
  derivation rules (case-insensitive, last `.`-segment wins, unnamed → typescript,
  named-but-unknown → plaintext).

Language is recomputed wherever it is needed; there is no persisted field to keep in
sync. Existing nameless persisted tabs auto-absorb into the unnamed → typescript
default, so **no persist `version`/`migrate`** is required; the stale `language` key
left in localStorage is harmless.

## Consequences

- The filename is the single source of truth. Renaming a tab's extension re-tints the
  Monaco buffer and flips run/panel behaviour live — no extra UI or sync code.
- New tab-creation paths can no longer set a wrong language; there is nothing to set.
- Future languages plug in by adding a registry entry; the editor layout and run
  gating read `LanguageDef` and need no per-language branches.
- A buffer whose language is plaintext still has the global TS compiler options /
  extraLibs / completion providers registered. They are unused but harmless, so no
  teardown is needed.

## Alternatives considered

**Keep an explicit language picker / stored `language` field.** Rejected. It
denormalizes state (name vs language can desync), forces every tab-creation path to
set the field, and adds UI plus recompute paths for a flexibility RunTS does not need
— the filename already implies the language unambiguously. Deriving on read removes a
whole class of "language is wrong / out of sync" bugs.
