import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ForgotPasswordScreen from "../../../screen/ForgotPasswordScreen";
import LoginScreen from "../../../screen/LoginScreen";
import NewPasswordScreen from "../../../screen/NewPasswordScreen";
import RegistrationScreen from "../../../screen/RegistrationScreen";
import EntityRegisterScreen from "../../../screen/EntityRegisterScreen";
import EntityListShowScreen from "../../../screen/EntityListShowScreen";

const Stack = createNativeStackNavigator();

const config = {
  screens: {
    Login: "login",
    Registration: "registration",
    ForgotPassword: "forgot-password",
    NewPassword: "new-password",
    EntityRegister: "entity-register",
    EntityListShow: "entity-list-show",
  },
};

const linking = {
  prefixes: ["http://localhost"],
  config,
};

export default function LoginRouterComponent() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="registration"
          component={RegistrationScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="forgot-password"
          component={ForgotPasswordScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="new-password"
          component={NewPasswordScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="entity-register"
          component={EntityRegisterScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="entity-list-show"
          component={EntityListShowScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
