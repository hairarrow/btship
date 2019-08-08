import { TAction, ActionType } from "./Actions";
import { IShip } from "../components/Ship/Ship";

export interface IGame {
  history: any[];
  ships: IShip[];
  gridSize: number;
  active: boolean;
}

export interface IState {
  game: IGame;
}

export const initialState: IState = {
  game: {
    history: [],
    ships: [],
    gridSize: 10,
    active: false
  }
};

export default function reducer(
  state: IState = initialState,
  action: TAction
): IState {
  switch (action.type) {
    case ActionType.UpdateStatus:
      return {
        ...state,
        game: {
          ...state.game,
          active: action.active
        }
      };
    case ActionType.CreateShips:
      return {
        ...state,
        game: {
          ...state.game,
          ships: action.ships
        }
      };
    default:
      return { ...state };
  }
}
