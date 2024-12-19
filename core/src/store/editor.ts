import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Monaco } from "@monaco-editor/react";
import { themes } from "@core/themes";
import type { Theme } from "@core/types/editor";
import type { editor } from "monaco-editor";
import type { ConsoleOutput } from "@core/types/worker";
// import * as prettier from "prettier/standalone";
// import parserBabel from "prettier/parser-babel";
// import parserBabel from "@babel/parser";
interface Tab {
  id: string;
  name: string;
  language: string;
  code: string;
  logs: ConsoleOutput[];
  logFormated: string;
}

interface EditorState {
  experimetalConsole: boolean;
  setExperimental: (value: boolean) => void;
  monaco: Monaco | null;
  editorRef: editor.IStandaloneCodeEditor | null;
  tabs: Tab[];
  activeTabId: string;
  theme: keyof typeof themes;
  code: string;
  running: boolean;
  setRunning: (value: boolean) => void;
  currentTab: (id: Tab["id"]) => Tab | undefined;
  setMonaco: (monaco: Monaco) => void;
  setEditorRef: (editor: editor.IStandaloneCodeEditor) => void;
  addTab: (tab: Omit<Tab, "id">) => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabCode: (id: string, code: string) => void;
  runCode: () => void;
  resetCode: () => void;
  clearConsole: (id: Tab["id"]) => void;
  setTheme: (theme: keyof typeof themes) => void;
  getCurrentTheme: () => Theme;
  changeNameTab: (id: string, name: string) => void;
  updateTabLog: (
    id: Tab["id"],
    logs: Tab["logs"],
    logFormated: Tab["logFormated"]
  ) => void;
}

const DEFAULT_CODE = `
  const add = (a: number, b: number) => a + b
  add(1, 2)
`;

