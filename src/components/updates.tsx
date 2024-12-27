import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@core/components/ui/dialog";
import { useConfigStore } from "@core/store/config";
import { useEditorStore } from "@core/store/editor";
export function Updates() {
  const { getCurrentTheme } = useEditorStore();
  const { updates, setUpdates } = useConfigStore();
  const currentTheme = getCurrentTheme();
  return (
    <>{
      updates && <Dialog open onOpenChange={() => setUpdates(false)} >
        <DialogContent style={{
          backgroundColor: currentTheme.ui.background,
          color: currentTheme.ui.info,
        }} className=" border-none ">
          <DialogHeader>
            <DialogTitle>New Updates 🚀</DialogTitle>
            <DialogDescription className="p-4 text-lg">
              <h2 style={{ color: currentTheme.ui.accent }}>
                🖋 Editor Improvements
              </h2>
              <p>
                Error Highlighting: The editor now displays errors directly in your code, making debugging faster and easier.

              </p>
              <p>
                Expression Recognition: Input operations like 456 + 45, and the editor will display the result as a variable without requiring console.log.
              </p>
              <p>
                Editor support for New Array and Object Methods:
                Array Methods:
              </p>
              <p>
                .toSorted
                .toReversed
                .toSpliced
                .with
              </p>
              <p>
                Object Methods:
              </p>
              <p>
                .groupBy
              </p>
              <h2 style={{ color: currentTheme.ui.accent }}>
                ✨ User Interface (UI)
              </h2>
              <p>
                UI Bug Fixes: Resolved visual bugs to improve your experience.
                <br />
                Aligned Logs: Logs are now properly aligned for easier readability.
              </p>
              <p style={{ color: currentTheme.ui.accent }}>
                📤 Sharing Features
              </p>
              <p>
                Share with a Link: Share your code with a simple link to collaborate seamlessly.
              </p>
            </DialogDescription>
          </DialogHeader>

        </DialogContent>
      </Dialog>
    }</>
  );
}