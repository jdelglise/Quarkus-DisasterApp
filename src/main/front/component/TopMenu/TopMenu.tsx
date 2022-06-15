import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Avatar,
  Badge,
  Button,
  Column,
  Divider,
  Heading,
  Icon,
  Row,
  Spacer
} from "native-base";
import React, { useEffect, useState } from "react";
import { components } from "../../shared/models";
import { getConversations } from "../../shared/api";
type ConversationOverview = components["schemas"]["ConversationOverview"];

type ChatHeaderState = {
  conversationOverviews?: ConversationOverview[];
  unreadMessagesCount: number;
};


export default function TopMenu(props:{name: String}) {
  const navigation = useNavigation();
  const [state, setState] = useState<ChatHeaderState>({
    unreadMessagesCount: 0,
  });
  useEffect(() => {
    getConversations().then((response: ConversationOverview[]) =>
      response.length > 0 && setState({ ...state, conversationOverviews: response })
    );
  }, []);
  
  return (
    <Row
      width={"88vw"}
      height={"5vh"}
      bgColor={"white"}
      shadow={3}
      display={"flex"}
      alignItems={"center"}
      padding={2}
      space={3}
    >
      <Spacer />
      <Divider mx="9" orientation="vertical" />
      <Column>
        <Badge
          colorScheme="danger"
          rounded="full"
          mb={-6}
          mr={1}
          zIndex={1}
          variant="solid"
          alignSelf="flex-end"
          _text={{
            fontSize: 8
          }}
        >
          {state.conversationOverviews &&
                  state.conversationOverviews
                    .map((conversationOverview) => conversationOverview.unreadMessages)
                    .reduce((sum, current) => (current ? sum + current : sum))}
        </Badge>
        <Button
          leftIcon={<Icon as={MaterialIcons} name="mail" size="xl" />}
          size="md"
          variant="ghost"
          onPress={() => navigation.navigate("Messaging")}
        />
      </Column>
      <Divider mx="9" orientation="vertical" />
      <Heading size="md">{props.name}</Heading>
      <Avatar bg="blue.300" mr="1" size={"sm"}>
        {props.name.charAt(0) + props.name.charAt(1)}
      </Avatar>
    </Row>
  );
}
