import React, { useState } from "react";
import { Card } from "react-native-elements";
import { View, StyleSheet, Text,Button} from "react-native";
import UserInformationComponent from "../component/UserInformationComponent/UserInformationComponent";



export default function UserInformationScreen({navigation, route}) {
  return (
    <Card>
      {route.params && <UserInformationComponent object = {route.params}/>}
    </Card>
  );
}