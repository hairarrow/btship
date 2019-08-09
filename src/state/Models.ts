export enum PlayerType {
  Human = "HUMAN",
  Computer = "AI",
  Virtual = "VIRTUAL"
}

export enum CellType {
  Empty,
  Miss,
  Ship,
  Hit,
  Sunk
}

export enum ShipDirection {
  Vertical,
  Horizontal
}

export interface IPosition {
  x: number;
  y: number;
}

export interface INewShip {
  name: string;
  size: number;
}

export interface IShip {
  name: string;
  size: number;
  sunk: boolean;
  placed: boolean;
  direction: ShipDirection;
  position: IPosition;
  positions: IPosition[];
}

export interface IStats {
  shots: {
    taken: number;
    hit: number;
  };
  total: {
    shots: number;
    hits: number;
  };
  games: {
    played: number;
    won: number;
  };
}

export interface ICell {
  position: IPosition;
  type: CellType;
}

export interface IGrid {
  cells: ICell[];
}

export interface IPlayer {
  fleet: IFleet;
  grid: IGrid;
  type: PlayerType;
}

export interface IFleet {
  grid: IGrid;
  ships: IShip[];
}

export interface IGame {
  stats: IStats;
  gridSize: number;
  active: boolean;
  placing: boolean;
  players: IPlayer[];
  playerTurn: PlayerType;
}

export interface IState {
  stats?: IStats;
  game: IGame;
}
