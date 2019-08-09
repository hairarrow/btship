import { TAction, PlayerActions, GameActions } from "./ActionsModels";
import { IState, PlayerType } from "./Models";

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
    active: false,
    placing: false,
    playerTurn: PlayerType.Human,
    players: []
  }
};

export default function reducer(
  state: IState = initialState,
  action: TAction
): IState {
  switch (action.type) {
    case PlayerActions.Create:
      const { player } = action;
      return {
        ...state,
        game: {
          ...state.game,
          players: [...state.game.players, player]
        }
      };
    case GameActions.Start:
      const { placing, active } = action.game;
      return {
        ...state,
        game: {
          ...state.game,
          placing,
          active
        }
      };
    default:
      return { ...state };
  }
}
