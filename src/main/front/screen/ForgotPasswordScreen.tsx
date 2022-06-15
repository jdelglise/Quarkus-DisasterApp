import { Box, Image } from "native-base";
import React from "react";
import { ImageBackground } from "react-native";
import ForgotPasswordComponent from "../component/ForgotPasswordComponent/ForgotPasswordComponent";

export default function ForgotPasswordScreen({ navigation }: any) {
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
        <Box minW={"30vw"} maxW={"100vw"}>
          <ForgotPasswordComponent />
        </Box>
      </Box>
    </ImageBackground>
  );
}
