import React, { useState, useRef, useEffect } from "react";
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
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "react-native-elements";
import { OPENAI_API_KEY } from "@env";

export default function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there, how can I help?",
      id: Math.random().toString(),
    },
  ]);
  const flatListRef = useRef(null); // Create a reference to the FlatList component

  const url = "https://api.openai.com/v1/chat/completions";

  const sendMessage = async () => {
    if (!message || message.trim().length === 0) {
      return;
    }

    const newMessage = {
      id: Math.random().toString(),
      content: message,
      role: "user",
    };

    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    setMessage("");

    const requestData = {
      model: "gpt-3.5-turbo",
      messages: updatedMessages.map(({ id, ...rest }) => ({ ...rest })),
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const aiMessage = data.choices[0].message.content.trim();

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Math.random().toString(),
          content: aiMessage,
          role: "assistant",
        },
      ]);
    } catch (error) {
      console.error("Error:", error);

      if (error instanceof TypeError) {
        alert(
          "There was an error processing your message. Please try again later."
        );
      } else if (error instanceof NetworkError) {
        alert(
          "Network error. Please check your internet connection and try again later."
        );
      } else {
        alert(
          "There was an error sending your message. Please try again later."
        );
      }
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true }); // Scroll to the end of the list after a new message is received
    }
  }, [messages]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#161d27" }]}>
      <Header
        placement="center"
        centerComponent={{
          text: "ChatGPT Mobile",
          style: styles.toolbarTitle,
        }}
        containerStyle={{
          backgroundColor: "#202d3a",
          borderBottomColor: "#202d3a",
          borderBottomWidth: 1,
        }}
      />
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1a252f"
        style={styles.statusBar}
      />

      <View style={styles.messages}>
        {messages.length > 0 && (
          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.message,
                  item.role === "assistant"
                    ? styles.assistantMessage
                    : styles.userMessage,
                ]}
              >
                {item.role === "assistant" && (
                  <Text style={styles.assistantTitle}>ChatGPT</Text>
                )}
                {item.role === "user" && (
                  <Text style={styles.userTitle}>You</Text>
                )}
                <Text style={styles.messageText}>{item.content}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            ref={flatListRef}
            onContentSizeChange={() =>
              flatListRef.current.scrollToEnd({ animated: true })
            }
            onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
          />
        )}
      </View>

      <View style={styles.input}>
        <TextInput
          style={styles.inputText}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          placeholderTextColor="#657284"
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#111923",
  },
  toolbarTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
  },
  statusBar: {
    backgroundColor: "#075E54",
    color: "#fff",
    height: 30,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  messages: {
    flex: 1,
    padding: 10,
    marginBottom: Platform.OS === "ios" ? 20 : 0,
    backgroundColor: "#13293D",
  },
  message: {
    padding: 10,
    backgroundColor: "#232e3b",
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  assistantMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#3e6088",
  },
  userTitle: {
    color: "#8375ff",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 0,
  },
  assistantTitle: {
    color: "#a1ffd6",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 0,
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#202d3a",
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
  scrollToEndButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 10,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  scrollToEndButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
