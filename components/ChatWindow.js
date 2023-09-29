import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";

const ChatWindow = ({
  messages,
  theme,
  flatListRef,
  themes,
  firebaseDataLoading,
}) => {
  const lastMessage = messages[messages.length - 1];

  const isLastMessageAssistant =
    lastMessage &&
    lastMessage.role === "assistant" &&
    !themes[theme].emptyResponses.includes(lastMessage.content);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          ChatWindowStyles.messages,
          { backgroundColor: themes[theme].colorSchemes.first },
        ]}
      >
        <ImageBackground
          source={{
            uri: "http://34.149.134.224/Harry Styles/harry-styles-romantic-date-4.png",
          }}
          style={ChatWindowStyles.centerImage}
        >
          {isLastMessageAssistant ? (
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
          ) : (
            messages.length > 0 && (
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
                              backgroundColor:
                                themes[theme].colorSchemes.second,
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
                keyExtractor={(item) => item.id}
                ref={flatListRef}
              />
            )
          )}
        </ImageBackground>
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
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 5,
    overflow: "hidden",
    justifyContent: "flex-end", // This ensures the text aligns at the bottom of the image
  },
});

export default ChatWindow;
