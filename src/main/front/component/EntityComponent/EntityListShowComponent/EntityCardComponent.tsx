import { Box, Column, Image, Row, Text } from "native-base";
import React from "react";
import { components } from "../../../shared/models";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
type Entity = components["schemas"]["Entity"];

type EntityCardProps = {
  entity: Entity;
};

export default function EntityCardComponent(props: EntityCardProps) {
  console.log(props.entity.picture);
  return (
    <Box borderRadius={10} bgColor={"white"} shadow="7" maxWidth={"20vw"} minWidth={"20vw"}>
      <Image
        width={"100%"}
        height={"10vh"}
        source={{ uri: `data:image/gif;base64,${props.entity.picture}` }}
        alt={props.entity.name + " Image"}
        borderTopRadius={10}
      />
      <Column marginLeft={10} paddingTop={4} paddingBottom={4}>
        <Row space={10}>
          <Icon name="account-outline" size={20} />
          <Text>{props.entity.name}</Text>
        </Row>
        <Row space={10}>
          <Icon name="email" size={20} />
          <Text>{props.entity.email}</Text>
        </Row>
        <Row space={10}>
          <Icon name="phone" size={20} />
          <Text>{props.entity.phoneNumber}</Text>
        </Row>
      </Column>
    </Box>
  );
}
