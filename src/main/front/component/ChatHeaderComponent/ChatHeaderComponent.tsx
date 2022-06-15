import { Badge, Box, Button, FormControl, Icon, Input, Menu, Modal } from "native-base";
import React, { useEffect, useReducer, useState } from "react";
import { Pressable } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getConversations, sendMessageToUser } from "../../shared/api";
import { components } from "../../shared/models";
type ConversationOverview = components["schemas"]["ConversationOverview"];
type Message = components["schemas"]["Message"];

type ChatHeaderState = {
  conversationOverviews?: ConversationOverview[];
  unreadMessagesCount: number;
};

export default function ChatHeaderComponent() {
  const [state, setState] = useState<ChatHeaderState>({
    unreadMessagesCount: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [destinataire, setDestinataire] = useState("");

  useEffect(() => {
    getConversations().then((response: ConversationOverview[]) =>
      response.length > 0 && setState({ ...state, conversationOverviews: response })
    );
  }, []);

  return (
    <Box margin={3} padding={1} h="80%" w="90%" alignItems="flex-start">
      <Menu
        w="190"
        trigger={(triggerProps) => {
          return (
            <Pressable accessibilityLabel="More options menu" {...triggerProps}>
              <Badge // bg="red.400"
      colorScheme="danger" rounded="full" mb={-4} mr={-4} zIndex={1} variant="solid" alignSelf="flex-end" _text={{
        fontSize: 12
      }}>
          {state.conversationOverviews &&
                  state.conversationOverviews
                    .map((conversationOverview) => conversationOverview.unreadMessages)
                    .reduce((sum, current) => (current ? sum + current : sum))}
        </Badge>
              <Button
                rightIcon={<Icon as={MaterialCommunityIcons} name="email" />}
                {...triggerProps}
              />
            </Pressable>
          );
        }}
      >
        <Menu.Item onPress={()=>setShowModal(true)}>Send new message</Menu.Item>
        {state.conversationOverviews &&
          state.conversationOverviews.map((conversationOverview) => (
            <Menu.Item key={conversationOverview.id} onPress={()=>alert(conversationOverview.id)}>
              <div><b>{conversationOverview.correspondent && conversationOverview.correspondent} ({conversationOverview.unreadMessages && conversationOverview.unreadMessages})</b></div>
              <small>{conversationOverview.lastUpdate && new Date(conversationOverview.lastUpdate).toLocaleString()} </small>
              {conversationOverview.lastMessage?.message && conversationOverview.lastMessage.message}
            </Menu.Item>
          ))}
      </Menu>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Send message</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Destinataire</FormControl.Label>
              <Input onChangeText={(text) => setDestinataire(text)}/>
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Message</FormControl.Label>
              <Input onChangeText={(text) => setMessage(text)}/>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              setShowModal(false);
            }}>
                Cancel
              </Button>
              <Button onPress={() => {
                const messageObject: Message = {
                  message: message
                };
              sendMessageToUser(destinataire, messageObject);
              setShowModal(false);
            }}>
                Send
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}
