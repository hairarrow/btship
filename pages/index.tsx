import React, { FC } from "react";
import { createCtx } from "../src/state";
import reducer, { initialState } from "../src/state/Reducer";
import { IState } from "../src/state/Models";
import Game from "../src/components/Game";
import { TAction } from "../src/state/ActionsModels";
import { ThemeProvider } from "styled-components";
import theme from "../src/theme";

export const [ctx, StateProvider] = createCtx<IState, TAction>(
  initialState,
  reducer
);

const App: FC = () => {
  return (
    <StateProvider>
      <ThemeProvider theme={theme}>
        <Game />
      </ThemeProvider>
    </StateProvider>
  );
};

export default App;
