import i18next from "i18next";
import { Box, Button, Column, FormControl, Input, Menu, Modal, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { ScrollView, TextInput } from "react-native";
import { getConversations, sendMessageToUser } from "../../shared/api";
import { components } from "../../shared/models";
type ConversationOverview = components["schemas"]["ConversationOverview"];
type Message = components["schemas"]["Message"];

type ChatMenuState = {
  conversationOverviews?: ConversationOverview[];
  unreadMessagesCount: number;
};



export default function MessagingComponent(props: { dispacth: Function }) {
  const [state, setState] = useState<ChatMenuState>({
    unreadMessagesCount: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [destinataire, setDestinataire] = useState("");

  useEffect(() => {
    getConversations().then(
      (response: ConversationOverview[]) =>
        response.length > 0 &&
        setState({ ...state, conversationOverviews: response })
    );
  }, [showModal]);

  return (
    <ScrollView >
      <Column space="2.5" mt="4" px="8" >
        <Button onPress={()=>setShowModal(true)} >{i18next.t("MESSAGING.NEW_MESSAGE")}</Button>
        {state.conversationOverviews &&
          state.conversationOverviews.map((conversationOverview) => (
            <Menu.Item 
              key={conversationOverview.id}
              onPress={() =>
                props.dispacth({
                  type: "update",
                  data: conversationOverview.id,
                })
              }
               borderRadius={"xl"} padding={5}
            >
              <Text bold>
                  {conversationOverview.correspondent &&
                    conversationOverview.correspondent}{" "}
                  (
                  {conversationOverview.unreadMessages &&
                    conversationOverview.unreadMessages}
                  )
              </Text>
              <Text fontSize="xs">
                {conversationOverview.lastUpdate &&
                  new Date(
                    conversationOverview.lastUpdate
                  ).toLocaleString()}{" "}
              </Text>
              <Text isTruncated>
              {conversationOverview.lastMessage?.message &&
                conversationOverview.lastMessage.message}
                </Text>
            </Menu.Item>
          ))}
      </Column>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>{i18next.t("MESSAGING.NEW_MESSAGE")}</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>{i18next.t("MESSAGING.RECIPIENT")}</FormControl.Label>
              <Input onChangeText={(text) => setDestinataire(text)}/>
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>{i18next.t("MESSAGING.MESSAGE")}</FormControl.Label>
              <TextInput
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => setMessage(text)}
                value={message}
              />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              setShowModal(false);
            }}>
                Cancel
              </Button>
              <Button onPress={async () => {
                const messageObject: Message = {
                  message: message
                };
              await sendMessageToUser(destinataire, messageObject);
              setShowModal(false);
            }}>
                Send
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </ScrollView>
  );
}
