import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const ChatWindow = ({ messages, theme, flatListRef, themes }) => {
  return (
    <View
      style={[
        ChatWindowStyles.messages,
        { backgroundColor: themes[theme].colorSchemes.first },
      ]}
    >
      {messages.length > 0 && (
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
          keyExtractor={(item) => item.id}
          ref={flatListRef}
          onContentSizeChange={() =>
            flatListRef.current.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
        />
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
});

export default ChatWindow;
