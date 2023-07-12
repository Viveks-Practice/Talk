import React, { useState } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  Modal,
  TextInput,
  Button,
  Image,
} from "react-native";
import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Platform } from "react-native";
import themes from "../themes.json";
import LoginModal from "./LoginModal";
import avatarImage from "../assets/icon-top-g.png";

const NeoHeader = ({ selectedOption, setModalVisible, theme }) => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Handle login logic here
    console.log(
      `Logging in with username: ${username} and password: ${password}`
    );
    setLoginModalVisible(false);
  };

  return (
    <Header
      placement="center"
      centerComponent={
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              overflow: "hidden",
              marginRight: 10,
              borderWidth: 2,
              borderColor: themes[theme].colorSchemes.eighth,
            }}
          >
            <Image
              source={avatarImage}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
          <Pressable>
            <Text style={[styles.headerTitle]}>{selectedOption}</Text>
          </Pressable>
        </View>
      }
      // rightComponent={
      //   <View style={styles.loginButtonContainer}>
      //     <Pressable
      //       style={[
      //         styles.loginButton,
      //         {
      //           backgroundColor: themes[theme].colorSchemes.sixth,
      //           shadowColor: themes[theme].colorSchemes.first,
      //           borderColor: themes[theme].colorSchemes.fourth,
      //         },
      //       ]}
      //       onPress={() => setLoginModalVisible(true)}
      //     >
      //       <Text style={styles.loginButtonText}>Log In</Text>
      //     </Pressable>
      //   </View>
      // }
      containerStyle={{
        backgroundColor: themes[theme].colorSchemes.seventh,
        borderBottomColor: themes[theme].colorSchemes.eighth,
        borderBottomWidth: 1,
        marginTop: Platform.OS === "ios" ? Constants.statusBarHeight : 0,
        paddingTop: Platform.OS == "android" ? 35 : null,
      }}
    >
      <LoginModal
        isVisible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
    </Header>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
    marginTop: 4,
  },
  loginButtonContainer: {
    marginRight: 10,
  },
  loginButton: {
    borderWidth: 1, // Adjust the value as per your preference
    borderColor: "black", // Set the color of the outline
    padding: 10,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#161d27",
    shadowColor: "#ffda2f",
    shadowOpacity: 0.9,
    shadowRadius: 10.22,
    elevation: 5,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 10,
  },
});

export default NeoHeader;
