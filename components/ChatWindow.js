import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Image,
} from "react-native";

const ChatWindow = ({
  messages,
  theme,
  flatListRef,
  themes,
  firebaseDataLoading,
}) => {
  const [listOpacity, setListOpacity] = useState(1);

  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].role === "assistant" &&
      !themes[theme].emptyResponses.includes(
        messages[messages.length - 1].content
      )
    ) {
      setListOpacity(0.3); // Almost invisible
    } else {
      setListOpacity(1);
    }
  }, [messages, theme]);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          ChatWindowStyles.messages,
          { backgroundColor: themes[theme].colorSchemes.first },
        ]}
      >
        {/* Background Image with absolute positioning */}
        <Image
          source={{
            uri: "http://34.149.134.224/Harry Styles/harry-styles-romantic-date-4.png",
          }}
          style={[
            ChatWindowStyles.centerImage,
            {
              position: "absolute",
              opacity: listOpacity < 1 ? 1 : 0.2,
            },
          ]}
          resizeMode="cover"
        />
        <FlatList
          data={messages.filter((msg) => msg.role !== "system")}
          renderItem={({ item }) => (
            <>
              <View
                style={[
                  {
                    ...ChatWindowStyles.message,
                    backgroundColor: themes[theme].colorSchemes.second,
                  },
                  item.role === "assistant"
                    ? {
                        ...ChatWindowStyles.assistantMessage,
                        backgroundColor: themes[theme].colorSchemes.second,
                      }
                    : {
                        ...ChatWindowStyles.userMessage,
                        backgroundColor: themes[theme].colorSchemes.third,
                      },
                ]}
              >
                {item.role === "assistant" && (
                  <Text
                    style={[
                      ChatWindowStyles.assistantTitle,
                      { color: themes[theme].colorSchemes.fourth },
                    ]}
                  >
                    {themes[theme].Title}
                  </Text>
                )}
                {item.role === "user" && (
                  <Text
                    style={[
                      ChatWindowStyles.userTitle,
                      { color: themes[theme].colorSchemes.fifth },
                    ]}
                  >
                    You
                  </Text>
                )}
                <Text style={ChatWindowStyles.messageText} selectable>
                  {item.content}
                </Text>
              </View>
            </>
          )}
          style={{ opacity: listOpacity }} // Applying opacity here
          keyExtractor={(item) => item.id}
          ref={flatListRef}
        />
        {listOpacity < 0.5 && // Using 0.5 as a threshold. Adjust as per your preference.
          messages.length > 0 &&
          messages[messages.length - 1].role === "assistant" && (
            <View
              style={[
                ChatWindowStyles.message,
                ChatWindowStyles.assistantMessage,
                {
                  backgroundColor: themes[theme].colorSchemes.second,
                },
              ]}
            >
              <Text
                style={[
                  ChatWindowStyles.assistantTitle,
                  { color: themes[theme].colorSchemes.fourth },
                ]}
              >
                {themes[theme].Title}
              </Text>
              <Text style={ChatWindowStyles.messageText} selectable>
                {messages[messages.length - 1].content}
              </Text>
            </View>
          )}
      </View>

      {firebaseDataLoading && (
        <View style={ChatWindowStyles.loadingOverlay}>
          <ActivityIndicator
            size="large"
            color={themes[theme].colorSchemes.fourth}
          />
        </View>
      )}
    </View>
  );
};

const ChatWindowStyles = StyleSheet.create({
  messages: {
    flex: 1,
    padding: 5,
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
    opacity: 0.9,
  },
  userMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#232e3b",
  },
  assistantTitle: {
    color: "#a1ffd6",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 0,
  },
  userTitle: {
    color: "#8375ff",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 0,
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  centerImage: {
    position: "absolute",
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 5,
    overflow: "hidden",
    margin: 10,
  },
});

export default ChatWindow;
