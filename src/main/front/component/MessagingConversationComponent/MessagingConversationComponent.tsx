import { Badge, Box, Button, Center, Column, Divider, HStack, Icon, Menu, Row, Stack, View, VStack, Text } from "native-base";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { components } from "../../shared/models";
type Conversation = components["schemas"]["Conversation"];


type ChatMenuProps = {
  conversation: Conversation;
}

export default function MessagingConversationComponent(props: ChatMenuProps) {
  
  return (<ScrollView>
        {props.conversation && props.conversation.messages &&
          props.conversation.messages.map((message) => (
            message.sender == props.conversation.correspondent ?
          <Row>
            <Column space="2.5" mt="1" px="8" flex={0.5}>
              <View backgroundColor={"cyan.100"} padding="1" paddingLeft={"3"} >
                <Text bold>{message.sender && message.sender}</Text>
                <Text fontSize="xs">{message.creationDate && new Date(message.creationDate).toLocaleString()} </Text>
                <Text>{message.message && message.message}</Text>
              </View>
        </Column>
        </Row>
        :
        <Row>
        <Column space="2.5" mt="1" px="8" flex={0.5} />
        <Column space="2.5" mt="1" px="8" flex={0.5} >
              <View backgroundColor={"green.100"} padding="1" paddingLeft={"3"} >
                <Text bold>{message.sender && message.sender}</Text>
                <Text fontSize="xs">{message.creationDate && new Date(message.creationDate).toLocaleString()} </Text>
                <Text>{message.message && message.message}</Text>
              </View>
            </Column>
          </Row>
          ))}
    </ScrollView>
  );
}