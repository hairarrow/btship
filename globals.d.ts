import "styled-components";

declare module "vanta/src/vanta.waves";

declare module "styled-components" {
  export interface DefaultTheme {
    spacing: function;
    colors: { [k: string]: string };
    breakpoints: { [k: string]: string };
  }
}
