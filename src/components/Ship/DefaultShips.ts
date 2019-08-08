interface IDefaultShip {
  size: number;
  name: string;
}

const DEFAULT_SHIPS: IDefaultShip[] = [
  {
    size: 2,
    name: "Destroyer"
  },
  {
    size: 3,
    name: "Cruiser"
  },
  {
    size: 3,
    name: "Submarine"
  },
  {
    size: 4,
    name: "Battleship"
  },
  {
    size: 5,
    name: "Aircraft Carrier"
  }
];

export default DEFAULT_SHIPS;
