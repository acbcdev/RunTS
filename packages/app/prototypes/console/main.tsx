import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { BySource } from "./BySource";
import { Inline } from "./Inline";
import { Inspector } from "./Inspector";
import { Workspace } from "./Workspace";
import "./prototype.css";
import "./picker.css";

const variants = [
	{ name: "Inline", description: "Datos en el flujo", component: Inline },
	{
		name: "Inspector",
		description: "Seleccionar para explorar",
		component: Inspector,
	},
	{
		name: "Por origen",
		description: "Resultados agrupados por línea",
		component: BySource,
	},
];

function Prototype() {
	const [current, setCurrent] = useState(() => {
		const requested = Number(new URLSearchParams(location.search).get("v"));
		return Number.isInteger(requested) &&
			requested >= 1 &&
			requested <= variants.length
			? requested - 1
			: 0;
	});
	const [replay, setReplay] = useState(0);
	const picker = useRef<HTMLElement>(null);
	const highlight = useRef<HTMLSpanElement>(null);
	useLayoutEffect(() => {
		const moveHighlight = () => {
			const item = picker.current?.querySelector<HTMLElement>("[data-active]");
			if (item && highlight.current) {
				highlight.current.style.width = `${item.offsetWidth}px`;
				highlight.current.style.transform = `translateX(${item.offsetLeft}px)`;
			}
		};
		moveHighlight();
		window.addEventListener("resize", moveHighlight);
		const url = new URL(location.href);
		url.searchParams.set("v", String(current + 1));
		history.replaceState(null, "", url);
		return () => window.removeEventListener("resize", moveHighlight);
	}, [current]);
	useEffect(() => {
		const frame = requestAnimationFrame(() =>
			requestAnimationFrame(() =>
				picker.current?.setAttribute("data-ready", ""),
			),
		);
		const keydown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement;
			if (
				/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) ||
				target.isContentEditable ||
				event.metaKey ||
				event.ctrlKey ||
				event.altKey
			)
				return;
			const num = Number.parseInt(event.key, 10);
			if (num >= 1 && num <= variants.length) {
				setCurrent(num - 1);
				setReplay((n) => n + 1);
			} else if (event.key === "ArrowRight") {
				event.preventDefault();
				setCurrent((n) => (n + 1) % variants.length);
			} else if (event.key === "ArrowLeft") {
				event.preventDefault();
				setCurrent((n) => (n - 1 + variants.length) % variants.length);
			} else if (event.key.toLowerCase() === "r") setReplay((n) => n + 1);
		};
		document.addEventListener("keydown", keydown);
		return () => {
			cancelAnimationFrame(frame);
			document.removeEventListener("keydown", keydown);
		};
	}, []);
	const variant = variants[current];
	return (
		<>
			<Workspace
				key={`${current}-${replay}`}
				Variant={variant.component}
				name={variant.name}
				description={variant.description}
			/>
			<nav
				ref={picker}
				className="proto-picker"
				aria-label="Prototype variants"
			>
				<span
					ref={highlight}
					className="proto-picker-highlight"
					aria-hidden="true"
				/>
				{variants.map((item, i) => (
					<button
						type="button"
						className="proto-picker-item"
						key={item.name}
						data-active={i === current ? "" : undefined}
						aria-current={i === current ? "true" : undefined}
						onClick={() => {
							setCurrent(i);
							setReplay((n) => n + 1);
						}}
					>
						{item.name}
					</button>
				))}
			</nav>
		</>
	);
}

createRoot(document.getElementById("root") as HTMLElement).render(
	<Prototype />,
);
