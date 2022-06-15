import { FontAwesome, FontAwesome5 , MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Button,
  Center,
  Column, Icon,
  Image,
  Spacer
} from "native-base";
import React from "react";
const logo = require("../../assets/logo.png");

export default function SideMenu(props: {role: String}) {
  const navigation = useNavigation();
  return (
    <Column
      bgColor={"white"}
      paddingTop={4}
      paddingBottom={4}
      width={"12vw"}
      height={"100vh%"}
      shadow={9}
      zIndex={2}
      alignContent="center"
      space={0}
    >
      <Center marginBottom={4}>
        <Image source={{ uri: logo }} alt="Logo" size="md" />
      </Center>

      {props.role == "Admin" && (
        <Button
          leftIcon={<Icon as={MaterialIcons} name="admin-panel-settings" size="xl" />}
          size="md"
          variant="ghost"
          colorScheme={"secondary"}
          onPress={() => navigation.navigate("Administration")}
        >
          Administration
        </Button>
      )}

      <Button
        leftIcon={<Icon as={FontAwesome} name="home" size="xl" />}
        size="md"
        variant="ghost"
        onPress={() => navigation.navigate("Home")}
      >
        Home
      </Button>
      <Button
        leftIcon={<Icon as={MaterialIcons} name="create" size="xl" />}
        size="md"
        variant="ghost"
        onPress={() => navigation.navigate("Create Publication")}
      >
        Create Publication
      </Button>

      <Button
        leftIcon={<Icon as={FontAwesome5} name="search" size="xl" />}
        size="md"
        variant="ghost"
        onPress={() => navigation.navigate("Publication Search")}
      >
        Search Publication
      </Button>

      

      <Spacer />
      <Button
        leftIcon={<Icon as={MaterialIcons} name="settings" size="sm" />}
        size="sm"
        variant="ghost"
        onPress={() => navigation.navigate("UserSettings")}
      >
        User Settings
      </Button>
      <Button
        leftIcon={<Icon as={MaterialIcons} name="logout" size="sm" />}
        size="sm"
        variant="ghost"
        onPress={() => navigation.navigate("Logout")}
      >
        Logout
      </Button>
    </Column>
  );
}
