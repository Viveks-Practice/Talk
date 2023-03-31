import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  ToastAndroid,
  SafeAreaView,
  ImageBackground
} from "react-native";
import Constants from "expo-constants";
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
  const flatListRef = useRef(null); // Create a reference to the FlatList component.

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

    const emptyResponseMessage = {
      id: Math.random().toString(),
      content: "Thinking...",
      role: "assistant",
    };

    const updatedMessage = [...messages, newMessage]; //setting the new message for the API call to GPT
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
    setTimeout(async () => {
      setMessages((prevMessages) => [...prevMessages, emptyResponseMessage]); // adding the Thinking... element to the array at the end, after a delay, so that the user see's the thinking bubble
                                                                              //before GPT's response
    },400);

    const requestData = {
      model: "gpt-3.5-turbo",
      messages: updatedMessage
      .map(({ id, ...rest }) => ({ ...rest })),
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ` + process.env.OPENAI_API_KEY,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const aiMessage = data.choices[0].message.content.trim();
      const tokenCount = data.usage.total_tokens;

      //setting the messages array to the old array plus the response from GPT
      //but the response is removing the Thinking... element that was added to the array, to have the thinking effect.
      setMessages((prevMessages) => {
        const lastIndex = prevMessages.length - 1;
        const updatedPrevMessages = [...prevMessages];
        updatedPrevMessages[lastIndex] = {
          ...updatedPrevMessages[lastIndex],
          content: aiMessage,
        };
        return updatedPrevMessages;
      });

      if (tokenCount > 4090) {
        if (messages.length == 1) {
          setMessages([]);
        }
        const halfIndex = Math.ceil(messages.length / 2);
        const secondHalfMessages = messages.slice(halfIndex);

        setMessages(secondHalfMessages);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "There was an error processing your message. Please try again."
      );
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true }); // Scroll to the end of the list after a new message is received
    }
  }, [messages]);

  return (
    <SafeAreaView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
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
          marginTop: Platform.OS === "ios" ? Constants.statusBarHeight : 0,
          paddingTop: Platform.OS == "android" ? 35 : null
        }}
      />
      <StatusBar
        barStyle="light-content"
        backgroundColor="#202d3a"
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
                <Text style={styles.messageText} selectable>{item.content}</Text>
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
    backgroundColor: "#161d27",
  },
  toolbarTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
  },
  statusBar: {
    backgroundColor: "#202d3a",
    color: "#fff",
    height: 30,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  messages: {
    flex: 1,
    padding: 10,
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
