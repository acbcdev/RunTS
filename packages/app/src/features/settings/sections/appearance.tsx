import { useShallow } from "zustand/react/shallow";
import { themes } from "../../common/themes";
import { cn } from "../../common/utils/utils";
import { Button } from "../../ui/button";
import { TabsContent } from "../../ui/tabs";
import { SIDES, useApparenceStore } from "../appearance-store/appearance";
import {
	FONT_FAMILIES,
	FONT_SIZES,
	LAYOUTS,
	RADIUS_SIZES,
} from "../config-consts/config";

export function Appearance() {
	const { fontSize, fontFamily, radius, theme, layout, setOption, side } =
		useApparenceStore(
			useShallow((state) => ({
				fontFamily: state.fontFamily,
				fontSize: state.fontSize,
				radius: state.radius,
				theme: state.theme,
				layout: state.layout,
				side: state.side,
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
									theme === key ? "border-accent border-2" : "border-accent/5",
									" rounded-lg p-3 border",
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
						{/* <CreateTheme /> */}
					</div>
				</section>
				<section>
					<h3 className="mb-4 text-base font-medium">Actions Position</h3>
					<div className="grid grid-cols-5 gap-2 md:grid-cols-10">
						{Object.entries(SIDES).map(([key, value]) => (
							<Button
								translate="no"
								key={key}
								variant={side === value ? "border" : "outline"}
								onClick={() => setOption("side", value)}
								className="capitalize"
							>
								{key.toLowerCase()}
							</Button>
						))}
					</div>
				</section>
				<section>
					<h3 className="mb-4 text-base font-medium">Border Radius</h3>
					<div className="grid grid-cols-5 gap-2 md:grid-cols-10">
						{RADIUS_SIZES.map((value) => (
							<Button
								translate="no"
								key={value.size}
								variant={radius === value.size ? "border" : "outline"}
								onClick={() => setOption("radius", value.size)}
								style={{ borderRadius: `${value.size}rem` }}
							>
								{value.display}
							</Button>
						))}
					</div>
				</section>
				<section>
					<h3 translate="no" className="mb-4 text-base font-medium">
						EditLayout
					</h3>
					<div className="grid grid-cols-2 gap-2">
						{LAYOUTS.map((direction) => (
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
								{FONT_SIZES.map((size) => (
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
								{FONT_FAMILIES.map((font) => (
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
