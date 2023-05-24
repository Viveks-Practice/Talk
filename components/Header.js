import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Platform } from "react-native";
import themes from "../themes.json";

const NeoHeader = ({ selectedOption, setModalVisible, theme, navigation }) => {
  return (
    <Header
      placement="center"
      centerComponent={
        <Pressable onPress={() => setModalVisible(true)}>
          <Text style={[styles.headerTitle]}>
            {selectedOption}
            <Ionicons name="chevron-down-outline" size={18} color="#fff" />
          </Text>
        </Pressable>
      }
      rightComponent={
        <View style={styles.loginButtonContainer}>
          <Pressable
            style={styles.loginButton}
            // onPress={() => navigation.navigate("YourLoginScreen")}
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
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
    marginTop: 8,
  },
  loginButtonContainer: {
    marginRight: 10,
  },
  loginButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#161d27",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default NeoHeader;
