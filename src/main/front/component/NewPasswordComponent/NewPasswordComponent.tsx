import React, { createRef, useContext, useState } from "react";
import { useMachine } from "@xstate/react";
import { StyleSheet, View } from "react-native";
import NewPasswordMachine, { NewPasswordMachineContext } from "./NewPasswordMachine";

import { Input, Button, Card } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { assign } from "xstate";

export default function NewPasswordComponent({ navigation }: any) {
  const [state, send] = useMachine(NewPasswordMachine);
  return (
    <View>
      <Card>
        <Input
          leftIcon={<Icon name="key-outline" size={20} />}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => {
            send({
              type: "UPDATE_PASSWORD",
              data: text,
            });
          }}
          errorMessage={state.context.passwordError}
        />
                <Input
          leftIcon={<Icon name="key-outline" size={20} />}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => {
            send({
              type: "UPDATE_PASSWORD_2",
              data: text,
            });
          }}
          errorMessage={state.context.passwordError_2}
        />
        <Button
          disabledTitleStyle={{ color: "#00F" }}
          loadingProps={{ animating: true }}
          onPress={() =>
            send({
              type: "SUBMIT",
            })
          }
          title="Reset Password"
          type="outline"
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({});
