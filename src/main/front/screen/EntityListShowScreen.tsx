import { Box, Center, Image } from "native-base";
import React from "react";
import { ImageBackground } from "react-native";
import EntityListShowComponent from "../component/EntityComponent/EntityListShowComponent/EntityListShowComponent";

export default function EntityRegisterScreen({ navigation }: any) {
  const img = require("../assets/logo.png");

  return (
    <ImageBackground
      source={require("../assets/background-login.jpg")}
      style={{
        height: "100vh",
      }}
    >
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Image
          source={{ uri: img }}
          width={200}
          height={200}
          marginTop={10}
          marginBottom={10}
        />
        <Center>
          <Box minW={"100vw"} maxW={"100vw"}>
            <EntityListShowComponent />
          </Box>
        </Center>
      </Box>
    </ImageBackground>
  );
}
