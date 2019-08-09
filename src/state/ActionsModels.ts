import { IShip, PlayerType, IPosition, IPlayer, IGame } from "./Models";

export enum GameActions {
  Start = "GAME_START",
  Finish = "GAME_FINISH",
  Reset = "GAME_RESET",
  Won = "GAME_WON",
  Lost = "GAME_LOST",
  Shoot = "GAME_SHOOT",
  StartPlacing = "GAME_START_PLACING",
  EndPlacing = "GAME_END_PLACING"
}

export enum ShipActions {
  Rotate,
  Place,
  CheckPlacement,
  Hit,
  Sink,
  UpdateCoords,
  Create
}

export enum PlayerActions {
  Create = "CREATE_PLAYER",
  UpdateGridCell = "UPDATE_PLAYER_CELL",
  SelectShip = "SELECT_SHIP"
}

export enum ActionType {
  UpdateStats
}

export type TAction =
  | { type: GameActions.Start; game: IGame }
  | { type: GameActions.Shoot; targetPlayer: PlayerType; position: IPosition }
  | { type: PlayerActions.Create; player: IPlayer }
  | { type: PlayerActions.SelectShip; players: IPlayer[] }
  | {
      type:
        | ShipActions.Rotate
        | ShipActions.CheckPlacement
        | ShipActions.Hit
        | ShipActions.Sink
        | ShipActions.UpdateCoords;
      ship: IShip;
    };

export interface IActions {
  createPlayer(p: PlayerType): TAction;
  startGame(): TAction;
  selectShip(p: string): TAction;
}
