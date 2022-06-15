import { ScrollView } from "native-base";
import React, { useEffect, useState } from "react";
import { Card } from "react-native-elements";
import UserInformationComponent from "../component/UserInformationComponent/UserInformationComponent";
import UserSettingsComponent from "../component/UserSettingsComponent/UserSettingsComponent";
import { getUser } from "../shared/api";



export default function UserSettings() {

  const [user, setUser] = useState();

  useEffect(() => {
    getUser().then((response) => {
      setUser(response);
    });
  }, []);

  return (
    <ScrollView minH={"80vh"} maxH={"90vh"} width={"85vw"}>
      <UserInformationComponent object = {user}/>
      <UserSettingsComponent></UserSettingsComponent>
    </ScrollView>
  );
}

