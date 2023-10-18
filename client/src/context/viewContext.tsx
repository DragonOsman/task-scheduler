import { createContext, useReducer, ReactNode, Dispatch } from "react";

interface ViewAction {
  type: string;
  payload: string;
}

const initialState = {
  view: "parent"
};

export const ViewContext = createContext<{
  state: typeof initialState;
  dispatch: Dispatch<ViewAction>
}>({
  state: initialState,
  dispatch: () => null
});

const viewReducer = (
  state: typeof initialState,
  action: ViewAction
): typeof initialState => {
  switch (action.type) {
  case "CHANGE_VIEW":
    return {
      ...state,
      view: action.payload === "parent" || action.payload === "child" ? action.payload : ""
    };
  default: return state;
  }
};

interface UserContextProviderProps {
  children: ReactNode;
}

export const ViewContextProvider = ({ children }: UserContextProviderProps) => {
  const [state, dispatch] = useReducer(viewReducer, initialState);

  return (
    <ViewContext.Provider value={{ state, dispatch }}>
      {children}
    </ViewContext.Provider>
  );
};