import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Platform } from "react-native";
import themes from "../themes.json";

const NeoHeader = ({ selectedOption, setModalVisible, theme }) => {
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
  },
});

export default NeoHeader;
