import {
  IShip,
  INewShip,
  PlayerType,
  IPosition,
  IPlayer,
  IGame
} from "./Models";

export enum GameActions {
  Start,
  Finish,
  Reset,
  Won,
  Lost,
  Shoot,
  StartPlacing,
  EndPlacing
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
  Create,
  UpdateGridCell
}

export enum ActionType {
  UpdateStats
}

export type TAction =
  | { type: GameActions | ShipActions | ActionType }
  | { type: GameActions.Start; game: IGame }
  | { type: GameActions.Shoot; targetPlayer: PlayerType; position: IPosition }
  | { type: PlayerActions.Create; player: IPlayer }
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
}
