import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { fontFamilies, fontSizes, layouts } from "@/consts";
import { useConfigStore } from "@/store/config";
import { useEditorStore } from "@/store/editor";
import { themes } from "@/themes";


export function Appearance() {
  const { layout, setLayout, fontSize, setFontSize, fontFamily, setFontFamily } = useConfigStore()
  const { getCurrentTheme, setTheme, theme } = useEditorStore()
  const currentTheme = getCurrentTheme()
  return (
    <TabsContent value="appearance" className="p-6 m-0">
      <div className="space-y-8">
        <section>
          <h3 className="mb-4 text-base font-medium" style={{ color: currentTheme.ui.foreground }}>
            Color Theme
          </h3>
          <div className="grid grid-cols-2 gap-3 cursor-pointer">
            {Object.entries(themes).map(([key, value]) => (
              // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
              <div
                key={key}
                className="relative p-4 transition-all duration-200 border rounded-lg"
                style={{
                  backgroundColor: value.ui.background,
                  borderColor: theme === key ? currentTheme.ui.accent : currentTheme.ui.border
                }}
                onClick={() => setTheme(key as keyof typeof themes)}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span style={{ color: value.ui.foreground }}>{value.name}</span>
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
                      value.ui.error
                    ].map((color) => (
                      <div
                        key={`${color}-`}
                        className="w-4 h-4 rounded-full"
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
          <h3 className="mb-4 text-base font-medium" style={{ color: currentTheme.ui.foreground }}>
            EditLayout
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {layouts.map((direction) => (
              <Button
                key={direction}
                className="p-2 text-center transition-all duration-200 border rounded"
                onClick={() => setLayout(direction)}
                style={{
                  borderColor: direction === layout ? currentTheme.ui.accent : currentTheme.ui.border,
                  backgroundColor: direction === layout ? currentTheme.ui.hover : 'transparent',
                  color: currentTheme.ui.foreground
                }}
              >
                {direction}
              </Button>
            ))}

          </div>
        </section>
        <section>
          <h3 className="mb-4 text-base font-medium" style={{ color: currentTheme.ui.foreground }}>
            Font Settings
          </h3>
          <div className="space-y-6">
            <div>
              <Button
                className="block mb-2 text-sm"
                style={{ color: currentTheme.ui.muted }}
              >
                Font Size
              </Button>
              <div className="grid grid-cols-5 gap-2 md:grid-cols-7">
                {fontSizes.map((size) => (
                  <Button
                    key={size}
                    className="p-2 text-center transition-all duration-200 border rounded"
                    style={{
                      borderColor: fontSize === size ? currentTheme.ui.accent : currentTheme.ui.border,
                      backgroundColor: fontSize === size ? currentTheme.ui.hover : 'transparent',
                      color: currentTheme.ui.foreground
                    }}
                    onClick={() => setFontSize(size)}
                  >
                    {size}px
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p
                className="block mb-2 text-sm"
                style={{ color: currentTheme.ui.muted }}
              >
                Font Family
              </p>
              <div className="grid grid-cols-2 gap-2">
                {fontFamilies.map((font) => (
                  <Button
                    key={font.name}
                    className="p-3 text-left transition-all duration-200 border rounded"
                    style={{
                      fontFamily: font.value,
                      borderColor: fontFamily === font.value ? currentTheme.ui.accent : currentTheme.ui.border,
                      backgroundColor: fontFamily === font.value ? currentTheme.ui.hover : 'transparent',
                      color: currentTheme.ui.foreground
                    }}
                    onClick={() => setFontFamily(font.value)}
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
