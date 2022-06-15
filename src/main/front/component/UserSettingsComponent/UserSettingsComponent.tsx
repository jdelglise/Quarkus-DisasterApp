import React, { useEffect, useReducer, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Button, Card, Switch } from "react-native-elements";
import { getCurrentUser, getUserPreferences } from "../../shared/api";
import { components } from "../../shared/models";

type UserPreference = components["schemas"]["UserPreference"];
type User = components["schemas"]["User"];

enum ActionType {
  INIT, UPDATE
}

type Action = {
  type: ActionType,
  data: any
}


function reducer(state: UserPreference | User, action: Action) {
  switch (action.type) {
    case ActionType.INIT:
      return action.data; 
    case ActionType.UPDATE:
      return {...state, [action.data.key]: action.data.value}
  }
}


export default function UserSettingsComponent() {
  const [userPreference, dispatchPreference] = useReducer(reducer, undefined);
  const [user, dispatchUser] = useReducer(reducer, undefined);

  useEffect(() => {
    getUserPreferences().then((response: UserPreference) =>
    dispatchPreference({type: ActionType.INIT, data: response}));
    getCurrentUser().then((response: User) =>
    dispatchUser({type: ActionType.INIT, data: response}))
  }, []);


  return !userPreference ? (
    <Card>
      <ActivityIndicator size="large" />
    </Card>
  ) : (
    <Card>
      <Card.Title>User Preferences</Card.Title>
      <Card.Divider />
      <View style={styles.item}>
        <Text>Are addresses public ?</Text>
        <Switch
          value={userPreference.publicAddresses}
          color="orange"
          onValueChange={(value) => dispatchPreference({type: ActionType.UPDATE, data: {key: 'publicAddresses', value: value}})}
        />
      </View>
      <View style={styles.item}>
        <Text>Is Birthday public ?</Text>
        <Switch
          value={userPreference.publicBirthday}
          color="orange"
          onValueChange={(value) => dispatchPreference({type: ActionType.UPDATE, data: {key: 'publicBirthday', value: value}})}
        />
      </View>
      <View style={styles.item}>
        <Text>Is email public ?</Text>
        <Switch
          value={userPreference.publicEmail}
          color="orange"
          onValueChange={(value) => dispatchPreference({type: ActionType.UPDATE, data: {key: 'publicEmail', value: value}})}
        />
      </View>
      <View style={styles.item}>
        <Text>Is Firstname public ?</Text>
        <Switch
          value={userPreference.publicFirstname}
          color="orange"
          onValueChange={(value) => dispatchPreference({type: ActionType.UPDATE, data: {key: 'publicFirstname', value: value}})}
        />
      </View>
      <View style={styles.item}>
        <Text>Is Lastname public ?</Text>
        <Switch
          value={userPreference.publicLastname}
          color="orange"
          onValueChange={(value) => dispatchPreference({type: ActionType.UPDATE, data: {key: 'publicLastname', value: value}})}
        />
      </View>
      <View style={styles.item}>
        <Text>Is Phone Number public ?</Text>
        <Switch
          value={userPreference.publicPhoneNumber}
          color="orange"
          onValueChange={(value) => dispatchPreference({type: ActionType.UPDATE, data: {key: 'publicPhoneNumber', value: value}})}
        />
      </View>
      <View style={styles.item}>
        <Button style={styles.button} title="Save" />
        <View style={{ flexGrow: 1 }}></View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  item: {
    display: "flex",
    flexDirection: "row",
    margin: "1%",
    gap: "1%",
  },
  button: {
    // width: "10rem"
  },
  list: {
    display: "flex",
    flexDirection: "column",
  },
});
