import { DefaultTheme } from "styled-components";
import { colors, breakpoints } from "./styles";

const Theme: DefaultTheme = {
  spacing: (x: number = 1) => `${8 * x}px`,
  colors,
  breakpoints
};

export default Theme;
