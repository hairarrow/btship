import { DefaultTheme } from "styled-components";

const Theme: DefaultTheme = {
  spacing: (x: number = 1) => `${8 * x}px`,

  colors: {
    main: "#1b4f8f",
    accent: "#ff3ea5",
    text: "#fff"
  }
};

export default Theme;
