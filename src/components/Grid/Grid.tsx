import React, { useContext, FC } from "react";
import { ctx } from "../../App";

const Grid: FC<{ player: string }> = ({ player }) => {
  // const {} = useContext(ctx)
  return <div>{player}</div>;
};

export default Grid;
