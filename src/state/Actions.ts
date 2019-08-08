import { IShip } from "../components/Ship/Ship";
import { IState } from "./Reducer";
import { Dispatch } from "react";

interface INewShip {
  name: string;
  size: number;
}

export enum ActionType {
  UpdateStatus,
  CreateShips,
  UpdateShipPositions
}

export type TAction =
  | { type: ActionType.UpdateShipPositions; ships: IShip[] }
  | { type: ActionType.UpdateStatus; active: boolean }
  | { type: ActionType.CreateShips; ships: IShip[] };

export interface IActions {
  updateGameStatus(p: boolean): TAction;
  createShips(p: INewShip[]): TAction;
  updateShipPositions(p: IShip): TAction;
}

export function useActions<T extends IState, A extends TAction>(
  state: T,
  // TODO Fix this dispatch actions. Can't pass one of these actions through to dispatch
  dispatch: Dispatch<A>
): IActions {
  function updateGameStatus(active: boolean): TAction {
    return {
      type: ActionType.UpdateStatus,
      active
    };
  }

  function createShips(newShips: INewShip[]): TAction {
    const ships: IShip[] = [...newShips].map(({ name, size }) => ({
      name,
      size,
      position: {
        x: 0,
        y: 0
      },
      positions: []
    }));

    return {
      type: ActionType.CreateShips,
      ships
    };
  }

  function updateShipPositions(updatedShip: IShip): TAction {
    const {
      game: { ships: oldShips }
    } = state;
    const ships = [...oldShips].map(ship =>
      updatedShip.name === ship.name ? { ...ship, ...updatedShip } : { ...ship }
    );
    return {
      type: ActionType.UpdateShipPositions,
      ships
    };
  }

  return {
    updateGameStatus,
    createShips,
    updateShipPositions
  };
}
