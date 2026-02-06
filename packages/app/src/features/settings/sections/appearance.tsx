import { useShallow } from "zustand/react/shallow";
import { themes } from "@/features/common/themes";
import { cn } from "@/features/common/utils/utils";
import { SettingButtonGroup } from "@/features/settings/components/SettingButtonGroup";
import { TabsContent } from "@/features/ui/tabs";
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
                    ].map((color) => (
                      <div
                        key={`${color}-${key}`}
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
          <SettingButtonGroup
            options={Object.entries(SIDES).map(([_, value]) => value)}
            value={side}
            onChange={(value) => setOption("side", value)}
            renderLabel={(value) => {
              const key = Object.entries(SIDES).find(
                ([_, v]) => v === value,
              )?.[0];
              return key?.toLowerCase() || "";
            }}
            className="grid grid-cols-5 gap-2 md:grid-cols-10"
          />
        </section>
        <section>
          <h3 className="mb-4 text-base font-medium">Border Radius</h3>
          <SettingButtonGroup
            options={RADIUS_SIZES}
            value={
              RADIUS_SIZES.find((r) => r.size === radius) || RADIUS_SIZES[0]
            }
            onChange={(value) => setOption("radius", value.size)}
            renderLabel={(value) => value.display}
            buttonStyle={(value) => ({ borderRadius: `${value.size}rem` })}
            className="grid grid-cols-5 gap-2 md:grid-cols-10"
          />
        </section>
        <section>
          <h3 translate="no" className="mb-4 text-base font-medium">
            EditLayout
          </h3>
          <SettingButtonGroup
            options={LAYOUTS}
            value={layout}
            onChange={(direction) => setOption("layout", direction)}
            className="grid grid-cols-2 gap-2"
          />
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
              <SettingButtonGroup
                options={FONT_SIZES}
                value={fontSize}
                onChange={(size) => setOption("fontSize", size)}
                renderLabel={(size) => `${size}px`}
                className="grid grid-cols-8 gap-2 md:grid-cols-10"
              />
            </div>

            <div>
              <h4 translate="no" className="block mb-2 text-sm">
                Font Family
              </h4>
              <SettingButtonGroup
                options={FONT_FAMILIES}
                value={
                  FONT_FAMILIES.find((f) => f.value === fontFamily) ||
                  FONT_FAMILIES[0]
                }
                onChange={(font) => setOption("fontFamily", font.value)}
                renderLabel={(font) => font.name}
                buttonStyle={(font) => ({ fontFamily: font.value })}
                className="grid grid-cols-2 gap-2"
              />
            </div>
          </div>
        </section>
      </div>
    </TabsContent>
  );
}
