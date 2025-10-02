export interface ConsoleOutput {
  type: "log";
  content: string;
  line: number;
  column: number;
  timestamp: number;
}

export type RunCodeOptions = {
  injectLogs: boolean;
  name: string;
  timeoutWorker: number;
  hideUndefined: boolean;
};
