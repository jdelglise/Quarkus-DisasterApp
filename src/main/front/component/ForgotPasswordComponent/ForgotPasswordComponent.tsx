import { Box, Column, Heading } from "native-base";
import React from "react";

export default function ForgotPasswordComponent({ navigation }: any) {
  return (
    <Box borderRadius={10} bgColor={"white"} shadow="7">
      <Column space={5} padding={5} paddingTop={10}>
        <Heading size="md">
          To reset your password, contact your local administrator.
        </Heading>
      </Column>
    </Box>
  );
}
