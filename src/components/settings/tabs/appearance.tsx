import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useShallow } from "zustand/react/shallow";
import { fontFamilies, fontSizes, layouts, radiuses } from "@/consts";
import { cn } from "@/lib/utils";
import { useConfigStore } from "@/store/config";
import { useEditorStore } from "@/store/editor";
import { themes } from "@/themes";
export function Appearance() {
	const {
		layout,
		setLayout,
		fontSize,
		setFontSize,
		fontFamily,
		setFontFamily,
		setRadius,
		radius,
	} = useConfigStore(
		useShallow((state) => ({
			layout: state.layout,
			setLayout: state.setLayout,
			fontSize: state.fontSize,
			setFontSize: state.setFontSize,
			fontFamily: state.fontFamily,
			setFontFamily: state.setFontFamily,
			setRadius: state.setRadius,
			radius: state.radius,
		})),
	);
	const { setTheme, theme } = useEditorStore(
		useShallow((state) => ({ setTheme: state.setTheme, theme: state.theme })),
	);

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
