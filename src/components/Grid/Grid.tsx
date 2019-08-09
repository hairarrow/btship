import React, { useContext, FC } from "react";
import { ctx } from "../../App";

const Grid: FC<{ player: string }> = ({ player }) => {
  const {
    state: { players }
  } = useContext(ctx);
  const { grid } = [...players].filter(({ type }) => type === player)[0];
  console.log(grid);
  return <div>{player}</div>;
};

export default Grid;
