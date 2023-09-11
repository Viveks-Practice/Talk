import React, { useState } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Platform } from "react-native";
import themes from "../themes.json";
import LoginModal from "./LoginModal";

const NeoHeader = ({
  selectedOption,
  setModalVisible,
  theme,
  coins,
  setProductModalVisible,
}) => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  return (
    <View>
      <Header
        placement="center"
        centerComponent={
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable
              onPress={() => {
                setProductModalVisible(true);
              }}
              style={styles.container}
            >
              <Text style={{ marginLeft: 5, color: "white", fontSize: 14 }}>
                {coins}
              </Text>
              <Ionicons name="wallet-outline" size={24} color="#fff" />
            </Pressable>
            <Pressable onPress={() => setModalVisible(true)}>
              <Text style={[styles.headerTitle]}>
                {selectedOption}
                <Ionicons name="chevron-down-outline" size={18} color="#fff" />
              </Text>
            </Pressable>
            <View style={{ width: 24, marginLeft: 50 }} />
          </View>
        }
        rightComponent={
          <View style={styles.loginButtonContainer}>
            <Pressable
              style={[
                styles.loginButton,
                {
                  backgroundColor: themes[theme].colorSchemes.sixth,
                  shadowColor: themes[theme].colorSchemes.first,
                  borderColor: themes[theme].colorSchemes.fourth,
                },
              ]}
              onPress={() => setLoginModalVisible(true)}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </Pressable>
          </View>
        }
        containerStyle={{
          backgroundColor: themes[theme].colorSchemes.seventh,
          borderBottomColor: themes[theme].colorSchemes.eighth,
          borderBottomWidth: 1,
          marginTop: Platform.OS === "ios" ? Constants.statusBarHeight : 0,
          paddingTop: Platform.OS == "android" ? 35 : null,
        }}
      />
      <LoginModal
        isVisible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
    </View>
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
    borderWidth: 1,
    borderColor: "black",
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
  container: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 30,
    marginTop: 0,
  },
  coinsText: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
});

export default NeoHeader;
