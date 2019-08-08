import React, { FC } from "react";

export interface IPosition {
  x: number;
  y: number;
}

export interface IShip {
  name: string;
  size: number;
  position: IPosition;
  positions: IPosition[];
}

const Ship: FC = () => <div>ship</div>;

export default Ship;
