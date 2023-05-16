// TextInputComponent.js

import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to import the correct icon library
import themes from "../themes.json";

const MessageEntry = ({ theme, message, setMessage, sendMessage }) => {
  return (
    <View
      style={[
        messageEntryStyles.input,
        { backgroundColor: themes[theme].colorSchemes.sixth },
      ]}
    >
      <TextInput
        style={messageEntryStyles.inputText}
        value={message}
        onChangeText={setMessage}
        placeholder={themes[theme].inputPlaceholder}
        placeholderTextColor="#657284"
      />
      <TouchableOpacity onPress={sendMessage}>
        <Ionicons name="send" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const messageEntryStyles = StyleSheet.create({
  input: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#202d3a",
    marginBottom: Platform.OS === "ios" ? 5 : 0, // Add a 10px marginBottom for iOS devices
  },
  inputText: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderWidth: 0,
    borderRadius: 10,
    borderColor: "#ccc",
    color: "#fff",
    fontSize: 18,
  },
});

export default MessageEntry;
