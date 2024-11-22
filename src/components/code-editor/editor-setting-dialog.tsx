import { Settings2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tooltip } from "@/components/ui/tooltip"
import { useEditorStore } from '@/store/editor'
import { themes } from '@/themes'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useConfigStore } from '@/store/config'

const fontSizes = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32]

const refreshTimes = [{ value: null, time: 'Off' }, { value: 500, time: '500ms' }, { value: 700, time: '700ms' }, { value: 1000, time: '1s' }, { value: 2000, time: '2s' }, { value: 3000, time: '3s' },]
const fontFamilies = [
  { name: 'Cascadia Code', value: '"Cascadia Code"' },
  { name: 'Fira Code', value: '"Fira Code"' },
  { name: 'Monocraft', value: 'Monocraft' }
]
type TLayout = "vertical" | "horizontal";
const layouts: TLayout[] = ["vertical", "horizontal"]

export function EditorSettingsDialog() {
  const { getCurrentTheme, theme, setTheme } = useEditorStore()
  const { fontSize, wordWrap, lineNumbers, fontFamily, refreshTime, minimap, layout, whiteSpace, setMinimap, setFontSize, setWordWrap, setWhiteSpace, setLineNumbers, setFontFamily, setRefreshTime, setLayout } = useConfigStore()
  const editorBehaviors = [
    { id: 'wordWrap', callback: setWordWrap, value: wordWrap, label: 'Word Wrap', description: 'Wrap long lines of code' },
    { id: 'lineNumbers', callback: setLineNumbers, value: lineNumbers, label: 'Line Numbers', description: 'Show line numbers in the editor' },
    { id: 'minimap', callback: setMinimap, value: minimap, label: 'Minimap', description: 'Show minimap in the editor' },
    { id: 'whiteSpace', callback: setWhiteSpace, value: whiteSpace, label: 'White Space', description: 'Show white space in the editor' },
  ]
  const currentTheme = getCurrentTheme()

  return (
    <Dialog>
      <Tooltip content="Editor settings">
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            style={{
              color: currentTheme.ui.foreground,
              '--hover-color': currentTheme.ui.warning,
              '--hover-bg': currentTheme.ui.hover
            } as React.CSSProperties}
          >
            <Settings2 className="w-4 h-4" />
          </Button>
        </DialogTrigger>
      </Tooltip>
      <DialogContent
        className="p-0 lg:max-w-3xl max-h-[85vh]"
        style={{
          backgroundColor: currentTheme.ui.background,
          borderColor: currentTheme.ui.border
        }}
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle style={{ color: currentTheme.ui.foreground }}>
            Editor Settings
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="appearance" className="flex-1">
          <TabsList
            className="h-12 px-6 "
            style={{
              backgroundColor: 'transparent',
              borderColor: currentTheme.ui.accent
            }}
          >
            <TabsTrigger
              value="appearance"

              style={{
                '--tab-accent': currentTheme.ui.accent,
                '--tab-bg': currentTheme.ui.hover,
                color: currentTheme.ui.foreground
              } as React.CSSProperties}
            >
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="editor"
              style={{
                '--tab-accent': currentTheme.ui.accent,
                '--tab-bg': currentTheme.ui.hover,
                color: currentTheme.ui.foreground
              } as React.CSSProperties}
            >
              Editor
            </TabsTrigger>

          </TabsList>
          <ScrollArea className="max-h-[90vh] h-[60vh] xl:h-[600px]">
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

            <TabsContent value="editor" className="p-6 m-0">
              <div className="space-y-8">
                <section>
                  <h3 className="mb-4 text-base font-medium" style={{ color: currentTheme.ui.foreground }}>
                    Editor Behavior
                  </h3>
                  <div className="space-y-4">
                    {editorBehaviors.map(({ id, callback, value, label, description }) => (
                      <div
                        key={id}
                        className="flex items-center justify-between p-3 rounded"
                        style={{ backgroundColor: currentTheme.ui.hover }}
                      >
                        <div>
                          <div style={{ color: currentTheme.ui.foreground }}>{label}</div>
                          <div
                            className="text-sm"
                            style={{ color: currentTheme.ui.muted }}
                          >
                            {description}
                          </div>
                        </div>
                        <Switch
                          checked={value}

                          onCheckedChange={
                            () => callback(!value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </section>


                <section>
                  <h3 className="mb-4 text-base font-medium" style={{ color: currentTheme.ui.foreground }}>
                    Refresh Time
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {refreshTimes.map(({ time, value }) => (
                      <Button
                        key={time}
                        className="p-3 text-center transition-all duration-200 border rounded"
                        style={{
                          borderColor: refreshTime === value ? currentTheme.ui.accent : currentTheme.ui.border,
                          color: refreshTime === value ? currentTheme.ui.foreground : '',
                          backgroundColor: 'transparent'
                        }}

                        onClick={() => setRefreshTime(value)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </section>
              </div>
            </TabsContent>

          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog >
  )
}