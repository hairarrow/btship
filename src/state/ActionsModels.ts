import { PlayerType, IPosition, IPlayer, IGame } from "./Models";

export enum GameActions {
  Start = "GAME_START",
  Finish = "GAME_FINISH",
  Reset = "GAME_RESET",
  Won = "GAME_WON",
  Lost = "GAME_LOST",
  StartPlacing = "GAME_START_PLACING",
  EndPlacing = "GAME_END_PLACING",
  EndTurn = "GAME_END_TURN"
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
  SelectShip = "SELECT_SHIP",
  Shoot = "PLAYER_SHOOT"
}

export enum AIActions {
  Shoot = "AI_SHOOT"
}

// TODO Don't do this. Be specific about the states that change... OR ELSE...
export type TAction =
  | { type: GameActions.Start | GameActions.EndTurn; game: IGame }
  | { type: PlayerActions.Create; player: IPlayer }
  | {
      type:
        | AIActions.Shoot
        | PlayerActions.SelectShip
        | PlayerActions.UpdateGridCells
        | PlayerActions.Shoot
        | ShipActions.Rotate
        | ShipActions.UpdateCoords;
      players: IPlayer[];
    }
  | {
      type:
        | ShipActions.CheckPlacement
        | ShipActions.Hit
        | ShipActions.Sink
        | GameActions.EndPlacing;
    };

export interface IActions {
  createPlayer(p: PlayerType): TAction;
  startGame(): TAction;
  selectShip(p: string): TAction;
  rotateShip(): TAction;
  moveShip(p: string, position: IPosition): TAction;
  placeShip(p: string, position: IPosition): TAction;
  removeSelectedShip(): TAction;
  finishPlacing(): TAction;
  shoot(targetPlayer: PlayerType, position: IPosition): TAction;
  endTurn(): TAction;
}
