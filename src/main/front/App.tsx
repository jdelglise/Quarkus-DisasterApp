import { NativeBaseProvider } from "native-base";
import React, { createContext, useEffect, useMemo, useReducer } from "react";
import { ActivityIndicator } from "react-native";
import { clearAuthTokens, isLoggedIn } from "react-native-axios-jwt";
import AppRouterComponent from "./component/RouterComponent/AppRouterComponent/AppRouterComponent";
import LoginRouterComponent from "./component/RouterComponent/LoginRouterComponent/LoginRouterComponent";
import i18n from "./i18n";

const initI18n = i18n;

export const AuthContext = createContext<any>(undefined);

export default function App() {
  const [state, dispatch] = useReducer(
    (prevState: any, action: { type: any; status: any }) => {
      switch (action.type) {
        case "SIGN_IN":
          return {
            ...prevState,
            isLogged: true,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isLogged: false,
          };
        case "RESTORE":
          return {
            ...prevState,
            isLogged: action.status,
            isLoading: false,
          };
      }
    },
    {
      isLoading: true,
      isLogged: isLoggedIn(),
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      dispatch({ type: "RESTORE", status: await isLoggedIn() });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async () => {
        await isLoggedIn();
        dispatch({ ...state, type: "SIGN_IN" });
      },
      signOut: async () => {
        await clearAuthTokens();
        dispatch({ ...state, type: "SIGN_OUT" });
      },
    }),
    []
  );

  if (state.isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <NativeBaseProvider>
      <AuthContext.Provider value={authContext}>
        {state.isLogged ? (
          <AppRouterComponent></AppRouterComponent>
        ) : (
          <LoginRouterComponent></LoginRouterComponent>
        )}
      </AuthContext.Provider>
    </NativeBaseProvider>
  );
}
