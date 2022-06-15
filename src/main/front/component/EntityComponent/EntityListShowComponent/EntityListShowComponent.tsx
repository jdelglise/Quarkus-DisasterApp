import { Box, Center, Row } from "native-base";
import React, { Key, useEffect, useReducer } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { getEntities } from "../../../shared/api";
import { components } from "../../../shared/models";
import EntityCardComponent from "./EntityCardComponent";

type EntityList = components["schemas"]["Entity"][];
type Entity = components["schemas"]["Entity"];

enum ActionType {
  INIT,
  UPDATE,
}

type Action = {
  type: ActionType;
  data: any;
};

function reducer(state: EntityList, action: Action) {
  switch (action.type) {
    case ActionType.INIT:
      return action.data;
    case ActionType.UPDATE:
      return { ...state, [action.data.key]: action.data.value };
  }
}

export default function EntityListShowComponent() {
  const [showField, dispatchField] = useReducer(reducer, undefined);

  useEffect(() => {
    getEntities().then((response: EntityList) =>
      dispatchField({ type: ActionType.INIT, data: response })
    );
  }, []);

  const showRetrievedImage = (e: any) => {
    console.log(e);
  };

  return !showField ? (
    <Center>
      <Box borderRadius={10} bgColor={"white"} shadow="7" maxWidth={"50vw"} minWidth={"30vw"} padding={5}>
        <ActivityIndicator size="large" />
      </Box>
    </Center>
  ) : (
    <ScrollView>
      <Row padding={10} space={10} maxWidth={"90vw"}>
        {showField.map((field: Entity, index: Key) => (
          <EntityCardComponent key={index} entity={field} />
        ))}
      </Row>
    </ScrollView>
  );
}
