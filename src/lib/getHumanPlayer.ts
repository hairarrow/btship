import { IPlayer, PlayerType } from "../state/Models";

export default (players: IPlayer[]): IPlayer =>
  [...players].filter(({ type }) => type === PlayerType.Human)[0];
