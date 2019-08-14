import styled, { DefaultTheme } from "styled-components";
import { CellType } from "../../state/Models";

interface IProps {
  readonly type: CellType;
  readonly height: number;
}

function cellBackground(type: CellType | "odd", theme: DefaultTheme): string {
  switch (type) {
    case CellType.Sunk:
      return "#000";
    case CellType.Ship:
      return theme.colors.main;
    case CellType.Hit:
      return theme.colors.accent;
    case CellType.Miss:
      return "rgba(255, 255, 255, 0.8)";
    case CellType.HoverShip:
      return "rgba(0, 0, 0, 0.2)";
    case "odd":
      return "rgba(255, 255, 255, 0.2)";
    case CellType.Empty:
    default:
      return "rgba(255, 255, 255, 0.3)";
  }
}

const Component = styled.div<IProps>`
  position: relative;
  height: ${({ height }) => `${height}px`}
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: ${({ theme: { colors } }) => colors.main}
  background: ${({ type, theme }) => cellBackground(type, theme)};
  z-index: 1000;

  &:nth-child(20n+2),
  &:nth-child(20n+4),
  &:nth-child(20n+6),
  &:nth-child(20n+8),
  &:nth-child(20n+10),
  &:nth-child(20n+11),
  &:nth-child(20n+13),
  &:nth-child(20n+15),
  &:nth-child(20n+17),
  &:nth-child(20n+19) {
    background: ${({ type, theme }) =>
      type === CellType.Empty
        ? cellBackground("odd", theme)
        : cellBackground(type, theme)};
  }

  &:nth-child(1) {
    border-top-left-radius: 8px;
  }

  &:nth-child(10) {
    border-top-right-radius: 8px;
  }

  &:nth-child(91) {
    border-bottom-left-radius: 8px;
  }

  &:nth-child(100) {
    border-bottom-right-radius: 8px;
  }

  &:hover:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    opacity: ${({ type }) => (type === CellType.Empty ? 0.1 : 0)};
  }
`;

export default Component;
