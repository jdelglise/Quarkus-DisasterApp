import i18next from "i18next";
import { Box, CheckIcon, Column, Row, ScrollView, Select } from "native-base";
import React, { useEffect, useState } from "react";
import { Card } from "react-native-elements";
import AdsComponents from "../component/AdsComponent/AdsComponent";
import {
  getAllOffers,
  getAllRequests,
  getCategoriesByType,
  getOffersByCategory,
  getRequestsByCategory,
} from "../shared/api";
import { components } from "../shared/models";
type Publication = components["schemas"]["Publication"];
type Category = components["schemas"]["Category"];

type PublicationState = {
  offers: Publication[];
  requests: Publication[];
  categories: Category[];
};

export default function AdsScreen() {
  const [state, setState] = useState<PublicationState>({
    offers: [],
    requests: [],
    categories: [],
  });
  const [category, setCategory] = useState("");
  const [publicationType, setPublicationType] = useState("");

  useEffect(() => {
    let responses = {
      requests: [] as Publication[],
      offers: [] as Publication[],
    };
    getAllRequests()
      .then((response: Publication[]) => (responses.requests = response))
      .then((_) =>
        getAllOffers().then(
          (response: Publication[]) => (responses.offers = response)
        )
      )
      .then(() =>
        setState({
          ...state,
          requests: responses.requests,
          offers: responses.offers,
        })
      );
  }, []);

  useEffect(() => {
    if (publicationType !== "")
      getCategoriesByType(publicationType).then((response: Category[]) =>
        setState({ ...state, categories: response })
      );
  }, [publicationType]);

  useEffect(() => {
    if (category !== "") {
      getRequestsByCategory(category)
        .then((response: Publication[]) =>
          setState({ ...state, requests: response })
        )
        .then((_) =>
          getOffersByCategory(category).then((response: Publication[]) =>
            setState({ ...state, offers: response })
          )
        );
    }
  }, [category]);

  return (
    <Column space={4}>
      <Card>
        <Card.Title>{i18next.t("GENERIC.SEARCH")}</Card.Title>
        <Card.Divider />
        <Row space={4} padding={4}>
          <Select
            width={"40vw"}
            accessibilityLabel="Choose Type"
            placeholder="Choose Type"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            onValueChange={(value) => {
              setPublicationType(value);
            }}
          >
            <Select.Item label="Offer" value="OFFERS" />
            <Select.Item label="Request" value="REQUESTS" />
          </Select>

          {publicationType != "" && (
            <Box>
              <Select
                width={"40vw"}
                accessibilityLabel="Choose Category"
                placeholder="Choose Category"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(item) => {
                  setCategory(item);
                }}
              >
                {state.categories?.map((category) => (
                  <Select.Item
                    label={category.name}
                    value={category?.id ? category.id : ""}
                  />
                ))}
              </Select>
            </Box>
          )}
        </Row>
      </Card>
      <ScrollView maxH={"70vh"} minH={"70vh"}>
        <Card>
          {publicationType != "OFFERS" && (
            <Column>
              <Card.Title>{i18next.t("PUBLICATION.REQUEST")}</Card.Title>
              <Card.Divider />
              <Row space={4} flexWrap={"wrap"}>
                {state.requests.map((publication) => (
                  <AdsComponents
                    titre={publication.title}
                    message={publication.message}
                    id={publication.id}
                    canClose={false}
                    alreadyOnRightRoute={false}
                  />
                ))}
              </Row>
            </Column>
          )}
          {publicationType != "REQUESTS" && (
            <Column>
              <Card.Title>{i18next.t("PUBLICATION.OFFERS")}</Card.Title>
              <Card.Divider />
              <Row space={4} flexWrap={"wrap"} width={"80vw"}>
                {state.offers.map((publication) => (
                  <AdsComponents
                    titre={publication.title}
                    message={publication.message}
                    id={publication.id}
                    canClose={false}
                    alreadyOnRightRoute={false}
                  />
                ))}
              </Row>
            </Column>
          )}
        </Card>
      </ScrollView>
    </Column>
  );
}
