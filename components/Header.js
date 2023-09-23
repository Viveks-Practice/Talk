import React, { useState } from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { Header } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Platform } from "react-native";
import LoginModal from "./LoginModal";
import ProductModal from "./ProductModal";
import PersonaModal from "./personaModal";

const NeoHeader = ({
  selectedOption,
  setSelectedOption,
  theme,
  themes,
  setTheme,
  setMessages,
  options,
  setOptions,
  products,
  id,
  db,
  coins,
  setCoins,
}) => {
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [personaModalVisible, setPersonaModalVisible] = useState(false);
  const [personaSearchQuery, setPersonaSearchQuery] = useState("");

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
            <Pressable onPress={() => setPersonaModalVisible(true)}>
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
      <ProductModal
        productModalVisible={productModalVisible} // stored in this component's state
        setProductModalVisible={setProductModalVisible} // stored in this component's state
        onClose={() => setProductModalVisible(false)} // stored in this component's state
        products={products} // passed in from App.js
        id={id} // passed in from App.js
        db={db} // passed in from App.js
        coins={coins} // passed in from App.js
        setCoins={setCoins} // passed in from App.js
        theme={theme} // passed in from App.js
        themes={themes} // passed in from App.js
      />
      <LoginModal
        isVisible={loginModalVisible}
        onClose={() => setLoginModalVisible(false)}
      />
      <PersonaModal
        userId={id}
        db={db}
        products={products}
        personaModalVisible={personaModalVisible}
        setPersonaModalVisible={setPersonaModalVisible}
        theme={theme}
        themes={themes}
        searchQuery={personaSearchQuery}
        setSearchQuery={setPersonaSearchQuery}
        setSelectedOption={setSelectedOption}
        setTheme={setTheme}
        setMessages={setMessages}
        options={options}
        setOptions={setOptions}
        selectedOption={selectedOption}
        coins={coins}
        setCoins={setCoins}
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
