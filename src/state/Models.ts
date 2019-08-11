export enum AIMode {
  HUNT,
  TARGET
}

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
  Sunk,
  HoverShip,
  InvalidLocation
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
  positions: ICell[];
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

export interface IPlayer {
  fleet: IFleet;
  grid: ICell[];
  type: PlayerType;
}

export interface IFleet {
  ships: IShip[];
  selectedShip: IShip | null;
}

export interface IGame {
  gridSize: number;
  active: boolean;
  placing: boolean;
  inBattle: boolean;
  playerTurn: PlayerType;
}

export interface IAI {
  mode: AIMode;
}

export interface IState {
  stats: IStats;
  game: IGame;
  ai: IAI;
  players: IPlayer[];
}
