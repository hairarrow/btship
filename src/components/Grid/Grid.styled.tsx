import styled from "styled-components";

interface IGridProps {
  readonly gridSize: number;
}

const Component = styled.div<IGridProps>`
  position: relative;
  display: grid;
  grid-template-columns: ${({ gridSize }) =>
    [...Array(gridSize)].map(() => `1fr`).join(" ")};
  grid-template-rows: ${({ gridSize }) =>
    [...Array(gridSize)].map(() => `1fr`).join(" ")};

  border: 8px solid rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  margin-top: ${({ theme: { spacing } }) => spacing()};
  margin-bottom: ${({ theme: { spacing } }) => spacing(3)};
`;

export default Component;
