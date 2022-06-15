import i18next from "i18next";
import { Box, Button, Column, Row, TextArea } from "native-base";
import React, { useReducer, useState } from "react";
import { TextInput } from "react-native";
import { Card } from "react-native-elements";
import MessagingConversationComponent from "../component/MessagingConversationComponent/MessagingConversationComponent";
import MessagingMenuComponent from "../component/MessagingMenuComponent/MessagingMenuComponent";
import { getConversation, sendMessage } from "../shared/api";
import { components } from "../shared/models";
type Conversation = components["schemas"]["Conversation"];
type ConversationOverview = components["schemas"]["ConversationOverview"];
type Message = components["schemas"]["Message"];

type MessagingState = {
  conversation: Conversation;
};

const initialState = {
  conversation: undefined,
};

export default function Messaging() {
  const [convState, setState] = useState<MessagingState>();
  const [text, setText] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);

  function reducer(state: MessagingState, action: any) {
    switch (action.type) {
      case "update":
        getConversation(action.data).then((response: Conversation) => {
          setState({ ...convState, conversation: response });
        });
    }
  }

  return (
    <Card>
      <Card.Title>{i18next.t("MESSAGING.CONVERSATIONS")}</Card.Title>
      <Card.Divider />
      <Row space={4} mb="2.5" mt="1.5" flex={1} h="100%">
        <Column mb="2.5" mt="1.5" space={3} flex={0.2} h="78vh" maxH="100%">
          <Box
            flex={1}
            bg="white"
            rounded="sm"
            _text={{
              color: "warmGray.50",
              fontWeight: "medium",
            }}
            shadow={"3"}
            borderWidth={1}
            borderColor={"gray.100"}
          >
            <MessagingMenuComponent dispacth={dispatch} />
          </Box>
        </Column>
        <Column mb="2.5" mt="1.5" space={3} flex={0.8} h="78vh" maxH="100%">
          <Row
            flexDirection={"column"}
            flex={"1"}
            bg="gray.100"
            w="100%"
            rounded="sm"
            _text={{
              color: "warmGray.50",
              fontWeight: "medium",
            }}
            shadow={"3"}
          >
            {convState?.conversation && convState?.conversation.messages && (
              <MessagingConversationComponent
                conversation={convState.conversation}
              />
            )}
          </Row>
          <Row
            bg="gray.100"
            w="100%"
            rounded="sm"
            _text={{
              color: "warmGray.50",
              fontWeight: "medium",
            }}
            shadow={"3"}
          >
            <Column flex={"auto"}>
              <TextArea
                multiline={true}
                numberOfLines={4}
                onChangeText={(val) => setText(val)}
                value={text}
              />
            </Column>
            <Column maxWidth="100">
              <Button
                h={"100%"}
                disabled={Boolean(!(convState?.conversation && text != ""))}
                onPress={async () => {
                  const messageObject: Message = {
                    message: text,
                  };
                  await sendMessage(convState?.conversation.id, messageObject);
                  setText("");
                  dispatch({
                    type: "update",
                    data: convState?.conversation.id,
                  });
                }}
              >
                Envoyer
              </Button>
            </Column>
          </Row>
        </Column>
      </Row>
    </Card>
  );
}
