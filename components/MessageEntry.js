// MessageEntry.js

import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to import the correct icon library

import themes from "../themes.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateFirestoreChat } from "../firebaseFunctions/firebaseOperations";

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
  loaded,
  anonId,
}) => {
  const [firstMessageTime, setFirstMessageTime] = useState(null);
  const [messageLimitExceeded, setMessageLimitExceeded] = useState(false);

  const url = "https://api.openai.com/v1/chat/completions";

  const sendMessage = async () => {
    // Check message limit and timestamp before sending
    if (messageCount >= 150) {
      if (!firstMessageTime) {
        setFirstMessageTime(new Date());
      } else {
        const currentTime = new Date();
        const timeDifference = currentTime - firstMessageTime;
        const timeDifferenceInHours = timeDifference / (1000 * 60 * 60);
        if (timeDifferenceInHours >= 24) {
          // More than 24 hours have passed, reset the counter
          setMessageCount(0);
          setFirstMessageTime(null);
          await AsyncStorage.setItem("messageCount", "0");
          await AsyncStorage.removeItem("firstMessageTime");
        } else {
          setMessageLimitExceeded(true);
          // Calculate the time remaining
          const timeRemaining = 24 * 60 * 60 * 1000 - timeDifference; // in milliseconds
          const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
          const minutesRemaining = Math.floor(
            (timeRemaining - hoursRemaining * 1000 * 60 * 60) / (1000 * 60)
          );
          const secondsRemaining = Math.floor(
            (timeRemaining -
              hoursRemaining * 1000 * 60 * 60 -
              minutesRemaining * 1000 * 60) /
              1000
          );

          // Display a message to the user that they have reached their limit
          alert(
            `You have reached the daily limit of 150 messages. Please try again in ${hoursRemaining} hours, ${minutesRemaining} minutes and ${secondsRemaining} seconds.`
          );

          return;
        }
      }
    }
    //proceed with the rest of the send message code
    if (!message || message.trim().length === 0) {
      return;
    }

    const newMessage = {
      id: Math.random().toString(),
      content: message,
      role: "user",
    };

    // Write the new user message to Firestore
    updateFirestoreChat(message, "user", anonId, theme);

    const emptyResponseMessage = {
      id: Math.random().toString(),
      content:
        themes[theme].emptyResponses[
          Math.floor(Math.random() * themes[theme].emptyResponses.length)
        ],
      role: "assistant",
    };

    const updatedMessage = [...messages, newMessage]; //setting the new message for the API call to GPT
    setMessages((prevMessages) => [...prevMessages, newMessage]);
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
      // Write the new AI response to Firestore
      updateFirestoreChat(aiMessage, "assistant", anonId, theme);
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
        if (messages.length == 2 || messages.length == 3) {
          setMessages([messages[0]]);
        }
        const halfIndex = Math.ceil(messages.length / 2);
        const secondHalfMessages = messages.slice(halfIndex);
        const newMessages = [messages[0], ...secondHalfMessages];

        setMessages(newMessages);
      }

      setMessageCount(messageCount + 1); //Loads interstitial message - triggers useEffect
      await AsyncStorage.setItem("messageCount", (messageCount + 1).toString());
      if (messageCount === 0) {
        const now = new Date();
        setFirstMessageTime(now);
        await AsyncStorage.setItem("firstMessageTime", now.toISOString());
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error processing your message. Please try again.");
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
