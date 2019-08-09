import React, { FC } from "react";
import { createCtx } from "./state";
import reducer, { initialState } from "./state/Reducer";
import { IState } from "./state/Models";
import Game from "./components/Game";
import { TAction } from "./state/ActionsModels";

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
