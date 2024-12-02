export const fontSizes = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];

export const refreshTimes = [
  { value: null, time: "Off" },
  { value: 100, time: "100ms" },
  { value: 200, time: "200ms" },
  { value: 400, time: "400ms" },
  { value: 500, time: "500ms" },
  { value: 700, time: "700ms" },
  { value: 800, time: "800ms" },

  { value: 1000, time: "1s" },
  { value: 2000, time: "2s" },
  { value: 3000, time: "3s" },
];
export const fontFamilies = [
  { name: "Cascadia Code", value: '"Cascadia Code"' },
  { name: "Fira Code", value: '"Fira Code"' },
  { name: "Monocraft", value: "Monocraft" },
];
type TLayout = "vertical" | "horizontal";
export const layouts: TLayout[] = ["vertical", "horizontal"];
