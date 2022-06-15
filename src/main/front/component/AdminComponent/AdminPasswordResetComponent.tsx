import React, { useEffect, useReducer, useState } from "react";
import { getUserPreferences } from "../../shared/api";
import { components } from "../../shared/models";
import { useMachine } from "@xstate/react";
import { StyleSheet, View } from "react-native";

import { Card } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { assign } from "xstate";
import AdminMachine from "./AdminPasswordResetMachine";
import { Button, Center, Column, Input, Row } from "native-base";

export default function AdminPasswordResetComponent({ navigation }: any) {
  const [state, send] = useMachine(AdminMachine);
  return (
    <Column space={4}>
      <Row space={4}>
        <Input
          width={"40vw"}
          leftIcon={<Icon name="account-outline" size={20} />}
          placeholder="Login"
          onChangeText={(text) => {
            send({
              type: "UPDATE_ID",
              data: text,
            });
          }}
          errorMessage={state.context.idError}
        />
        <Input
          width={"40vw"}
          leftIcon={<Icon name="account-outline" size={20} />}
          placeholder="Password"
          onChangeText={(text) => {
            send({
              type: "UPDATE_PASSWORD",
              data: text,
            });
          }}
          errorMessage={state.context.passwordError}
        />
        </Row>
        <Center>
        <Button
        width={"40vw"}
          disabledTitleStyle={{ color: "#00F" }}
          loadingProps={{ animating: true }}
          onPress={() =>
            send({
              type: "SUBMIT",
            })
          }
          type="outline"
        >
          Reset Password
          </Button>
        </Center>
    </Column>
  );
}