import React, {
  Dispatch,
  createContext,
  PropsWithChildren,
  useReducer
} from "react";
import { useActions as actions } from "./Actions";
import { TAction, IActions } from "./ActionsModels";
import { IState } from "./Models";

type TReducer<S, A> = (state: S, action: A) => S;

export function createCtx<T extends IState, A extends TAction>(
  defaultValue: T,
  reducer: TReducer<T, A>
) {
  const defaultDispatch: Dispatch<A> = () => defaultValue;
  const ctx = createContext<{
    state: typeof defaultValue;
    dispatch: typeof defaultDispatch;
    actions: IActions;
  }>({
    state: defaultValue,
    dispatch: defaultDispatch,
    actions: actions(defaultValue, defaultDispatch)
  });

  function Provider(props: PropsWithChildren<{}>) {
    const [state, dispatch] = useReducer(reducer, defaultValue);

    return (
      <ctx.Provider
        value={{ state, dispatch, actions: actions(state, dispatch) }}
        {...props}
      />
    );
  }

  return [ctx, Provider] as const;
}
