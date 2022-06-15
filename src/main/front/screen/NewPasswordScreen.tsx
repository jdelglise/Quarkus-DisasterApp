import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet, View,
  Image
} from "react-native";
import NewPasswordComponent from "../component/NewPasswordComponent/NewPasswordComponent";

export default function NewPasswordScreen({navigation}) {
  return(
    <ImageBackground
      source={require('../assets/background-login.jpg')}
      style={styles.page}>
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style ={styles.logo}
      />
      <View style={styles.loginCard}>
        <NewPasswordComponent
          navigation={navigation}
        ></NewPasswordComponent>
      </View>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  loginCard: {
    maxWidth: "100%",
    minWidth: "30%",
  },
  page: {
    height: "100%"
  },
  logo: {
    marginTop: "2%",
    width: 200,
    height: 200
  }
});