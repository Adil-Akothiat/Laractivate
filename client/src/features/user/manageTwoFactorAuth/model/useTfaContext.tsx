import { createContext, ReactNode, useContext, useReducer } from "react";
import { TfaStepperContextProps } from "./twoFactorAuth.types";
import { stepperReducer, tfaStepperInitialState } from "./useTfaReducer";

const TfaStepperContext = createContext<TfaStepperContextProps | null>(null);

export function TfaContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(stepperReducer, tfaStepperInitialState);

  return (
    <TfaStepperContext.Provider
      value={{
        ...state,
        dispatch
      }}
    >
      {children}
    </TfaStepperContext.Provider>
  );
}

export function useTfaContext() {
  const context = useContext(TfaStepperContext);
  if (!context) {
    throw new Error("useTfaStepperContext must be used within a TfaStepperContextProvider");
  }
  return context;
}