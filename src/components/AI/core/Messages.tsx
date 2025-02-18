import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "ai";
import Markdown from "@/components/AI/core/Markdown";
import { memo, useEffect, useLayoutEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

type PureMessagesProps = {
  messages: Message[];
  isLoading: boolean;
  streamingContent: string;
  reload: () => void;
  error: string;
};

function PureMessages({
  messages,
  isLoading,
  streamingContent,
  error,
  reload,
}: PureMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "instant",
        block: "end",
      });
    }
  }, []);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isLoading]);
  return (
    <ScrollArea className="flex-1 h-0 scroll-m-2 ">
      <section ref={containerRef} className="px-4 py-2 space-y-4 overflow-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg p-4  ${
                message.role === "user"
                  ? "bg-border/20 text-primary-foreground"
                  : "bg-input"
              }`}
            >
              <Markdown>{message.content}</Markdown>
            </div>
          </div>
        ))}
        {error && (
          <div className="border border-destructive  px-4 py-5 rounded-lg">
            <Markdown>{error}</Markdown>
            <Button onClick={reload}>
              Reload
              <RefreshCw />
            </Button>
          </div>
        )}
        <div
          className={`bg-accent/10 px-4 py-2 rounded-lg ${
            !streamingContent && "hidden"
          }`}
        >
          <Markdown
          // className="prose break-all hyphens-auto dark:prose-invert "
          >
            {streamingContent}
          </Markdown>
          {streamingContent && (
            <div className="rounded-full size-5 bg-border " />
          )}
        </div>
      </section>
    </ScrollArea>
  );
}

// export const Messages = memo(PureMessages, (prevProps, nextProps) => {
// if (prevProps.messages.length === nextProps.messages.length) return false;
// 	return true;
// });

export const Messages = memo(PureMessages);
