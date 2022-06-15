import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Box, Column, Row } from "native-base";
import React, { useEffect, useState } from "react";
import AdminScreen from "../../../screen/AdminScreen";
import AdsScreen from "../../../screen/AdsScreen";
import Messaging from "../../../screen/Messaging";
import PublicationScreen from "../../../screen/PublicationCreationScreen";
import PublicationDetailedScreen from "../../../screen/PublicationDetailedScreen";
import PublicationSearch from "../../../screen/PublicationSearch";
import UserSettings from "../../../screen/UserSettings";
import { getConversations, getUser } from "../../../shared/api";
import LogoutComponent from "../../LogoutComponent/LogoutComponent";
import SideMenu from "../../SideMenu/SideMenu";
import TopMenu from "../../TopMenu/TopMenu";

const Stack = createNativeStackNavigator();

const config = {
  screens: {
    Home: "home",
    Messaging: "Messaging",
    "Display Publication": "publication-display",
    "Create Publication": "publication-creation",
    "Publication Search": "publication-search",
    UserSettings: "user-settings",
    Logout: "logout",
    Administration: "admin",
  },
};

const linking = {
  prefixes: ["http://localhost"],
  config,
};

export default function AppRouterComponent() {
  const [role, setRole] = useState<String>("User");
  const [name, setName] = useState<String>("User");

  useEffect(() => {
    getUser().then((response) => {
      response?.role && setRole(response.role);
      response.firstName && response.lastName && setName(response.firstName + " " + response.lastName);
    });
  });

  return (
    <NavigationContainer linking={linking}>
      <Row height={"100vh"} width={"100vw"} bgColor={"gray.100"}>
        <SideMenu role={role} />
        <Column>
          <TopMenu name={name}/>
          <Box display={"flex"} maxWidth={"88vw"} margin={4}>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="Home" component={AdsScreen} />
              <Stack.Screen name="Publication Search" component={PublicationSearch} />
              <Stack.Screen name="Display publication" component={PublicationDetailedScreen} />
              <Stack.Screen name="Administration" component={AdminScreen} />
              <Stack.Screen name="Create Publication" component={PublicationScreen} />
              <Stack.Screen name="UserSettings" component={UserSettings} />
              <Stack.Screen name="Messaging" component={Messaging} />
              <Stack.Screen name="Logout" component={() => <LogoutComponent/>} />
            </Stack.Navigator>
          </Box>
        </Column>
      </Row>
    </NavigationContainer>
  );
}
