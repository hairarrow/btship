import { ICell, CellType, IPosition } from "../../state/Models";

type TSegment = {
  start: IPosition;
  end: IPosition;
  size?: number;
};

type TSegments = {
  [k: string]: TSegment[];
};

export default function createSegments(grid: ICell[], minSize: number) {
  const vSegments = [...grid]
    .filter(({ type }) => type === CellType.Empty)
    .reduce<TSegments>((a, { position: { x, y } }) => {
      if (!a[y]) a[y] = [{ start: { x, y }, end: { x, y } }];
      else if (
        a[y][a[y].length - 1].start.y === y &&
        a[y][a[y].length - 1].end.x + 1 === x
      )
        a[y][a[y].length - 1].end.x = x;
      else a[y].push({ start: { x, y }, end: { x, y } });

      return a;
    }, {});
  const hSegments = [...grid]
    .filter(({ type }) => type === CellType.Empty)
    .reduce<TSegments>((a, { position: { x, y } }) => {
      if (!a[x]) a[x] = [{ start: { x, y }, end: { x, y } }];
      else if (
        a[x][a[x].length - 1].start.x === x &&
        a[x][a[x].length - 1].end.y + 1 === y
      )
        a[x][a[x].length - 1].end.y = y;
      else a[x].push({ start: { x, y }, end: { x, y } });
      return a;
    }, {});

  const cH = Object.keys(hSegments).reduce<TSegment[]>((a, b) => {
    const n = [...hSegments[b]].map(it => {
      return { ...it, size: it.end.y - it.start.y };
    });
    return [...a, ...n];
  }, []);

  const cV = Object.keys(vSegments).reduce<TSegment[]>((a, b) => {
    const n = [...vSegments[b]].map(it => {
      return { ...it, size: it.end.x - it.start.x };
    });
    return [...a, ...n];
  }, []);

  const segments = [...cV, ...cH].filter(
    seg => seg.size && seg.size >= minSize
  );

  return segments;
}
