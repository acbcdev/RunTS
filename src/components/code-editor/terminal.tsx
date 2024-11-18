import { useEditorStore } from '@/store/editor'
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";

// const MAX_ITERATIONS = 3000; // Límite de iteraciones
const ROW_HEIGHT = 20; // Altura fija para cada fila
const OVERSCAN = 5; // Número de elementos a pre-renderizar

interface ConsoleOutput {
  type: 'log' | 'error' | 'info' | 'warn'
  content: string
  line: number
  id: string
}



export function Terminal() {
  const { getCurrentTheme, output } = useEditorStore()
  const currentTheme = getCurrentTheme()
  const parentRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const lastScrollTop = useRef(0)
  const iterationCount = useRef(0)

  // Configuración mejorada del virtualizador
  const virtualizer = useVirtualizer({
    count: output.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
    scrollPaddingEnd: 8,
    scrollPaddingStart: 8,
  })

  // Control de bucles infinitos
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    iterationCount.current += 1;
    if (iterationCount.current) {
      console.error("Execution timeout - Code took too long to run (possible infinite loop)");
      return;
    }

    if (autoScroll && parentRef.current) {
      const scrollElement = parentRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }

    return () => {
      iterationCount.current = 0;
    };
  }, [output, autoScroll]);

  // Manejo mejorado del scroll
  const handleScroll = () => {
    if (!parentRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
    // const isScrollingUp = scrollTop < lastScrollTop.current;
    const isAtBottom = scrollHeight - (scrollTop + clientHeight) < ROW_HEIGHT;

    setAutoScroll(isAtBottom);
    lastScrollTop.current = scrollTop;
  };

  const getOutputColor = (type: ConsoleOutput['type']) => {
    switch (type) {
      case 'error':
        return currentTheme.ui.error
      case 'warn':
        return currentTheme.ui.warning
      case 'info':
        return currentTheme.ui.info
      default:
        return currentTheme.ui.foreground
    }
  }

  const getOutputIcon = (type: ConsoleOutput['type']) => {
    switch (type) {
      case 'error':
        return '✖'
      case 'warn':
        return '⚠'
      case 'info':
        return 'ℹ'
      default:
        return '›'
    }
  }

  const formatConsoleOutput = (output: ConsoleOutput['content']) => {
    const isNumber = /^-?\d*\.?\d+$/.test(output)
    const isBoolean = /^(true|false)$/.test(output)
    const isString = /^["'].*["']$/.test(output)

    if (isNumber) {
      return <span style={{ color: `#${currentTheme.monaco.rules.find((rule) => rule.token === 'number')?.foreground}` }}>{output}</span>
    }
    if (isBoolean) {
      return <span style={{ color: `#${currentTheme.monaco.rules.find((rule) => rule.token === 'keyword')?.foreground}` }}>{output}</span>
    }
    if (isString) {
      return <span style={{ color: `#${currentTheme.monaco.rules.find((rule) => rule.token === 'string')?.foreground}` }}>{JSON.stringify(output)}</span>
    }
    // if (isObject) {
    //   try {
    //     const parsed = JSON.parse(output);
    //     return <span style={{ color: `#${currentTheme.monaco.rules.find((rule) => rule.token === 'string')?.foreground}` }}>
    //       {JSON.stringify(parsed, null, 2)}
    //     </span>
    //   } catch {
    //     return <span style={{ color: currentTheme.ui.foreground }}>{output}</span>
    //   }
    // }
    return <span style={{ color: currentTheme.ui.foreground }}>{output}</span>
  }

  return (
    <div
      className="relative h-full"
      style={{ backgroundColor: currentTheme.ui.background }}
    >
      <div
        ref={parentRef}
        onScroll={handleScroll}
        className="h-full overflow-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: `${currentTheme.ui.muted} transparent`
        }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {output.length === 0 ? (
            <div
              className="p-4 font-mono text-sm italic"
              style={{ color: currentTheme.ui.muted }}
            >
              Console output will appear here...
            </div>
          ) : (
            virtualizer.getVirtualItems().map((virtualRow) => {
              const item = output[virtualRow.index];
              return (
                <div
                  key={item.groupId}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  className="absolute top-0 left-0 w-full"
                  style={{
                    minHeight: `${ROW_HEIGHT}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div
                    className="flex items-start px-4 py-1 font-mono text-sm hover:bg-[var(--hover-bg)] transition-colors"
                    style={{
                      '--hover-bg': currentTheme.ui.hover,
                    } as React.CSSProperties}
                  >
                    <div
                      className="flex-shrink-0 w-4 mr-2"
                      style={{ color: getOutputColor(item.type) }}
                    >
                      {getOutputIcon(item.type)}
                    </div>
                    <div className="flex-1 break-all whitespace-pre-wrap">
                      <span style={{
                        color: getOutputColor(item.type),
                        fontWeight: item.type === 'error' || item.type === 'warn' ? 500 : 400
                      }}>
                        {formatConsoleOutput(item.content)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })

          )}
        </div>
      </div>
    </div>
  )
}