import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
const components = {
	code: ({ className, children }) => {
		const match = /language-(\w+)/.exec(className || "");
		const codeContent = String(children).replace(/\n$/, "");

		const copyToClipboard = () => {
			navigator.clipboard.writeText(codeContent);
		};
		console.log(match);
		if (match) {
			return (
				<div className="relative max-w-2xl overflow-x-auto group/code">
					<header className="sticky flex items-center justify-between px-4 py-2 border-b rounded-t-lg border-border top-3 bg-[#282c34]">
						<span className="capitalize">{match[1]}</span>
						<nav className="top-0 right-0 z-10 opacity-0 group-hover/code:opacity-100">
							<Button variant={"ghost"} onClick={copyToClipboard}>
								<Copy />
							</Button>
						</nav>
					</header>

					<SyntaxHighlighter
						language={match[1]}
						style={oneDark}
						PreTag="div"
						codeTagProps={{
							className: "whitespace-pre-wrap",
							style: {
								display: "inline-block",
								minWidth: "100%",
							},
						}}
					>
						{codeContent}
					</SyntaxHighlighter>
				</div>
			);
		}
	},

	h1: (props) => (
		<h1 className="text-2xl font-bold" {...props}>
			{props.children}
		</h1>
	),
	h2: (props) => (
		<h2 className="text-xl font-bold" {...props}>
			{props.children}
		</h2>
	),
	h3: (props) => (
		<h3 className="text-lg font-bold" {...props}>
			{props.children}
		</h3>
	),
	a: (props) => (
		<a target="_blank" className="underline hover:text-accent" {...props}>
			{props.children}
		</a>
	),
} satisfies Components;

export default function Markdown({ children }: { children: string }) {
	return (
		<ReactMarkdown
			className="prose break-all hyphens-auto dark:prose-invert "
			components={components}
			remarkPlugins={[remarkGfm]}
		>
			{children}
		</ReactMarkdown>
	);
}
