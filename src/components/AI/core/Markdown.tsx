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
		if (match) {
			return (
				<div className="relative max-w-2xl overflow-x-auto group/code">
					<header className="sticky flex items-center justify-between px-4 py-2 border-b rounded-t-lg top-3 bg-[#282c34]">
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
	pre: ({ children }) => <>{children}</>,
	ol: ({ node, children, ...props }) => {
		return (
			<ol className="list-decimal list-outside ml-4" {...props}>
				{children}
			</ol>
		);
	},
	li: ({ node, children, ...props }) => {
		return (
			<li className="py-1" {...props}>
				{children}
			</li>
		);
	},
	ul: ({ node, children, ...props }) => {
		return (
			<ul className="list-disc list-outside ml-4" {...props}>
				{children}
			</ul>
		);
	},
	strong: ({ node, children, ...props }) => {
		return (
			<span className="font-semibold" {...props}>
				{children}
			</span>
		);
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
			<h1 className="text-4xl font-semibold mt-6 mb-2" {...props}>
				{children}
			</h1>
		);
	},
	h2: ({ node, children, ...props }) => {
		return (
			<h2 className="text-3xl font-semibold mt-6 mb-2" {...props}>
				{children}
			</h2>
		);
	},
	h3: ({ node, children, ...props }) => {
		return (
			<h3 className="text-2xl font-semibold mt-6 mb-2" {...props}>
				{children}
			</h3>
		);
	},
	h4: ({ node, children, ...props }) => {
		return (
			<h4 className="text-xl font-semibold mt-6 mb-2" {...props}>
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
