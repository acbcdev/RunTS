import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/features/ui/dialog";
import { Kbd, KbdGroup } from "@/features/ui/kbd";
import { ScrollArea } from "@/features/ui/scroll-area";
import { useModalStore } from "../modal/modal";
import { SHORTCUTS } from "../utils/shortcuts";

export function ShortCutsModal() {
  const shortcuts = useModalStore((state) => state.shortcuts);
  const toggle = useModalStore((state) => state.toggleModal);

  // Group shortcuts by category
  const groupedShortcuts = useMemo(
    () =>
      SHORTCUTS.reduce((groups, shortcut) => {
        const category = shortcut.category;
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(shortcut);
        return groups;
      }, {} as Record<string, typeof SHORTCUTS>),
    []
  );

  const formatKeys = (keys: string | { mac: string; win: string }): string[][] => {
    if (typeof keys === "string") {
      // Para shortcuts de Monaco Editor que mantienen formato string
      // Detectar si estamos en macOS para mostrar ⌥ en lugar de Alt
      const isMac = navigator.userAgent.toUpperCase().indexOf("MAC") >= 0;
      return [keys.split("+").map((key) => {
        if (isMac && key.toLowerCase() === "alt") {
          return "⌥";
        }
        return key.charAt(0).toUpperCase() + key.slice(1);
      })];
    }

    // Para shortcuts personalizados, mostrar solo la versión actual del OS
    // Detectar si estamos en macOS
    const isMac = navigator.userAgent.toUpperCase().indexOf("MAC") >= 0;
    const currentKeys = isMac ? keys.mac : keys.win;

    // Handle multiple shortcut options separated by " / "
    // Return as array of arrays, each representing one shortcut combination
    return currentKeys.split(" / ").map((shortcut) =>
      shortcut.split("+")
    );
  };

  return (
    <Dialog open={shortcuts} onOpenChange={(v) => toggle("shortcuts", v)}>
      <DialogContent className="w-[95vw] max-w-[1400px] h-[90vh] max-h-[90vh] p-8 sm:max-w-[1400px]">
        <DialogTitle className="text-2xl font-bold mb-2">
          Keyboard Shortcuts
        </DialogTitle>
        <DialogDescription className="text-base mb-6 text-muted-foreground">
          Here are all the available keyboard shortcuts you can use:
        </DialogDescription>
        <ScrollArea className="h-[calc(90vh-200px)]">
          <div className="grid grid-cols-2  gap-12 pr-4 scroll">
            {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
              <div
                key={category}
                className={`space-y-4 ${
                  category === "Editor" ? "col-span-2" : ""
                }`}
              >
                <h3 className="text-xl font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2 ">
                  {category}
                </h3>
                <div
                  className={`space-y-3 ${
                    category === "Editor" ? "grid grid-cols-2 gap-4" : ""
                  }`}
                >
                  {shortcuts.map((shortcut) => {
                    const formattedKeys = formatKeys(shortcut.keys);

                    return (
                      <div
                        key={shortcut.id}
                        className="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                      >
                        <span className="text-base font-medium text-foreground flex-1 pr-4">
                          {shortcut.description}
                        </span>
                        <div className="flex-shrink-0 flex items-center gap-2">
                          {formattedKeys.map((keyCombination, comboIndex) => (
                            <>
                              <KbdGroup key={`combo-${comboIndex}`}>
                                {keyCombination.map(
                                  (key: string, keyIndex: number) => (
                                    <>
                                      <Kbd key={`${key}-${keyIndex}`}>{key}</Kbd>
                                      {keyIndex < keyCombination.length - 1 && "+"}
                                    </>
                                  )
                                )}
                              </KbdGroup>
                              {comboIndex < formattedKeys.length - 1 && (
                                <span className="text-muted-foreground text-sm">or</span>
                              )}
                            </>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
