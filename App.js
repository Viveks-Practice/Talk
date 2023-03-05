import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  FlatList,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { API_KEY } from "@env";

export default function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (message.trim().length === 0) {
      return;
    }

    try {
      const response = await fetch(
        "https://api.openai.com/v1/engines/davinci-codex/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + API_KEY,
          },
          body: JSON.stringify({
            prompt: `User: ${message}\nAI:`,
            max_tokens: 50,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const aiMessage = data.choices[0].text.trim();

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Math.random().toString(),
          text: message,
          sender: "user",
        },
        {
          id: Math.random().toString(),
          text: aiMessage,
          sender: "ai",
        },
      ]);

      setMessage("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Image
          source={{ uri: "https://via.placeholder.com/50" }}
          style={styles.titleBarImage}
        />
        <Text style={styles.titleBarText}>Chat Title</Text>
      </View>
      <View style={styles.messages}>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View
              style={[styles.message, item.sender === "ai" && styles.aiMessage]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={styles.input}>
        <TextInput
          style={styles.inputText}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, // add padding top to handle status bar on android
  },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#075e54",
    height: 60,
    paddingHorizontal: 10,
  },
  titleBarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  titleBarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  titleBarIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  messages: {
    flex: 1,
    padding: 10,
    marginBottom: Platform.OS === "ios" ? 20 : 0, // add margin bottom to handle bottom safe area on ios
  },
  message: {
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  aiMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  inputText: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
  },
});
