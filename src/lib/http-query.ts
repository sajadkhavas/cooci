export const encodeBooleanQuery = (value: boolean): "1" | "0" =>
  value ? "1" : "0";
