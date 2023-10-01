import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Image,
  PanResponder,
  Animated,
} from "react-native";

const ChatWindow = ({
  messages,
  theme,
  flatListRef,
  themes,
  firebaseDataLoading,
}) => {
  const [listOpacity, setListOpacity] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [imageIndex, setImageIndex] = useState(1);
  const [imageOpacity, setImageOpacity] = useState(new Animated.Value(1));

  // Create a variable to store the modified theme
  const formattedTheme = theme.toLowerCase().replace(/ /g, "-");

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(false);
      },
      onPanResponderMove: () => {
        setIsDragging(true);
      },
      onPanResponderRelease: () => {
        if (!isDragging) {
          setListOpacity((prevOpacity) => (prevOpacity < 1 ? 1 : 0.01));
        }
      },
      onPanResponderTerminate: () => {}, // Optionally handle termination
    })
  ).current;

  function renderRandomImage() {
    // First, fade out the current image
    Animated.timing(imageOpacity, {
      toValue: 0,
      duration: 500, // Fade-out duration. Adjust as needed.
      useNativeDriver: true,
    }).start(() => {
      // Once the image has faded out, change its source
      const randomDecimal = Math.random();
      const randomNumber = Math.floor(randomDecimal * 10) + 1;
      setImageIndex(randomNumber);

      // Then, fade the image back in
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 500, // Fade-in duration. Adjust as needed.
        useNativeDriver: true,
      }).start();
    });
  }

  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].role === "assistant" &&
      !themes[theme].emptyResponses.includes(
        messages[messages.length - 1].content
      )
    ) {
      setListOpacity(0.01); // Almost invisible
      renderRandomImage();
    } else {
      setListOpacity(1);
    }
  }, [messages, theme]);

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <View
        style={[
          ChatWindowStyles.messages,
          { backgroundColor: themes[theme].colorSchemes.first },
        ]}
      >
        {/* Background Image with absolute positioning */}
        <Animated.Image
          source={{
            uri: `http://34.149.134.224/${theme}/${formattedTheme}-${imageIndex}.png`,
          }}
          style={[
            ChatWindowStyles.centerImage,
            {
              position: "absolute",
              opacity: Animated.multiply(
                imageOpacity,
                listOpacity < 1 ? 1 : 0.2
              ),
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
    // padding: 10,
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
    opacity: 1,
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
    // position: "absolute",
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 15,
    overflow: "hidden",
    // margin: 10,
    // marginBottom: 20,
    // marginTop: 20,
    // marginLeft: 20,
    // marginRight: 20,
  },
});

export default ChatWindow;
