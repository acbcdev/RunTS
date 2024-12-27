export interface ConsoleOutput {
  type: "log" | "error" | "info" | "warn";
  content: string;
  line: number;
  column: number;
  timestamp: number;
  groupId?: string;
}
