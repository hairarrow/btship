import {
  TAction,
  PlayerActions,
  GameActions,
  ShipActions
} from "./ActionsModels";
import { IState, PlayerType } from "./Models";

export const initialState: IState = {
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
  game: {
    gridSize: 10,
    active: false,
    placing: false,
    playerTurn: PlayerType.Human
  },
  players: []
};

export default function reducer(
  state: IState = initialState,
  action: TAction
): IState {
  switch (action.type) {
    case PlayerActions.Create:
      return {
        ...state,
        players: [...state.players, action.player]
      };
    case ShipActions.UpdateCoords:
    case ShipActions.Rotate:
    case PlayerActions.SelectShip:
    case PlayerActions.UpdateGridCells:
      return {
        ...state,
        players: action.players
      };
    case GameActions.Start:
      return {
        ...state,
        game: {
          ...state.game,
          placing: action.game.placing,
          active: action.game.active
        }
      };
    default:
      return { ...state };
  }
}
