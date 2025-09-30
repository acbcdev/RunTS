import { Editor } from "@monaco-editor/react";
import { Copy, CopyCheck, FilePlus2 } from "lucide-react";
import { useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { useShallow } from "zustand/react/shallow";
import { useApparenceStore } from "../../settings/appearance-store/apparence";
import { useTabsStore } from "../../tabs/tabs-store/tabs";
import { Button } from "../../ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../../ui/tooltip";

const components = {
	code: ({ className, children }) => {
		const theme = useApparenceStore(useShallow((state) => state.theme));
		const fontFamily = useApparenceStore(
			useShallow((state) => state.fontFamily),
		);
		const newTab = useTabsStore(useShallow((state) => state.newTab));

		const match = /language-(\w+)/.exec(className || "");
		const code = String(children).trim();
		const height = code.split("\n").length * 19 + 8 * 2;
		const [copied, setCopied] = useState(false);
		const copyToClipboard = () => {
			navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		};
		const lang = ["tsx", "jsx"].includes(match?.[1] ?? "")
			? "javascript"
			: match?.[1];

		return match ? (
			<section className=" group/code-block bg-background  my-2 h-full  rounded-sm ">
				<div className="relative h-full">
					<header className="flex z-50 duration-300 absolute items-center top-0 right-2 rounded-md opacity-0 group-hover/code-block:opacity-100 translate-y-[-50%] bg-header gap-x-1 p-0.5">
						{/* <span className="px-5 text-foreground/90">{match[1]}</span> */}
						<TooltipProvider delayDuration={0} skipDelayDuration={0}>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant={"ghost"}
										size={"icon"}
										className="size-7"
										aria-label="New tab with this code"
										onClick={() => newTab(code)}
									>
										<FilePlus2 className="size-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>New Tab</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant={"ghost"}
										size={"icon"}
										className="size-7"
										aria-label="Copy code"
										onClick={copyToClipboard}
									>
										{copied ? (
											<CopyCheck className="size-4" />
										) : (
											<Copy className="size-4" />
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent>Copy code</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</header>
					<section className="rounded-md overflow-hidden">
						<Editor
							language={lang}
							height={height}
							theme={theme}
							value={`${code.trim()}`}
							options={{
								readOnly: true,
								renderLineHighlight: "none",
								minimap: {
									enabled: false,
								},
								wordWrap: "off",
								fontFamily: fontFamily,
								lineNumbers: "off",
								overviewRulerLanes: 0,
								automaticLayout: true,
								scrollBeyondLastLine: false,
								contextmenu: false,
								mouseWheelZoom: false,
								fontLigatures: true,
								lineDecorationsWidth: 0,
								lineNumbersMinChars: 0,
								padding: {
									top: 6,
									bottom: 6,
								},
								scrollbar: {
									// scrollByPage: false,
									verticalScrollbarSize: 8,
									horizontalScrollbarSize: 10,
									handleMouseWheel: false,
									horizontal: "auto",
									vertical: "auto",
								},
							}}
						/>
					</section>
				</div>
			</section>
		) : (
			<code className="bg-background/60 text-foreground px-2 py-1  rounded-sm">
				{children}
			</code>
		);
	},
	pre: ({ children }) => <>{children}</>,
	p: ({ node, children, ...props }) => {
		return (
			<p className="leading-7 text-base" {...props}>
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
			<ul className="list-disc  my-1 list-outside ml-4" {...props}>
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
			<h1 className="text-3xl font-black mt-6 mb-2" {...props}>
				{children}
			</h1>
		);
	},
	h2: ({ node, children, ...props }) => {
		return (
			<h2 className="text-2xl font-black mt-6 mb-2" {...props}>
				{children}
			</h2>
		);
	},
	h3: ({ node, children, ...props }) => {
		return (
			<h3 className="text-xl font-black mt-6 mb-2" {...props}>
				{children}
			</h3>
		);
	},
	h4: ({ node, children, ...props }) => {
		return (
			<h4 className="text-lg font-bold mt-6 mb-2" {...props}>
				{children}
			</h4>
		);
	},
	h5: ({ node, children, ...props }) => {
		return (
			<h5 className="text-md font-semibold mt-6 mb-2" {...props}>
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
	main: ({ node, children, ...props }) => {
		return (
			<main className="my-4 border-muted" {...props}>
				{children}
			</main>
		);
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
