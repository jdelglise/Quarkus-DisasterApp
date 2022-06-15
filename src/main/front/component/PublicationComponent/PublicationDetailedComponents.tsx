import i18next from "i18next";
import { Box, Button, Center, Column, Divider, FormControl, Heading, Tooltip, Input, Modal, Row, Container, Icon } from "native-base";
import React, { useEffect, useState } from "react";
import { Text, TextInput } from "react-native";
import { Card } from "react-native-elements";
import { closePublication, getCategory, getPublication, getRelatedPublication, getUser, getUserById, sendMessageToUser } from "../../shared/api";
import { components } from "../../shared/models";
import AdsComponents from "../AdsComponent/AdsComponent";
import { AntDesign} from "@expo/vector-icons";
type Publication = components["schemas"]["Publication"];
type User = components["schemas"]["User"];
type Category = components["schemas"]["Category"];
type Message = components["schemas"]["Message"];

type MyPublicationState = {
  author?: User;
  category?: Category;
  relatedPublication?: Publication[];
};



export default function PublicationDetailedComponents(props) {
  const [state, setState] = useState<MyPublicationState>();
  const [state2, setState2] = useState<MyPublicationState>();
  const [state3, setState3] = useState<MyPublicationState>();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [destinataire, setDestinataire] = useState("");
  var publication:Publication=props.publication
  useEffect(() => {
    getUserById(publication.creator).then( // could be improved in input param handling, but at least works
      (response: User) =>
      {setState({ ...state, author: response})
      setDestinataire(response.login)}
    );
    getRelatedPublication(publication.id).then( // could be improved in input param handling, but at least works
      (response: Publication[]) =>
      setState2({ ...state2, relatedPublication: response })
    );
    getCategory(publication.categoryId).then( // could be improved in input param handling, but at least works
      (response: Category) =>
      setState3({ ...state3, category: response })
    );
  }, []);

  return (
    <Box
      margin={5}
      borderRadius="md"
      bgColor={"blue.100"}
      display={"flex"}
      flexWrap={"wrap"}
      width={"82vw"}
      padding={2}
    >
      <Center>
      <Heading>{publication.title}</Heading>
      <Divider margin={1}></Divider>
      <Text>
      Last update : {publication.lastUpdateDate}
      </Text>
      {state?.author && <Row>
        <Column padding={1}><Text>Author : {state?.author?.login}</Text></Column>
        {state?.author.validated && <Column padding={1}><AntDesign name="checkcircleo" size={18} color="green">Validated</AntDesign></Column>}
        {!state?.author.validated && <Column padding={1}><AntDesign name="closecircleo" size={18} color="red">Unvalidated</AntDesign></Column>}
        <Column padding={1}><Button leftIcon={<Icon as={AntDesign } name="mail" size="xs" />}  size={"xs"} onPress={()=>setShowModal(true)} >{i18next.t("MESSAGING.CONTACT")}</Button></Column>
        </Row>}
      {state3?.category && <Text>Category : {state3?.category?.name}</Text>}
      <Divider margin={1}></Divider>
      {
        publication.customValues?.map(customValue => <Row><Column><Text>{customValue.name}</Text></Column><Column> : </Column><Column><Text>{customValue.value}</Text></Column> </Row> )
      }
      <Divider></Divider>
      <Box padding={2}> 
      <Card>
      <Text>
      {publication.message}
      </Text>
      </Card>
      </Box>
      <Divider></Divider>
      <Card.Title>{i18next.t("PUBLICATION.RELATED_PUBLICATIONS")}</Card.Title>
      <Divider></Divider>
        <Row space={4} flexWrap={"wrap"}>
          {
            state2?.relatedPublication?.map(relatedPublication => <AdsComponents titre={relatedPublication.title} message={relatedPublication.message} id={relatedPublication.id} canClose={false} alreadyOnRightRoute={true}/> )
          }
        </Row>
        <Card.Divider />
      </Center>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>{i18next.t("MESSAGING.NEW_MESSAGE")}</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>{i18next.t("MESSAGING.RECIPIENT")}</FormControl.Label>
              <Input defaultValue={state?.author?.login} />
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
    </Box>
  );
}
