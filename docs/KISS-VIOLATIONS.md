# KISS Violations

Audit of the `packages/app` codebase against the project's **Simplicity First** rule.
Ranked by impact. All fixes are behavior-preserving unless noted.

---

## 1. `editor/editor-main/EditorMain.tsx` — every shortcut registered TWICE

`handleEditorDidMount` (lines 162–313) wires each shortcut with **both** `addCommand`
**and** `addAction` using the SAME keybinding. `addAction` already binds keybindings
*and* adds the context-menu entry, so the paired `addCommand` is redundant.

```ts
editor.addCommand(CtrlCmd | KeyR, runCode);                              // registers shortcut
editor.addAction({ id: "run-code", keybindings: [CtrlCmd | KeyR], run: runCode }); // SAME shortcut again
```

Duplicated for: Run, Chat, NewTab, UndoTabClose, Settings, Format, Generate, CmdK.

- **Fix:** delete each `addCommand` that has a matching `addAction`. Keep `addCommand`
  only for the two with no action (Alt+Z word-wrap, the duplicate Ctrl+K).
- Also delete ~40 lines of dead commented code (lines 95–99, 139–160).
- **Savings:** ~130 lines.

---

## 2. `tabs/tabs-store/tabs.ts` — one mutate-pattern copied 5×

`updateTab`, `changeNameTab`, `updateTabCode`, `updateTabLog`, `clearConsole` all repeat:

```ts
const index = state.tabs.findIndex(t => t.id === id);
if (index === -1) return state;
return { tabs: state.tabs.with(index, { ...state.tabs[index], <field> }) };
```

`updateTab` is already the generic version. The other four are special cases:

| Method                    | Becomes                              |
|---------------------------|--------------------------------------|
| `changeNameTab(id, name)` | `updateTab(id, { name })`            |
| `updateTabCode(id, code)` | `updateTab(id, { code })`            |
| `updateTabLog(id, log)`   | `updateTab(id, { log })`             |
| `clearConsole()`          | `updateTab(activeTabId, { log: "" })`|

- `newTab` + `restoreTab` are near-identical (same id/now/history push) — extract a
  shared `appendTab(tabData)`.
- **Dead state bug:** `updateTabCode` (line 120) writes a top-level `code:` field that
  is NOT in the `TabsStore` shape and is never read. Phantom — delete it.
- **Savings:** ~55 lines (5 mutators → 1 generic + 4 one-liners).

---

## 3. `ai/use-chat/useChat.ts` — streaming reducer tripled

Lines 77–101 and 105–113 repeat the same `setMessages(prev => prev.map(...))` patch
three times, differing only by `state: "streaming" | "done"`. Extract:

```ts
const patchMessage = (id: string, text: string, state: "streaming" | "done") =>
  setMessages(prev => {
    const last = prev.at(-1);
    if (!last || last.id !== id)
      return [...prev, { id, role: "assistant", parts: [{ type: "text", text, state }] }];
    return prev.map(m => m.id === id ? { ...m, parts: [{ type: "text", text, state }] } : m);
  });
```

- **Separate bug (not KISS):** `handleRegenerate` (lines 148–151) — `lastUserMessage`
  is a part object, so `typeof !== "string"` is ALWAYS true and regenerate is dead code.
- **Savings:** ~25 lines.

---

## 4. `ai/code-widget/GenerateCodeWidget.tsx` — focus hack + wrong event

- Lines 45–59: `focusInput()` calls `.focus()`, then `setTimeout(100)` to `.focus()`
  AGAIN. Cargo-cult double-focus. Use `autoFocus` or a single focus call.
- Line 71: editor width tracked via `onDidChangeModelDecorations` — fires on EVERY
  decoration change (typing, linting), not resize. Use `onDidLayoutChange`.
- **Savings:** small, but removes wasteful re-renders.

---

## Checked — NOT violations

- `common/command/useCommandItems.ts` (532 lines) — flat declarative command data.
  Verbose and repetitive keywords, but it's CONFIG, not logic. Data-driving it would be
  premature abstraction. LEAVE.
- `editor/run-code/worker.ts` — reasonable. Minor: all four `console` methods alias the
  same `log` fn, so output `type` is always `"log"` (error/warn never differentiated) —
  a feature gap, not a KISS issue.
- `common/themes/index.ts` (682 lines) and `*.test.ts` files — data/tests.

---

## Fix order

1. `EditorMain.tsx` — biggest win (~130 lines, zero behavior change)
2. `tabs.ts` — collapse mutators + delete phantom `code` field (~55 lines)
3. `useChat.ts` — extract `patchMessage` (~25 lines)
4. `GenerateCodeWidget.tsx` — focus + event (small)

**Total: ~210 lines removable, zero behavior change** (except the already-dead
regenerate path and phantom field).
