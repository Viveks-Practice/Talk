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
import ProductModal from "./ProductModal";

const NeoHeader = ({
  selectedOption,
  setModalVisible,
  theme,
  products,
  id,
  db,
}) => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
              style={{ marginRight: 50, marginTop: 4 }}
            >
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
      <ProductModal // Add the ProductModal here
        isVisible={productModalVisible}
        onClose={() => setProductModalVisible(false)}
        products={products} // Pass the products as a prop
        id={id} // Pass the id as a prop
        db={db} // Pass the db as a prop
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
