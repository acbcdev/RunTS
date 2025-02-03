import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Editor } from "@monaco-editor/react";
import { useApparenceStore } from "@/store/apparence";
import { useShallow } from "zustand/react/shallow";
const components = {
	code: ({ className, children }) => {
		const theme = useApparenceStore(useShallow((state) => state.theme));
		const match = /language-(\w+)/.exec(className || "");
		const code = `\n${String(children).trim()}\n`;
		const height = code.split("\n").length * 20;
		const codeContent = String(children).replace(/\n$/, "");
		const copyToClipboard = () => {
			navigator.clipboard.writeText(codeContent);
		};
		const lang = ["tsx", "jsx"].includes(match?.[1] ?? "")
			? "javascript"
			: match?.[1];
		// Calcula el número de líneas

		return match ? (
			<section className=" overflow-hidden  my-2  rounded-sm ">
				<header className="flex z-50 items-center justify-between bg-header py-1 px-2">
					<span className="px-5 text-foreground/90">{match[1]}</span>
					<nav className=" ">
						<Button variant={"ghost"} size={"sm"} onClick={copyToClipboard}>
							<Copy />
						</Button>
					</nav>
				</header>
				<div className="relative">
					{/* <div className="absolute inset-0 z-10 " /> */}
					<Editor
						language={lang}
						height={height}
						theme={theme}
						value={code}
						options={{
							readOnly: true,
							renderLineHighlight: "none",
							minimap: {
								enabled: false,
							},
							// wordWrap: "on",
							lineNumbers: "off",
							lineNumbersMinChars: 3,
							overviewRulerLanes: 0,
							automaticLayout: true,
							scrollBeyondLastLine: false,
							contextmenu: false,

							scrollbar: {
								// scrollByPage: false,
								handleMouseWheel: false,
								horizontal: "auto",
								vertical: "hidden",
							},
						}}
					/>
				</div>
			</section>
		) : (
			<code className="bg-background/60  text-foreground px-2 py-1  rounded-sm">
				{children}
			</code>
		);
	},
	pre: ({ children }) => <>{children}</>,
	p: ({ node, children, ...props }) => {
		return (
			<p className="my-1 leading-7 " {...props}>
				{children}
			</p>
		);
	},
	ol: ({ node, children, ...props }) => {
		return (
			<ol className="list-decimal list-outside ml-4" {...props}>
				{children}
			</ol>
		);
	},
	li: ({ node, children, ...props }) => {
		return (
			<li className=" py-1 leading-7" {...props}>
				{children}
			</li>
		);
	},
	ul: ({ node, children, ...props }) => {
		return (
			<ul className="list-disc my-1 list-outside ml-4" {...props}>
				{children}
			</ul>
		);
	},
	strong: ({ node, children, ...props }) => {
		return (
			<span className="font-bold" {...props}>
				{children}
			</span>
		);
	},
	br: ({ ...props }) => {
		return <br className="m-10" {...props} />;
	},
	a: (props) => (
		<a
			target="_blank"
			rel="noreferrer"
			className=" hover:underline text-accent"
			{...props}
		>
			{props.children}
		</a>
	),
	h1: ({ node, children, ...props }) => {
		return (
			<h1 className="text-4xl font-black mt-6 mb-2" {...props}>
				{children}
			</h1>
		);
	},
	h2: ({ node, children, ...props }) => {
		return (
			<h2 className="text-3xl font-black mt-6 mb-2" {...props}>
				{children}
			</h2>
		);
	},
	h3: ({ node, children, ...props }) => {
		return (
			<h3 className="text-2xl font-black mt-6 mb-2" {...props}>
				{children}
			</h3>
		);
	},
	h4: ({ node, children, ...props }) => {
		return (
			<h4 className="text-xl font-bold mt-6 mb-2" {...props}>
				{children}
			</h4>
		);
	},
	h5: ({ node, children, ...props }) => {
		return (
			<h5 className="text-lg font-semibold mt-6 mb-2" {...props}>
				{children}
			</h5>
		);
	},
	h6: ({ node, children, ...props }) => {
		return (
			<h6 className="text-base font-semibold mt-6 mb-2" {...props}>
				{children}
			</h6>
		);
	},
	blockquote: ({ node, children, ...props }) => {
		return (
			<blockquote
				className="border-l-4 border-accent my-3 pl-4 text-sm"
				{...props}
			>
				{children}
			</blockquote>
		);
	},
	kbd: ({ node, children, ...props }) => {
		return (
			<kbd
				className="border border-accent rounded-md px-2 py-1 text-sm"
				{...props}
			>
				{children}
			</kbd>
		);
	},
	table: ({ node, children, ...props }) => {
		return (
			<table className="table-auto border border-muted" {...props}>
				{children}
			</table>
		);
	},
	thead: ({ node, children, ...props }) => {
		return (
			<thead className="text-left border border-muted" {...props}>
				{children}
			</thead>
		);
	},
	tbody: ({ node, children, ...props }) => {
		return (
			<tbody className="divide-y border  border-muted divide-border" {...props}>
				{children}
			</tbody>
		);
	},
	tr: ({ node, children, ...props }) => {
		return (
			<tr className=" border border-muted" {...props}>
				{children}
			</tr>
		);
	},
	td: ({ node, children, ...props }) => {
		return (
			<td className="p-2 border border-muted" {...props}>
				{children}
			</td>
		);
	},
	th: ({ node, children, ...props }) => {
		return (
			<th className="p-2 border border-muted" {...props}>
				{children}
			</th>
		);
	},
	hr: ({ node, children, ...props }) => {
		return <hr className="my-4 border-muted" {...props} />;
	},
} satisfies Components;

export default function Markdown({ children }: { children: string }) {
	return (
		<ReactMarkdown
			className="prose text-wrap dark:prose-invert "
			components={components}
			remarkPlugins={[remarkGfm]}
		>
			{children}
		</ReactMarkdown>
	);
}
