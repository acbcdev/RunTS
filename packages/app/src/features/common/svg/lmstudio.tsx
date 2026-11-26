import type { SVGProps } from "react";

// Logo oficial de LM Studio (a color). Cada fila es una barra sólida con su sombra al 25% corrida 64px.
const ROWS = [
	[64, 84, 224],
	[160, 144, 224],
	[104, 204, 224],
	[48, 264, 224],
	[112, 324, 224],
	[240, 384, 152],
];

export const lmstudio = (props: SVGProps<SVGSVGElement>) => (
	<svg {...props} viewBox="0 0 512 512" fill="none">
		<title>LM Studio</title>
		<path
			fill="url(#lmstudio-bg)"
			d="M0 179.2C0 116.474 0 85.1112 12.2073 61.1531C22.9451 40.0789 40.0789 22.9451 61.1531 12.2073C85.1112 0 116.474 0 179.2 0H332.8C395.526 0 426.889 0 450.847 12.2073C471.921 22.9451 489.055 40.0789 499.793 61.1531C512 85.1112 512 116.474 512 179.2V332.8C512 395.526 512 426.889 499.793 450.847C489.055 471.921 471.921 489.055 450.847 499.793C426.889 512 395.526 512 332.8 512H179.2C116.474 512 85.1112 512 61.1531 499.793C40.0789 489.055 22.9451 471.921 12.2073 450.847C0 426.889 0 395.526 0 332.8V179.2Z"
		/>
		{ROWS.map(([x, y, w]) => (
			<g key={y} fill="white">
				<rect opacity="0.25" x={x + 64} y={y} width={w} height="44" rx="22" />
				<rect x={x} y={y} width={w} height="44" rx="22" />
			</g>
		))}
		<defs>
			{/* biome-ignore lint/correctness/useUniqueElementIds: identical gradient per instance, duplicate id is harmless */}
			<linearGradient
				id="lmstudio-bg"
				x1="-219.792"
				y1="229.426"
				x2="239.06"
				y2="702.601"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#6E7EF3" />
				<stop offset="1" stopColor="#4F13BE" />
			</linearGradient>
		</defs>
	</svg>
);
