import i18next from "i18next";
import { Box, Button, Divider, Heading, Row } from "native-base";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text } from "react-native";
import { Card } from "react-native-elements";
import { closePublication } from "../../shared/api";

type AdsComponentsProps = {
  titre: string;
  message: string;
  id: string;
  canClose: boolean;
  alreadyOnRightRoute: boolean;
  trigger: Function;
};

export default function AdsComponents(props: AdsComponentsProps) {
  const navigation = useNavigation();

  return (
    <Box
      margin={5}
      width={"20vw"}
      borderRadius="md"
      bgColor={"white"}
      display={"flex"}
      flexWrap={"wrap"}
      maxWidth={"22vw"}
      borderWidth={1}
      borderColor={"gray.100"}
      shadow={7}
      padding={2}
    >
      <Heading textAlign={"center"}>{props.titre}</Heading>
      <Divider></Divider>
      <Box
        margin={2}
        borderColor={"black"}
        bgColor={"gray.100"}
        borderRadius="md"
        borderWidth={1}
        padding={2}
      >
        <Text>{props.message}</Text>
      </Box>
      <Row space={4}>
        {props.alreadyOnRightRoute && ( //here we should change the navigate below by something else to allow to "refresh" the route
          <Button
            margin={1}
            width={"40%"}
            marginLeft={4}
            marginRight={4}
            onPress={() =>
              navigation.push("Display publication", { id: props.id })
            }
          >
            {i18next.t("GENERIC.VIEW")}
          </Button>
        )}
        {!props.alreadyOnRightRoute && (
          <Button
            margin={1}
            width={"40%"}
            marginLeft={4}
            marginRight={4}
            onPress={() =>
              navigation.push("Display publication", { id: props.id })
            }
          >
            {i18next.t("GENERIC.VIEW")}
          </Button>
        )}
        {props.canClose && (
          <Button
            margin={1}
            width={"40%"}
            marginLeft={4}
            marginRight={4}
            colorScheme="secondary"
            variant="outline"
            onPress={async () =>
              (await closePublication(props.id)) &&
              console.log("hey") &&
              props.trigger({})
            }
          >
            {i18next.t("GENERIC.CLOSE")}
          </Button>
        )}
      </Row>
    </Box>
  );
}
