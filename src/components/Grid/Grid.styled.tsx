import styled from "styled-components";

interface IGridProps {
  readonly gridSize: number;
}

const Component = styled.div<IGridProps>`
  display: grid;
  grid-template-columns: ${({ gridSize }) =>
    [...Array(gridSize)].map(() => `1fr`).join(" ")};
  grid-template-rows: ${({ gridSize }) =>
    [...Array(gridSize)].map(() => `1fr`).join(" ")};
`;

export default Component;
