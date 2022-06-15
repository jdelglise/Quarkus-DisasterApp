import { useMachine } from "@xstate/react";
import {
  Box,
  Button,
  Center,
  Column,
  FormControl,
  Heading,
  Input,
  ScrollView,
  WarningOutlineIcon,
} from "native-base";
import React, { useState } from "react";
import { Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import EntityRegisterMachine from "./EntityRegisterMachine";

export default function EntityRegisterComponent() {
  const [state, send] = useMachine(EntityRegisterMachine);
  const [selectedImage, setSelectedImage] = useState();

  const uploadImage = (e: any) => {
    let baseURL = "";
    let reader = new FileReader();
    let file = e.target.files[0];
    console.log(e);
    const maxAllowedSize = 5 * 1024 * 1024; //max. 5mb
    if (!(file.size > maxAllowedSize)) {
      setSelectedImage(e.target.files[0]);
    }
    reader.readAsDataURL(file);

    reader.onload = () => {
      // Make a fileInfo Object
      console.log("Called", reader);
      baseURL = reader.result as string;
      console.log(baseURL);
      send({
        type: "UPDATE_PICTURE",
        data: baseURL.split(",")[1], //Remove "image/png;base64," at the beginning of string
      });
    };
  };

  return (
    <Box borderRadius={10} bgColor={"white"} shadow="7">
      <ScrollView h="50vh">
        <Column space={5} padding={5} paddingTop={10}>
          <Heading>Entity Registration Form</Heading>
          <input
            id="profilePic"
            type="file"
            style={{ display: "none" }}
            accept="image/png, image/jpeg"
            onChange={(e) => {
              uploadImage(e);
            }}
          />
          <label htmlFor="profilePic">
            <Button>Upload Logo</Button>
            {selectedImage && (
              <Center>
              <Image
                source={URL.createObjectURL(selectedImage) as any}
                style={{ width: 100, height: 100, marginTop: 10 }}
                //alt="Thumb"
              />
              </Center>
            )}
          </label>
          <FormControl>
            <Input
              InputLeftElement={<Icon name="account-outline" size={20} />}
              size="lg"
              variant="outline"
              placeholder="Name"
              shadow="1"
              onChangeText={(text) => {
                send({
                  type: "UPDATE_NAME",
                  data: text,
                });
              }}
              value={state.context.name}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {state.context.nameError}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl>
            <Input
              InputLeftElement={<Icon name="email" size={20} />}
              size="lg"
              variant="outline"
              placeholder="Email"
              shadow="1"
              onChangeText={(text) => {
                send({
                  type: "UPDATE_EMAIL",
                  data: text,
                });
              }}
              value={state.context.email}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {state.context.emailError}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl>
            <Input
              InputLeftElement={<Icon name="phone" size={20} />}
              size="lg"
              variant="outline"
              placeholder="Phone number"
              shadow="1"
              onChangeText={(text) => {
                send({
                  type: "UPDATE_PHONE",
                  data: text,
                });
              }}
              value={state.context.phoneNumber}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {state.context.phoneNumberError}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl>
            <Input
              InputLeftElement={<Icon name="home" size={20} />}
              size="lg"
              variant="outline"
              placeholder="Street"
              shadow="1"
              onChangeText={(text) => {
                send({
                  type: "UPDATE_STREET",
                  data: text,
                });
              }}
              value={state.context.street}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {state.context.streetError}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl>
            <Input
              InputLeftElement={<Icon name="home" size={20} />}
              size="lg"
              variant="outline"
              placeholder="Number"
              shadow="1"
              onChangeText={(text) => {
                send({
                  type: "UPDATE_NUMBER",
                  data: text,
                });
              }}
              value={state.context.number}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {state.context.numberError}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl>
            <Input
              InputLeftElement={<Icon name="home" size={20} />}
              size="lg"
              variant="outline"
              placeholder="City"
              shadow="1"
              onChangeText={(text) => {
                send({
                  type: "UPDATE_CITY",
                  data: text,
                });
              }}
              value={state.context.city}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {state.context.cityError}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl>
            <Input
              InputLeftElement={<Icon name="home" size={20} />}
              size="lg"
              variant="outline"
              placeholder="Postcode"
              shadow="1"
              onChangeText={(text) => {
                send({
                  type: "UPDATE_POSTCODE",
                  data: text,
                });
              }}
              value={state.context.postCode}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {state.context.postCodeError}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl>
            <Input
              InputLeftElement={<Icon name="home" size={20} />}
              size="lg"
              variant="outline"
              placeholder="Country"
              shadow="1"
              onChangeText={(text) => {
                send({
                  type: "UPDATE_COUNTRY",
                  data: text,
                });
              }}
              value={state.context.country}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {state.context.countryError}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl>
            <Input
              InputLeftElement={<Icon name="account-outline" size={20} />}
              size="lg"
              variant="outline"
              placeholder="Administrator"
              shadow="1"
              onChangeText={(text) => {
                send({
                  type: "UPDATE_ADMINISTRATOR",
                  data: text,
                });
              }}
              value={state.context.administrator}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {state.context.administratorError}
            </FormControl.ErrorMessage>
          </FormControl>
          <Button
            size="sm"
            variant="solid"
            shadow="3"
            onPress={() =>
              send({
                type: "SUBMIT",
              })
            }
          >
            Register Now !
          </Button>
        </Column>
      </ScrollView>
    </Box>
  );
}
