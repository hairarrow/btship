import styled from "styled-components";
import { CellType } from "../../state/Models";

interface IProps {
  readonly type: CellType;
}

function cellBackground(type: CellType): string {
  switch (type) {
    case CellType.Sunk:
      return "#000";
    case CellType.Ship:
      return "#999";
    case CellType.Hit:
      return "red";
    case CellType.Miss:
      return "#fff";
    case CellType.Empty:
    default:
      return "lightblue";
  }
}

const Component = styled.div<IProps>`
  position: relative;
  height: 30px;
  border: 1px solid #000;
  background: ${({ type }) => cellBackground(type)};

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
