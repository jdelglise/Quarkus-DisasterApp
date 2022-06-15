import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Avatar, Badge } from "react-native-elements";
import { AuthContext } from "../RouterComponent/RouterComponent";
import { components } from "../../shared/models";
type User = components["schemas"]["User"];
const styles = StyleSheet.create({
  rightHeader: {
    flexDirection: "row",
    alignContent: "flex-start",
    marginRight: 10,
    alignItems: "center",
  },
});

export default function RightHeaderComponent(props) {
  const { signOut } = React.useContext(AuthContext);
  return (
    <View style={styles.rightHeader}>
      <Text>{(props.object as User).firstName} {(props.object as User).lastName}</Text>
      <View>
        <Avatar
          activeOpacity={0.2}
          containerStyle={{ backgroundColor: "#BDBDBD" }}
          rounded
          size="small"
          source={{ uri: "" }}
          title={(props?.object as User)?.firstName?.charAt(0) + (props?.object as User)?.lastName?.charAt(0)}
          onPress={() => signOut()}
        />
        <Badge
          status="success"
          containerStyle={{ position: "absolute", top: 2, left: 26 }}
        />        
      </View>
    </View>
  );
}
