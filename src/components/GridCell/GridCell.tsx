import React, { FC } from "react";
import StyledGridCell from "./GridCell.styled";
import { ICell } from "../../state/Models";

const GridCell: FC<{ cell: ICell }> = ({
  cell: {
    position: { x, y },
    type
  }
}) => {
  return (
    <StyledGridCell type={type}>
      {x}
      {y}
    </StyledGridCell>
  );
};

export default GridCell;
