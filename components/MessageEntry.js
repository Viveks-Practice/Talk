// MessageEntry.js

import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to import the correct icon library

import themes from "../themes.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  updateFirestoreChat,
  updateFirestoreContext,
  incrementCoins,
} from "../firebaseFunctions/firebaseOperations";

const MessageEntry = ({
  theme,
  message,
  setMessage,
  setMessages,
  messages,
  setMessageCount,
  messageCount,
  setAdIndex,
  adIndex,
  anonId,
  db,
  firebaseDataLoading,
  context,
  setContext,
  setCoins,
}) => {
  const [firstMessageTime, setFirstMessageTime] = useState(null);

  const gcfUrl =
    "https://us-central1-chat-window-widget.cloudfunctions.net/openai-gpt-request-neo";

  const sendMessage = async () => {
    let contextSize = context;
    let userFirestoreOperation, aiFirestoreOperation;

    if (!message || message.trim().length === 0) {
      return;
    }

    const newMessage = {
      id: Math.random().toString(),
      content: message,
      role: "user",
    };

    // Write the new user message to Firestore
    userFirestoreOperation = updateFirestoreChat(
      message,
      "user",
      anonId,
      theme,
      db,
      contextSize + 1
    );

    const emptyResponseMessage = {
      id: Math.random().toString(),
      content:
        themes[theme].emptyResponses[
          Math.floor(Math.random() * themes[theme].emptyResponses.length)
        ],
      role: "assistant",
    };

    const firstMessage = messages[0];
    const slicedMessages = messages.slice(-contextSize);
    const updatedMessage = [firstMessage, ...slicedMessages, newMessage]; //setting the new message for the API call to GPT

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setContext(context + 1);
    setMessage("");
    setAdIndex(adIndex + 1);
    setTimeout(async () => {
      setMessages((prevMessages) => [...prevMessages, emptyResponseMessage]); // adding the Thinking... element to the array at the end, after a delay, so that the user see's the thinking bubble
      //before GPT's response
    }, 400);

    const requestData = {
      model: "gpt-3.5-turbo",
      messages: updatedMessage.map(({ id, ...rest }) => ({ ...rest })),
    };

    let tokenCount = 0;

    try {
      // Make a call to your Google Cloud Function
      const response = await fetch(gcfUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Other headers your Cloud Function may need
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        // half the context in case that was the issue
        updateFirestoreContext(
          anonId,
          theme,
          db,
          Math.floor((contextSize + 2) / 2)
        );
        setContext(Math.floor((contextSize + 2) / 2));
        console.log(
          "The conversation has been truncated, as the message made the context too long: ",
          contextSize
        );

        //throw the error, but it should not occur again if the issue was the context size
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const aiMessage = data.choices[0].message.content.trim();
      // Write the new AI response to Firestore
      aiFirestoreOperation = updateFirestoreChat(
        aiMessage,
        "assistant",
        anonId,
        theme,
        db,
        contextSize + 2
      );

      tokenCount = data.usage.total_tokens;
      console.log("tokenCount: ", tokenCount);

      //setting the messages array to the old array plus the response from GPT
      //but the response is removing the Thinking... element that was added to the array, to have the thinking effect.
      setMessages((prevMessages) => {
        const lastIndex = prevMessages.length - 1;
        const updatedPrevMessages = [...prevMessages];
        updatedPrevMessages[lastIndex] = {
          ...updatedPrevMessages[lastIndex],
          content: aiMessage,
        };

        setContext(context + 2);

        return updatedPrevMessages;
      });

      setMessageCount(messageCount + 1); //Loads interstitial message - triggers useEffect
      await AsyncStorage.setItem("messageCount", (messageCount + 1).toString());
      if (messageCount === 0) {
        const now = new Date();
        setFirstMessageTime(now);
        await AsyncStorage.setItem("firstMessageTime", now.toISOString());
      }

      await incrementCoins(db, anonId, setCoins);
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error processing your message. Please try again.");
    } finally {
      if (tokenCount > 4090) {
        await Promise.all([userFirestoreOperation, aiFirestoreOperation]);
        if (messages.length == 2 || messages.length == 3) {
          updateFirestoreContext(anonId, theme, db, 1);
          setContext(0);
        } else {
          updateFirestoreContext(
            anonId,
            theme,
            db,
            Math.floor((contextSize + 2) / 2)
          );
          setContext(Math.floor((contextSize + 2) / 2));
        }

        console.log("The conversation has been truncated.");
      }
    }
  };

  useEffect(() => {
    const getMessageCount = async () => {
      const storedMessageCount = await AsyncStorage.getItem("messageCount");
      const storedFirstMessageTime = await AsyncStorage.getItem(
        "firstMessageTime"
      );
      if (storedMessageCount !== null) {
        setMessageCount(Number(storedMessageCount));
      }
      if (storedFirstMessageTime !== null) {
        setFirstMessageTime(new Date(storedFirstMessageTime));
      }
    };

    getMessageCount();
  }, []);

  return (
    <View>
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
      {firebaseDataLoading && (
        <View style={messageEntryStyles.loadingOverlay}></View>
      )}
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
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
});

export default MessageEntry;
