import React, { FC } from "react";
import { createCtx } from "./state";
import reducer, { initialState, IState } from "./state/Reducer";
import Game from "./components/Game";
import { TAction } from "./state/Actions";

export const [ctx, StateProvider] = createCtx<IState, TAction>(
  initialState,
  reducer
);

const App: FC = () => {
  return (
    <StateProvider>
      <Game />
    </StateProvider>
  );
};

export default App;
