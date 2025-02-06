import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { fontFamilies, fontSizes, layouts, radiuses } from "@/consts";
import { cn } from "@/lib/utils";
import { useApparenceStore } from "@/store/apparence";
import { themes } from "@/themes";
import { useShallow } from "zustand/react/shallow";

export function Appearance() {
	const { fontSize, fontFamily, radius, theme, layout, setOption } =
		useApparenceStore(
			useShallow((state) => ({
				fontFamily: state.fontFamily,
				fontSize: state.fontSize,
				radius: state.radius,
				theme: state.theme,
				layout: state.layout,
				setOption: state.setOption,
			})),
		);

	return (
		<TabsContent value="appearance" className="p-6 m-0">
			<div className="space-y-8">
				<section>
					<h3 translate="no" className="mb-4 text-base font-medium">
						Color Theme
					</h3>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-3 cursor-pointer">
						{Object.entries(themes).map(([key, value]) => (
							<button
								translate="no"
								key={key}
								type="button"
								className={cn(
									theme === key && "border-accent",
									"border rounded-lg p-3",
								)}
								style={{
									backgroundColor: value.ui.background,
								}}
								onClick={() => setOption("theme", key as keyof typeof themes)}
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
							</button>
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
								onClick={() => setOption("radius", value)}
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
								onClick={() => setOption("layout", direction)}
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
										onClick={() => setOption("fontSize", size)}
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
										onClick={() => setOption("fontFamily", font.value)}
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
