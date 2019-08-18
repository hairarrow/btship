import styled, { DefaultTheme } from "styled-components";
import { lighten } from "polished";
import { CellType } from "../../state/Models";

interface IProps {
  readonly type: CellType;
  readonly canBeAttacked?: boolean;
}

function cellBackground(type: CellType, theme: DefaultTheme): string {
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
    case CellType.Empty:
    default:
      return "rgba(255, 255, 255, 0.3)";
  }
}

function oddCellBackground(type: CellType, theme: DefaultTheme): string {
  switch (type) {
    case CellType.Sunk:
      return lighten(0.01, "#000");
    case CellType.Ship:
      return lighten(0.01, theme.colors.main);
    case CellType.Hit:
      return lighten(0.01, theme.colors.accent);
    case CellType.Miss:
      return "rgba(255, 255, 255, 0.7)";
    case CellType.HoverShip:
      return "rgba(0, 0, 0, 0.2)";
    case CellType.Empty:
    default:
      return "rgba(255, 255, 255, 0.2)";
  }
}

const Component = styled.div<IProps>`
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: ${({ theme: { colors } }) => colors.main}
  background: ${({ type, theme }) => cellBackground(type, theme)};
  z-index: 1000;
  cursor: pointer;
  transition: background 120ms ease;

  .cell.odd-cell {
    background: ${({ type, theme }) => oddCellBackground(type, theme)}
  }

  &.odd-cell {
    background: ${({ type, theme }) => oddCellBackground(type, theme)}
  }

  &:nth-child(-n+9) {
    border-top: 2px solid rgba(255, 255, 255, .2);
  }

  &:nth-child(n+73) {
    border-bottom: 2px solid rgba(255, 255, 255, .2);
  }

  &:nth-child(9n+1) {
    border-left: 2px solid rgba(255, 255, 255, .2);
  }

  &:nth-child(9n-9) {
    border-right: 2px solid rgba(255, 255, 255, .2);
  }

  &:nth-child(1) {
    border-top-left-radius: 8px;
  }

  &:nth-child(9) {
    border-top-right-radius: 8px;
  }

  &:nth-child(73) {
    border-bottom-left-radius: 8px;
  }

  &:nth-child(81) {
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
    opacity: ${({ type }) =>
      [CellType.Empty, CellType.Ship].includes(type) ? 0.1 : 0};
  }
`;

export default Component;
