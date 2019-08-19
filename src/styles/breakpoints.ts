export const sizes = {
  mobile: 376,
  small: 448,
  medium: 672,
  large: 896,
  larger: 1120,
  xLarge: 1440
};

const size = Object.entries(sizes).reduce<{ [k: string]: string }>(
  (a, [k, v]) => {
    a[k] = `${v}px`;
    return a;
  },
  {}
);

// const size: { [k: string]: string } = Object.keys(sizes).reduce<{
//   [k: string]: string;
// }>((a, b: string) => {
//   a[b] = `${Object.entries()}px`;
//   return a;
// }, {});

export default {
  mobile: `min-width: ${size.mobile}`,
  small: `min-width: ${size.small}`,
  medium: `min-width: ${size.medium}`,
  large: `min-width: ${size.large}`,
  larger: `min-width: ${size.larger}`,
  xLarge: `min-width: ${size.xLarge}`
};
