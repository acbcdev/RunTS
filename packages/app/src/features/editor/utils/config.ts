import { editor } from "monaco-editor";

export const EDITOR_CONFIG = {
	// Formatting options now come from config store
	detectIndentation: false,

	cursorStyle: "line",
	cursorWidth: 2,
	cursorBlinking: "expand",
	// GOOD
	automaticLayout: true,
	"semanticHighlighting.enabled": true,
	fontLigatures: true,
	fixedOverflowWidgets: true,
	glyphMargin: true,
	guides: {
		bracketPairs: true,
		indentation: true,
		bracketPairsHorizontal: true,
		highlightActiveBracketPair: true,
		highlightActiveIndentation: true,
	},
	inlineSuggest: { enabled: true },
	lightbulb: {
		enabled: editor.ShowLightbulbIconMode.On,
	},
	suggest: {
		insertMode: "insert", // Prefer insert over replace
		selectionMode: "always", // Selecciona sugerencias siempre al activar
		showStatusBar: true, // Muestra barra de estado en el widget
		preview: true, // Activa preview de sugerencia
		previewMode: "prefix", // Preview solo si el texto es prefijo
		showInlineDetails: true, // Muestra detalles en línea
		matchOnWordStartOnly: false, // Permite coincidencias en cualquier parte de la palabra
		localityBonus: true, // Prioriza sugerencias cercanas al cursor
		shareSuggestSelections: true, // Recuerda sugerencias seleccionadas
		snippetsPreventQuickSuggestions: true, // Evita sugerencias rápidas si hay snippet activo

		// Tipos de sugerencias a mostrar (solo los más relevantes para JS/TS)
		showMethods: true,
		showFunctions: true,
		showConstructors: true,
		showVariables: true,
		showConstants: true,
		showInterfaces: true,
		showKeywords: true,
		showSnippets: true,
		showClasses: true,
		showEnums: true,
		showEnumMembers: true,
		showProperties: true,
		showFields: true,
		showModules: true,
		showEvents: true,
		showOperators: true,
		showValues: true,
		showFiles: true,
		showFolders: true,
		showReferences: true,
		showUsers: true,
		showIssues: true,
		showColors: true,
		showWords: true,
		showStructs: true,
		showTypeParameters: true,
	},
	bracketPairColorization: {
		enabled: true,
		independentColorPoolPerBracketType: true,
	},
	gotoLocation: {
		multipleDeclarations: "goto",
		multipleImplementations: "goto",
		multipleDefinitions: "goto",
	},
	showDeprecated: true,
	showUnused: true,
	padding: {
		top: 4,
		bottom: 20,
	},
	renderValidationDecorations: "on",
	scrollbar: {
		vertical: "auto",
		horizontal: "auto",
		useShadows: false,
		verticalHasArrows: false,
		horizontalHasArrows: false,
		horizontalScrollbarSize: 10,
		verticalScrollbarSize: 10,
	},
	dragAndDrop: true,
	copyWithSyntaxHighlighting: true,
	autoClosingComments: "always",
	lineNumbersMinChars: 0,

	// Not
	// autoClosingBrackets: "always",
	// autoClosingQuotes: "always",
	// colorDecorators: true,

	// TO CHECK
	// scrollBeyondLastLine: false,
	// lineDecorationsWidth: 0,
	// lineNumbersMinChars: 2,
	// smoothScrolling: true,
	// mouseWheelZoom: true,

	// Editor UI Features
} satisfies editor.IStandaloneEditorConstructionOptions;

export const CONSOLE_EDITOR_CONFIG = {
	wordWrap: "on",
	language: "javascript",
	scrollbar: {
		horizontal: "visible",
		vertical: "auto",
	},
	readOnly: true,
	fontLigatures: true,
	padding: {
		top: 4,
		bottom: 200,
	},

	glyphMargin: false,
	automaticLayout: true,
	scrollBeyondLastLine: true,

	bracketPairColorization: {
		enabled: false,
	},
	cursorStyle: "block",
	cursorBlinking: "phase",
	codeLens: false,
	multiCursorLimit: 0,
	lineDecorationsWidth: 10,
	lineNumbersMinChars: 2,
	renderWhitespace: "selection",

	renderLineHighlight: "none",
	selectionHighlight: false,
} satisfies editor.IStandaloneEditorConstructionOptions;
