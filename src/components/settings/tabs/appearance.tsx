import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useShallow } from "zustand/react/shallow";
import { fontFamilies, fontSizes, layouts, radiuses } from "@/consts";
import { cn } from "@/lib/utils";
import { themes } from "@/themes";
import { useApparenceStore } from "@/store/apparence";
export function Appearance() {
	const layout = useApparenceStore(useShallow((state) => state.layout));
	const setLayout = useApparenceStore(useShallow((state) => state.setLayout));
	const fontSize = useApparenceStore(useShallow((state) => state.fontSize));
	const setFontSize = useApparenceStore(
		useShallow((state) => state.setFontSize),
	);
	const fontFamily = useApparenceStore(useShallow((state) => state.fontFamily));
	const setFontFamily = useApparenceStore(
		useShallow((state) => state.setFontFamily),
	);
	const setRadius = useApparenceStore(useShallow((state) => state.setRadius));
	const radius = useApparenceStore(useShallow((state) => state.radius));
	const theme = useApparenceStore(useShallow((state) => state.theme));
	const setTheme = useApparenceStore(useShallow((state) => state.setTheme));

	return (
		<TabsContent value="appearance" className="p-6 m-0">
			<div className="space-y-8">
				<section>
					<h3 translate="no" className="mb-4 text-base font-medium">
						Color Theme
					</h3>
					<div className="grid grid-cols-2 gap-3 cursor-pointer">
						{Object.entries(themes).map(([key, value]) => (
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
							<div
								translate="no"
								key={key}
								className={cn(
									theme === key ? "border-accent" : "border-border",
									"border rounded-lg p-3",
								)}
								style={{
									backgroundColor: value.ui.background,
								}}
								onClick={() => setTheme(key as keyof typeof themes)}
							>
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span style={{ color: value.ui.foreground }}>
											{value.name}
										</span>
										{theme === key && (
											<div
												className="w-2 h-2 rounded-full"
												style={{ backgroundColor: value.ui.accent }}
											/>
										)}
									</div>
									<div className="flex gap-1.5">
										{[
											value.ui.foreground,
											value.ui.accent,
											value.ui.success,
											value.ui.warning,
											value.ui.error,
										].map((color, index) => (
											<div
												key={`${color} - ${key} - ${index * Math.random()}`}
												className="w-4 h-4 rounded-full "
												style={{ backgroundColor: color }}
											/>
										))}
									</div>
								</div>
							</div>
						))}
					</div>
				</section>
				<section>
					<h3 className="mb-4 text-base font-medium">Border Radius</h3>
					<div className="grid grid-cols-5 gap-2 md:grid-cols-10">
						{radiuses.map((value) => (
							<Button
								translate="no"
								key={value}
								variant={radius === value ? "border" : "outline"}
								onClick={() => setRadius(value)}
							>
								{value}
							</Button>
						))}
					</div>
				</section>
				<section>
					<h3 translate="no" className="mb-4 text-base font-medium">
						EditLayout
					</h3>
					<div className="grid grid-cols-2 gap-2">
						{layouts.map((direction) => (
							<Button
								variant={layout === direction ? "border" : "outline"}
								key={direction}
								translate="no"
								onClick={() => setLayout(direction)}
							>
								{direction}
							</Button>
						))}
					</div>
				</section>
				<section>
					<h3 translate="no" className="mb-4 text-base font-medium">
						Font Settings
					</h3>
					<div className="space-y-6">
						<div>
							<h4 translate="no" className="block mb-2 text-sm">
								Font Size
							</h4>
							<div className="grid grid-cols-8 gap-2 md:grid-cols-10">
								{fontSizes.map((size) => (
									<Button
										translate="no"
										key={size}
										variant={fontSize === size ? "border" : "outline"}
										onClick={() => setFontSize(size)}
									>
										{size}px
									</Button>
								))}
							</div>
						</div>

						<div>
							<h4 translate="no" className="block mb-2 text-sm">
								Font Family
							</h4>
							<div className="grid grid-cols-2 gap-2">
								{fontFamilies.map((font) => (
									<Button
										key={font.name}
										variant={fontFamily === font.value ? "border" : "outline"}
										translate="no"
										onClick={() => setFontFamily(font.value)}
										style={{ fontFamily: font.value }}
									>
										{font.name}
									</Button>
								))}
							</div>
						</div>
					</div>
				</section>
			</div>
		</TabsContent>
	);
}