const initialTabs: Tab[] = [
  {
    id: "1",
    name: "main.ts",
    language: "typescript",
    code: DEFAULT_CODE,
    logs: [],
    logFormated: "",
  },
];

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      experimetalConsole: true,
      monaco: null,
      running: false,
      editorRef: null,
      tabs: initialTabs,
      activeTabId: "1",
      theme: "oneDark",
      fontSize: 20,
      wordWrap: true,
      refreshTime: 1000,
      code: initialTabs[0].code,
      fontFamily: '"Cascadia Code", monospace',
      lineNumbers: true,
      layout: "horizontal",
      minimap: true,
      setExperimental: (experimetalConsole) => set({ experimetalConsole }),
      setRunning: (running) => set({ running }),
      currentTab: (id) => get().tabs.find((tab) => tab.id === id),
      setMonaco: (monaco) => set({ monaco }),
      setEditorRef: (editor) => set({ editorRef: editor ?? null }),

      addTab: (tab) => {
        const newTab = {
          ...tab,
          id: Math.random().toString(36).substring(7),
        };
        set((state) => ({
          tabs: [...state.tabs, newTab],
          activeTabId: newTab.id,
          code: newTab.code,
        }));
      },
      changeNameTab: (id, name) => {
        set((state) => {
          const index = state.tabs.findIndex((tab) => tab.id === id);
          if (index === -1) return state; // Si no encuentra el tab, no se realiza ningún cambio
          return {
            tabs: state.tabs.with(index, { ...state.tabs[index], name }),
          };
        });
      },

      removeTab: (id) => {
        set((state) => {
          const newTabs = state.tabs.filter((tab) => tab.id !== id);
          return {
            tabs: newTabs,
            activeTabId:
              id === state.activeTabId
                ? newTabs[0]?.id || ""
                : state.activeTabId,
          };
        });
      },

      setActiveTab: (id) => set({ activeTabId: id }),

      updateTabCode: (id, code) => {
        set((state) => {
          const index = state.tabs.findIndex((tab) => tab.id === id);
          if (index === -1) return state; // Si no encuentra la pestaña, no se realiza ningún cambio
          return {
            tabs: state.tabs.with(index, { ...state.tabs[index], code }),
            code: state.activeTabId === id ? code : state.code,
          };
        });
      },

      updateTabLog: (id, logs) => {
        set((state) => {
          const index = state.tabs.findIndex((tab) => tab.id === id);
          if (index === -1) return state; // Si no encuentra la pestaña, no se realiza ningún cambio
          return {
            tabs: state.tabs.with(index, {
              ...state.tabs[index],
              logs,
            }),
          };
        });
      },

      runCode: async () => {
        const state = get();
        const activeTab = state.tabs.find(
          (tab) => tab.id === state.activeTabId
        );

        if (!activeTab?.code) return;

        get().setRunning(true);

        try {
          const name = activeTab.name;

          // Crear una promesa para manejar el Worker
          const output: ConsoleOutput[] = await new Promise<ConsoleOutput[]>(
            (resolve, reject) => {
              const worker = new Worker(
                new URL("../workers/runCode.ts?worker", import.meta.url),
                {
                  type: "module",
                }
              );

              // Configurar un timeout de 10 segundos
              const timeout = setTimeout(() => {
                reject(new Error("El Worker excedió el tiempo de espera."));
                worker.terminate();
              }, 10000);

              // Enviar mensaje al Worker
              worker.postMessage({
                activeTabCode: activeTab.code,
                name,
                injectLogs: get().experimetalConsole,
              });

              // Manejar mensajes del Worker
              worker.onmessage = (event: MessageEvent) => {
                clearTimeout(timeout);
                resolve(event.data);
                worker.terminate();
              };

              // Manejar errores del Worker
              worker.onerror = (error) => {
                clearTimeout(timeout);
                reject(error);
                worker.terminate();
              };
            }
          );

          // Mostrar la salida formateada
          // prettier
          //   .format(output.map((log) => log.content).join("\n"), {
          //     parser: "babel",
          //     plugins: [parserBabel],
          //     printWidth: 80,
          //     singleQuote: true,
          //   })
          // .then((formatted) => {
          // });
          // Actualizar el log de la pestaña activa
          get().updateTabLog(state.activeTabId, output, "");
        } catch (error) {
          // Manejar errores y actualizar el log con el error
          get().updateTabLog(
            state.activeTabId,
            [
              {
                type: "error",
                content: error instanceof Error ? error.message : String(error),
                line: 0,
                column: 0,
                timestamp: Date.now(),
              },
            ],
            ""
          );
        } finally {
          // Asegurarse de que el estado de 'running' se actualice
          get().setRunning(false);
        }
      },

      resetCode: () => {
        const state = get();
        const activeTab = state.tabs.find(
          (tab) => tab.id === state.activeTabId
        );
        if (activeTab) {
          const index = state.tabs.findIndex((tab) => tab.id === activeTab.id);
          if (index === -1) return;

          set((state) => ({
            tabs: state.tabs.with(index, {
              ...state.tabs[index],
              code: initialTabs[0].code,
            }),
            code:
              state.activeTabId === activeTab.id
                ? initialTabs[0].code
                : state.code,
            output: [],
          }));
        }
      },

      clearConsole: (id) => {
        set((state) => {
          const index = state.tabs.findIndex((tab) => tab.id === id);
          if (index === -1) return state; // Si no encuentra la pestaña, no realiza cambios
          return {
            tabs: state.tabs.with(index, { ...state.tabs[index], logs: [] }),
          };
        });
      },

      setTheme: (theme) => {
        set({ theme });
        const currentTheme = themes[theme];
        if (get().monaco && get().editorRef) {
          get().monaco?.editor.defineTheme(theme, currentTheme.monaco);
          get().monaco?.editor.setTheme(theme);
        }
      },

      getCurrentTheme: () => themes[get().theme],
    }),
    {
      name: "editor",
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
        theme: state.theme,
        code: state.code,
        experimetalConsole: state.experimetalConsole,
      }),
    }
  )
);
