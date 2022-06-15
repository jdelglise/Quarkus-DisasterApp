import { useMachine } from "@xstate/react";
import {
  Box, Button, Column,
  FormControl,
  Heading,
  Input,
  ScrollView,
  WarningOutlineIcon
} from "native-base";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RegistrationMachine from "./RegistrationMachine";


export default function RegistrationComponent() {
  const [state, send] = useMachine(RegistrationMachine);
  return (
    <Box borderRadius={10} bgColor={"white"} shadow="7">
      <ScrollView h="50vh">
      <Column space={5} padding={5} paddingTop={10}>
          <Heading>Registration Form</Heading>
          <FormControl>
            <Input
              InputLeftElement={<Icon name="account-outline" size={20} />}
              size="lg"
              variant="outline"
              placeholder="Username"
              shadow="1"
              onChangeText={(text) => {
                send({
                  type: "UPDATE_USERNAME",
                  data: text,
                });
              }}
              value={state.context.login}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {state.context.loginError}
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
              InputLeftElement={<Icon name="key-outline" size={20} />}
              size="lg"
              variant="outline"
              placeholder="Password"
              shadow="1"
              type="password"
              onChangeText={(text) => {
                send({
                  type: "UPDATE_PASSWORD",
                  data: text,
                });
              }}
              value={state.context.password}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {state.context.passwordError}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl>
            <Input
              InputLeftElement={<Icon name="key-outline" size={20} />}
              size="lg"
              type="password"
              variant="outline"
              placeholder="Repeat password"
              shadow="1"
              onChangeText={(text) => {
                send({
                  type: "UPDATE_PASSWORD_2",
                  data: text,
                });
              }}
              value={state.context.password_2}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {state.context.passwordError_2}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl>
            <Input
              InputLeftElement={<Icon name="account-outline" size={20} />}
              size="lg"
              variant="outline"
              placeholder="First name"
              shadow="1"
              onChangeText={(text) => {
                send({
                  type: "UPDATE_FIRSTNAME",
                  data: text,
                });
              }}
              value={state.context.firstName}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {state.context.firstNameError}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl>
            <Input
              InputLeftElement={<Icon name="account-outline" size={20} />}
              size="lg"
              variant="outline"
              placeholder="Last name"
              shadow="1"
              onChangeText={(text) => {
                send({
                  type: "UPDATE_LASTNAME",
                  data: text,
                });
              }}
              value={state.context.lastName}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {state.context.lastNameError}
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
              InputLeftElement={<Icon name="cake" size={20} />}
              size="lg"
              variant="outline"
              placeholder="Birthdate (yyyy-MM-dd)"
              shadow="1"
              onChangeText={(text) => {
                send({
                  type: "UPDATE_BIRTHDATE",
                  data: text,
                });
              }}
              value={state.context.birthdate}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {state.context.birthdateError}
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

