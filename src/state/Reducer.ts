import { TAction, ActionType } from "./ActionsModels";
import { IState } from "./Models";

export const initialState: IState = {
  game: {
    stats: {
      shots: {
        taken: 0,
        hit: 0
      },
      total: {
        shots: 0,
        hits: 0
      },
      games: {
        played: 0,
        won: 0
      }
    },
    gridSize: 10,
    active: false
  }
};

export default function reducer(
  state: IState = initialState,
  action: TAction
): IState {
  switch (action.type) {
    default:
      return { ...state };
  }
}
