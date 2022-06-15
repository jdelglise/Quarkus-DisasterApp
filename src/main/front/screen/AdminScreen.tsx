import { Center, ScrollView } from "native-base";
import React from "react";
import { Card } from "react-native-elements";
import AdminPasswordResetComponent from "../component/AdminComponent/AdminPasswordResetComponent";
import CategoryComponent from "../component/CategoryComponent/CategoryComponent";
import UserValidationComponent from "../component/UserValidationComponent/UserValidationComponent";

export default function Admin() {
  return (
    <ScrollView minH={"85vh"} maxH={"85vh"}>
      <Center>
        <Card>
          <Card.Title>Category creation</Card.Title>
          <Card.Divider />
          <CategoryComponent></CategoryComponent>
        </Card>

        <Card>
          <Card.Title>Reset User Password</Card.Title>
          <Card.Divider />
          <AdminPasswordResetComponent></AdminPasswordResetComponent>
        </Card>

        <Card containerStyle={{width: "82.5vw"}}>
          <Card.Title>User Validation</Card.Title>
          <Card.Divider />
          <UserValidationComponent/>
        </Card>
      </Center>
    </ScrollView>
  );
}
