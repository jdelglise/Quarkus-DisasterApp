import {
  Box,
  Button,
  Center,
  Column,
  Container,
  Divider,
  Heading,
  Image,
  Row,
  ScrollView,
  Spacer,
  Text,
} from "native-base";
import { Card } from "react-native-elements";
import React, { useEffect, useState } from "react";
import AdsComponents from "../component/AdsComponent/AdsComponent";
import { getMyOffers, getMyRequests } from "../shared/api";
import { components } from "../shared/models";
import i18next from "i18next";
type Publication = components["schemas"]["Publication"];

type MyPublicationState = {
  offers?: Publication[];
  requests?: Publication[];
};

export default function AdsScreen() {
  const numberOfArticle = [1, 2, 3, 4, 5];
  const [state, setState] = useState<MyPublicationState>();
  const [state2, setState2] = useState<MyPublicationState>();
  const [trigger, setTrigger] = useState<undefined>();

  useEffect(() => {
    console.log("OK");
    getMyRequests().then(
      (response: Publication[]) =>
        response.length > 0 && setState({ ...state, requests: response })
    );
    getMyOffers().then(
      (response: Publication[]) =>
        response.length > 0 && setState2({ ...state2, offers: response })
    );
  }, [trigger]);

  return (
    <ScrollView maxH={"80vh"} minH={"80vh"}>
      <Card>
        <Card.Title>{i18next.t("PUBLICATION.MY_REQUEST")}</Card.Title>
        <Card.Divider />
        <Row space={4} flexWrap={"wrap"}>
          {state?.requests?.map((publication) => (
            <AdsComponents
              titre={publication.title}
              message={publication.message}
              id={publication.id}
              canClose={true}
              alreadyOnRightRoute={false}
              trigger={setTrigger}
            />
          ))}
        </Row>
      </Card>

      <Card>
        <Card.Title>{i18next.t("PUBLICATION.MY_OFFERS")}</Card.Title>
        <Card.Divider />
        <Row space={4} flexWrap={"wrap"}>
          {state2?.offers?.map((publication) => (
            <AdsComponents
              titre={publication.title}
              message={publication.message}
              id={publication.id}
              canClose={true}
              alreadyOnRightRoute={false}
              trigger={setTrigger}
            />
          ))}
        </Row>
      </Card>
    </ScrollView>
  );
}
