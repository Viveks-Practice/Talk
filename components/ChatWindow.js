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
  TouchableOpacity,
} from "react-native";

const ChatWindow = ({
  messages,
  theme,
  flatListRef,
  themes,
  firebaseDataLoading,
  options,
}) => {
  const [listOpacity, setListOpacity] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [imageIndex, setImageIndex] = useState(1);
  const [imageOpacity, setImageOpacity] = useState(new Animated.Value(1));
  const [chatWindowStyleState, setChatWindowStyleState] = useState(5);

  // 1. Find the item from the options prop
  const selectedItem = options.find((item) => item.name === theme);
  // 2. Check if the price field of this item is null
  const isPriceNull = selectedItem?.price === null;

  // Create a variable to store the modified theme
  const formattedTheme = theme.toLowerCase().replace(/ /g, "-");

  // function for fading images in and out
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
      // setListOpacity(0.01); // Almost invisible
      renderRandomImage();
    } else {
      // setListOpacity(1);
    }
  }, [messages, theme]);

  return (
    <>
      {isPriceNull && (
        // JSX for the condition when price is null - there are no images
        <View style={{ flex: 1 }}>
          {/* Overlay Image */}
          <View
            style={[
              ChatWindowStyles.messages,
              {
                backgroundColor: themes[theme].colorSchemes.first,
                flex: 1,
                padding: 10,
              },
            ]}
          >
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
              onLayout={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
            />
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
      )}

      {!isPriceNull && chatWindowStyleState === 1 && (
        // JSX for the condition when price is NOT null and stateVariable is 2

        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={[
              ChatWindowStyles.imageContainerState1,
              { borderColor: themes[theme].colorSchemes.sixth },
            ]}
            activeOpacity={1}
            onPress={() => setChatWindowStyleState(2)}
          >
            <Animated.Image
              source={{
                uri: `http://34.149.134.224/${theme}/${formattedTheme}-${imageIndex}.png`,
              }}
              style={{
                position: "absolute",
                // top: -5,
                // left: -5,
                width: "100%",
                height: "130%", // Extend the height to 130% so that when we push it up by 30%, only 70% will remain visible
                // bottom: "30%", // Push the image up by 30%
                borderRadius: 10,
                overflow: "hidden",
              }}
            />
          </TouchableOpacity>
          <View
            style={[
              ChatWindowStyles.messagesState1,
              {
                backgroundColor: themes[theme].colorSchemes.first,
                flex: 1,
                padding: 10,
                paddingTop: "90%",
              },
            ]}
          >
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
              onLayout={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              ref={flatListRef}
            />
            {/* {listOpacity < 0.5 && // Using 0.5 as a threshold. Adjust as per your preference.
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
          )} */}
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
      )}

      {!isPriceNull && chatWindowStyleState === 2 && (
        // JSX for the condition when stateVariable is 3, irrespective of the price value

        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={[
              ChatWindowStyles.imageContainer,
              { borderColor: themes[theme].colorSchemes.sixth },
            ]}
            activeOpacity={1}
            onPress={() => setChatWindowStyleState(3)}
          >
            <Animated.Image
              source={{
                uri: `http://34.149.134.224/${theme}/${formattedTheme}-${imageIndex}.png`,
              }}
              style={{
                position: "absolute",
                top: -5,
                left: -5,
                width: 190,
                height: 190,
                zIndex: 1,
                borderRadius: 100,
                overflow: "hidden",
              }}
            />
          </TouchableOpacity>
          <View
            style={[
              ChatWindowStyles.messages,
              {
                backgroundColor: themes[theme].colorSchemes.first,
                flex: 1,
                padding: 10,
              },
            ]}
          >
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
              onLayout={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              contentContainerStyle={{
                paddingTop: 197, // This will be 190 (height of image) + 5 for some margin
              }}
            />
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
      )}

      {!isPriceNull && chatWindowStyleState === 3 && (
        // JSX for the condition when stateVariable is 3, irrespective of the price value

        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={[
              ChatWindowStyles.imageContainerState3,
              { borderColor: themes[theme].colorSchemes.sixth },
            ]}
            activeOpacity={1}
            onPress={() => setChatWindowStyleState(4)}
          >
            <Animated.Image
              source={{
                uri: `http://34.149.134.224/${theme}/${formattedTheme}-${imageIndex}.png`,
              }}
              style={{
                position: "absolute",
                zIndex: 1,
                width: "100%",
                height: "100%",
                borderRadius: 6,
                overflow: "hidden",
              }}
            />
          </TouchableOpacity>
          <View
            style={[
              ChatWindowStyles.messagesState3,
              {
                backgroundColor: themes[theme].colorSchemes.first,
                flex: 1,
                padding: 10,
              },
            ]}
          >
            <FlatList
              data={messages.filter((msg) => msg.role !== "system")}
              renderItem={({ item }) => (
                <>
                  <View
                    style={[
                      {
                        ...ChatWindowStyles.messageState3,
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
              onLayout={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
            />
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
      )}
      {!isPriceNull && chatWindowStyleState === 4 && (
        // JSX for the condition when stateVariable is 3, irrespective of the price value

        <View style={{ flex: 1 }}>
          <View
            style={[
              ChatWindowStyles.messagesState4,
              {
                backgroundColor: themes[theme].colorSchemes.first,
                flex: 1,
                padding: 10,
              },
            ]}
          >
            <FlatList
              data={messages.filter((msg) => msg.role !== "system")}
              renderItem={({ item }) => (
                <>
                  <View
                    style={[
                      {
                        ...ChatWindowStyles.messageState4,
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
              onLayout={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
            />
          </View>
          <TouchableOpacity
            style={[
              ChatWindowStyles.imageContainerState4,
              { borderColor: themes[theme].colorSchemes.sixth },
            ]}
            activeOpacity={1}
            onPress={() => setChatWindowStyleState(5)}
          >
            <Animated.Image
              source={{
                uri: `http://34.149.134.224/${theme}/${formattedTheme}-${imageIndex}.png`,
              }}
              style={{
                position: "absolute",
                zIndex: 1,
                width: "100%",
                height: "100%",
                borderRadius: 6,
                overflow: "hidden",
              }}
            />
          </TouchableOpacity>
          {firebaseDataLoading && (
            <View style={ChatWindowStyles.loadingOverlay}>
              <ActivityIndicator
                size="large"
                color={themes[theme].colorSchemes.fourth}
              />
            </View>
          )}
        </View>
      )}
      {!isPriceNull && chatWindowStyleState === 5 && (
        <View style={{ flex: 1 }}>
          {/* Overlay Image */}
          <View
            style={[
              ChatWindowStyles.messages,
              {
                backgroundColor: themes[theme].colorSchemes.first,
                flex: 1,
                padding: 10,
                justifyContent: "flex-end",
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => setChatWindowStyleState(1)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <Animated.Image
                source={{
                  uri: `http://34.149.134.224/${theme}/${formattedTheme}-${imageIndex}.png`,
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
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
              onLayout={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              style={{ maxHeight: "30%", flex: 0 }} // This limits the FlatList to the bottom 30%
            />
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
      )}
    </>
  );
};

const ChatWindowStyles = StyleSheet.create({
  messages: {
    flex: 0.4,
    // padding: 10,
    backgroundColor: "#13293D",
  },
  messagesState1: {
    flex: 0.4,
    // padding: 10,
    backgroundColor: "#13293D",
  },
  messagesState3: {
    flex: 0.4,
    // padding: 10,
    backgroundColor: "#13293D",
  },
  messagesState4: {
    flex: 0.4,
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
  messageState1: {
    padding: 10,
    backgroundColor: "#232e3b",
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "flex-start",
    maxWidth: "45%",
    marginLeft: "52%",
  },
  messageState3: {
    padding: 10,
    backgroundColor: "#232e3b",
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "flex-start",
    maxWidth: "45%",
    marginLeft: "52%",
  },
  messageState4: {
    padding: 10,
    backgroundColor: "#232e3b",
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "flex-start",
    maxWidth: "45%",
    marginRight: "52%",
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
  },
  imageContainer: {
    borderWidth: 10, // Thickness of the border
    borderColor: "black", // Color of the border, change this to your desired color
    borderRadius: 110, // If you want rounded corners, you can adjust this value
    marginBottom: 20,
    position: "absolute",
    top: 2,
    left: 2,
    width: 200,
    height: 200,
    zIndex: 1,
  },
  imageContainerState1: {
    borderWidth: 3, // Thickness of the border
    borderColor: "black", // Color of the border, change this to your desired color
    borderRadius: 10, // If you want rounded corners, you can adjust this value
    // marginBottom: 20,
    position: "absolute",
    width: "100%",
    height: "55%",
    overflow: "hidden",
    zIndex: 1,
    // marginBottom: "60%",
    // marginLeft: "2%",
  },
  imageContainerState3: {
    borderWidth: 3, // Thickness of the border
    borderColor: "black", // Color of the border, change this to your desired color
    borderRadius: 10, // If you want rounded corners, you can adjust this value
    // marginBottom: 20,
    position: "absolute",
    width: "50%",
    height: "100%",
    zIndex: 1,
    marginRight: "50%",
    // marginLeft: "2%",
  },
  imageContainerState4: {
    borderWidth: 3, // Thickness of the border
    borderColor: "black", // Color of the border, change this to your desired color
    borderRadius: 10, // If you want rounded corners, you can adjust this value
    // marginBottom: 20,
    position: "absolute",
    width: "50%",
    height: "100%",
    zIndex: 1,
    marginLeft: "50%",
    // marginLeft: "2%",
  },
});

export default ChatWindow;
