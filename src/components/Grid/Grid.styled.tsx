import styled from "styled-components";

interface IGridProps {
  readonly gridSize: number;
  readonly gridHeight: number;
}

const Component = styled.div<IGridProps>`
  position: relative;
  display: grid;
  grid-template-columns: ${({ gridSize, gridHeight }) =>
    [...Array(gridSize)].map(() => `${gridHeight / gridSize}px`).join(" ")};
  grid-template-rows: ${({ gridSize, gridHeight }) =>
    [...Array(gridSize)].map(() => `${gridHeight / gridSize}px`).join(" ")};

  // border: 8px solid rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  margin-top: ${({ theme: { spacing } }) => spacing()};
  margin-bottom: ${({ theme: { spacing } }) => spacing(3)};
`;

export default Component;
