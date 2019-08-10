import { PlayerType, IPosition, IPlayer, IGame } from "./Models";
import { Dispatch } from "react";

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
  Rotate = "SHIP_ROTATE",
  Place = "SHIP_PLACE",
  CheckPlacement = "SHIP_CHECK_PLACEMENT",
  Hit = "SHIP_HIT",
  Sink = "SHIP_SINK",
  UpdateCoords = "SHIP_UPDATE_PLACEMENT"
}

export enum PlayerActions {
  Create = "CREATE_PLAYER",
  UpdateGridCells = "UPDATE_PLAYER_CELLS",
  SelectShip = "SELECT_SHIP"
}

export type TAction =
  | { type: GameActions.Start; game: IGame }
  | { type: GameActions.Shoot; targetPlayer: PlayerType; position: IPosition }
  | { type: PlayerActions.Create; player: IPlayer }
  | {
      type:
        | PlayerActions.SelectShip
        | PlayerActions.UpdateGridCells
        | ShipActions.Rotate
        | ShipActions.UpdateCoords;
      players: IPlayer[];
    }
  | {
      type: ShipActions.CheckPlacement | ShipActions.Hit | ShipActions.Sink;
    };

export interface IActions {
  createPlayer(p: PlayerType): TAction;
  startGame(): TAction;
  selectShip(p: string): TAction;
  rotateShip(): TAction;
  moveShip(p: string, position: IPosition): TAction;
  placeShip(p: string, position: IPosition): TAction;
}
