import {
  TAction,
  PlayerActions,
  GameActions,
  ShipActions,
  AIActions
} from "./ActionsModels";
import { IState, PlayerType, AIMode } from "./Models";

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
    gridSize: 9,
    active: false,
    placing: false,
    inBattle: false,
    playerTurn: PlayerType.Human,
    over: false,
    winner: null
  },
  players: [],
  ai: {
    mode: AIMode.HUNT
  }
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
    case AIActions.Shoot:
    case ShipActions.UpdateCoords:
    case ShipActions.Rotate:
    case PlayerActions.SelectShip:
    case PlayerActions.UpdateGridCells:
    case PlayerActions.PlaceAutomatically:
    case PlayerActions.Shoot:
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
    case GameActions.EndPlacing:
      return {
        ...state,
        game: {
          ...state.game,
          placing: false,
          inBattle: true
        }
      };
    case GameActions.Won:
    case GameActions.Lost:
      return {
        ...state,
        game: action.game
      };
    case GameActions.Reset:
      return {
        ...initialState,
        stats: {
          ...initialState.stats,
          games: state.stats.games
        }
      };

    default:
      return { ...state };
  }
}
