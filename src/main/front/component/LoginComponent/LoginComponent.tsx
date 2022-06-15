import { useNavigation } from "@react-navigation/native";
import {
  Box,
  Button,
  Center,
  Column,
  FormControl,
  Input,
  Row,
  WarningOutlineIcon,
} from "native-base";
import React, { useContext, useState } from "react";
import { setAuthTokens } from "react-native-axios-jwt";
import { AuthContext } from "../../App";
import i18next from "../../node_modules/i18next";
import { login } from "../../shared/api";

type LoginState = {
  username: string;
  password: string;

  error: boolean;
  username_error?: string;
  password_error?: string;
};

export default function LoginComponent() {
  const { signIn } = useContext(AuthContext);
  const navigation = useNavigation();
  const [state, setState] = useState<LoginState>({
    username: "",
    password: "",
    error: false,
  });

  return (
    <Box borderRadius={10} bgColor={"white"} shadow="7">
      <Column space={5} padding={5} paddingTop={10}>
        <FormControl isInvalid={state.error}>
          <Input
            size="lg"
            variant="outline"
            placeholder={i18next.t("LOGIN.USERNAME")}
            shadow="1"
            onChangeText={(value) => setState({ ...state, username: value })}
            value={state.username}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {state.username_error}
          </FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={state.error}>
          <Input
            size="lg"
            variant="outline"
            type="password"
            placeholder={i18next.t("LOGIN.PASSWORD")}
            shadow="1"
            onChangeText={(value) => setState({ ...state, password: value })}
            value={state.password}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {state.password_error}
          </FormControl.ErrorMessage>
        </FormControl>
        <Column space={1}>
          <Button
            size="sm"
            variant="solid"
            shadow="3"
            onPress={async () => {
              let res = await handleFormSubmit(state, signIn);
              setState({
                ...state,
                error: res.error,
                password_error: res.password_error,
                username_error: res.username_error,
              });
            }}
          >
            {i18next.t("LOGIN.LOGIN")}
          </Button>
          <Button
            size="sm"
            variant="link"
            onPress={() => navigation.navigate("registration")}
          >
            {i18next.t("LOGIN.REGISTER_NOW")}
          </Button>
          <Button
            size="sm"
            variant="link"
            onPress={() => navigation.navigate("forgot-password")}
          >
            {i18next.t("LOGIN.FORGOT_PASSWORD")}
          </Button>
          <Center>
          <Row space={10}>
              <Button
                size="sm"
                variant="outline"
                onPress={() => navigation.navigate("entity-register")}
              >
                {i18next.t("LOGIN.ENTITY_REGISTER")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onPress={() => navigation.navigate("entity-list-show")}
              >
                {i18next.t("LOGIN.ENTITY_LIST")}
              </Button>
          </Row>
          </Center>
        </Column>
      </Column>
    </Box>
  );
}
async function handleFormSubmit(
  state: LoginState,
  signInFunction: Function
): Promise<LoginState> {
  state.error = false;
  state.username_error = "";
  state.password_error = "";

  if (state.username === "") {
    state.username_error = "Username is empty !";
    state.error = true;
  }

  if (state.password === "") {
    state.password_error = "Password is empty !";
    state.error = true;
  }

  if (!state.error) {
    await login({ username: state.username, password: state.password })
      .then(async (_) => {
        await signInFunction()
      }
        )
      .catch((error) => {
        console.log(error.response.status);
        state.error = true;
        if (error.response.status != 404)
          state.password_error = "Service not available";
        else state.password_error = "Username or password incorrect";
      });
  }
  return state;
}
