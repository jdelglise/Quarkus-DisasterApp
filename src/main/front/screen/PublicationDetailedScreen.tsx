import { Box, Button, Center, Column, Container, Divider, Heading, Image, Row, ScrollView, Spacer, Text } from "native-base";
import { Card } from "react-native-elements";
import React, { useEffect, useState } from "react";
import AdsComponents from "../component/AdsComponent/AdsComponent";
import { getMyOffers, getMyRequests, getPublication } from "../shared/api";
import { components } from "../shared/models";
import i18next from "i18next";
import PublicationDetailedComponents from "../component/PublicationComponent/PublicationDetailedComponents";
type Publication = components["schemas"]["Publication"];

type MyPublicationState = {
  publication?: Publication;
};

export default function PublicationDetailedScreen(route, id: string) {// could be improved in input param handling, but at least works

  const [state, setState] = useState<MyPublicationState>();
  
  useEffect(() => {
    getPublication(route.route.params.id).then( // could be improved in input param handling, but at least works
      (response: Publication) =>
      setState({ ...state, publication: response })
    );
  }, []);


  return (
    <Card>
      <ScrollView maxH={"80vh"} minH={"80vh"}>
        <Row space={4} flexWrap={"wrap"}>
            {state?.publication && <PublicationDetailedComponents   publication={state?.publication} />}
        </Row>
      </ScrollView>
    </Card>
  );
}
