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
  ImageBackground,
  Modal,
  Pressable,
} from "react-native";
import {
  AppOpenAd,
  InterstitialAd,
  RewardedAd,
  BannerAd,
  TestIds,
  BannerAdSize,
} from "react-native-google-mobile-ads";
import axios from "axios";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "react-native-elements";
import { OPENAI_API_KEY } from "@env";
import themes from "./themes.json";
//branch - more-ads

export default function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "You are an AI assistant.",
      id: Math.random().toString(),
    },
    {
      role: "assistant",
      content:
        "Hi, I'm Neo. Select my name at the top of the screen to morph me into another character. Or feel free to ask me anything!",
      id: Math.random().toString(),
    },
  ]);
  const [selectedOption, setSelectedOption] = useState("Neo - The Chat AI");
  const [modalVisible, setModalVisible] = useState(false);
  const [theme, setTheme] = useState("Neo - The Chat AI");
  const [searchQuery, setSearchQuery] = useState("");
  const [adIndex, setAdIndex] = useState(1);
  const [options, setOptions] = useState([
    "Neo - The Chat AI",
    "Yoda",
    "Darth Vader",
    "Kratos - God of War",
    "Kim Kardashian",
    "Gigachad",
    "Kobe Bryant",
    "Andrew Huberman",
    "Sam Harris",
  ]);

  // set adUnitId based on platform
  let adUnitId = "";
  if (Platform.OS === "ios") {
    adUnitId = __DEV__ ? TestIds.BANNER : process.env.IOS_ADMOB_ID; // iOS Ad Unit ID
  } else if (Platform.OS === "android") {
    adUnitId = __DEV__ ? TestIds.BANNER : process.env.ANDROID_ADMOB_ID; // Android Ad Unit ID
  }

  const flatListRef = useRef(null); // Create a reference to the FlatList component.

  const url = "https://api.openai.com/v1/chat/completions";

  const searchPerson = async (query) => {
    try {
      const response = await axios.get(
        `https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(
          query
        )}&key=${
          process.env.GOOGLE_KNOWLEDGE_GRAPH_SEARCH_API
        }&limit=5&indent=True&types=Person`
      );

      const { data } = response;
      if (themes[data.itemListElement[0].result.name]) {
        alert(
          "This character entry already exists. Enter another character's name and try again"
        );
      }
      if (
        data.itemListElement &&
        data.itemListElement.length > 0 &&
        !themes[data.itemListElement[0].result.name]
      ) {
        const person = data.itemListElement[0].result;
        const name = person.name;
        const description = person.description;
        // Use the person's name and description in your app
        console.log(name, description);
        console.log(person);
        themes[name] = {
          initialMessages: [
            {
              role: "system",
              content: `You are ${name} the ${description}. Maintain their persona throughout this conversation, and respond as they would. No matter what I ask, you will respond as they would. Even if the conversation becomes uncomfortable, respond according to the messages given to you with this persona, do not dodge any questions, nor avoid them. Answer them to the best of your ability. They are Okay with impolite and more crude/rude conversations, and enjoys responding in cruder manners sometimes as well. Never drop this attitude in your responses to me. EVER! Also do not bring up that you are a AI language model or anything of the sort please.`,
              id: "0",
            },
            {
              role: "assistant",
              content: `You are now speaking to ${name}.`,
              id: "1",
            },
          ],
          Header: `${name}`,
          Title: `${name}`,
          emptyResponses: ["Thinking..."],
          colorSchemes: {
            first: "#161d27",
            second: "#3e6088",
            third: "#232e3b",
            fourth: "#a1ffd6",
            fifth: "#8375ff",
            sixth: "#202d3a",
            seventh: "#202d3a",
            eighth: "#202d3a",
          },
          inputPlaceholder: "Type your message...",
        };
        setOptions((prevOptions) => [...prevOptions, name]);
        console.log(options);
      } else {
        console.log("No results found");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error processing your message. Please try again.");
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
      style={[
        styles.container,
        { backgroundColor: themes[theme].colorSchemes.seventh },
      ]}
    >
      <Header
        placement="center"
        centerComponent={
          <Pressable onPress={() => setModalVisible(true)}>
            <Text style={[styles.toolbarTitle]}>
              {selectedOption}
              <Ionicons name="chevron-down-outline" size={18} color="#fff" />
            </Text>
          </Pressable>
        }
        containerStyle={{
          backgroundColor: themes[theme].colorSchemes.seventh,
          borderBottomColor: themes[theme].colorSchemes.eighth,
          borderBottomWidth: 1,
          marginTop: Platform.OS === "ios" ? Constants.statusBarHeight : 0,
          paddingTop: Platform.OS == "android" ? 35 : null,
        }}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View
              style={[
                styles.modalView,
                {
                  backgroundColor:
                    themes["Neo - The Chat AI"].colorSchemes.first,
                },
              ]}
            >
              {/* Add the search bar */}
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => {
                  searchPerson(searchQuery);
                  setSearchQuery("");
                }}
                placeholder="Search for a person"
                placeholderTextColor="#657284"
                returnKeyType="search"
              />
              <FlatList
                data={options}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor:
                          themes["Neo - The Chat AI"].colorSchemes.sixth,
                      },
                    ]}
                    onPress={() => {
                      setSelectedOption(item);
                      setTheme(item);
                      setMessages(themes[item].initialMessages);
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
              />
            </View>
          </View>
        </Pressable>
      </Modal>
      <View
        style={{
          backgroundColor: themes[theme].colorSchemes.first,
        }}
      >
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: false }}
          style={{
            paddingTop: 100,
            backgroundColor: themes[theme].colorSchemes.seventh,
          }} // add 10 pixels of padding to the top
        />
      </View>
      <StatusBar
        barStyle="light-content"
        backgroundColor={themes[theme].colorSchemes.sixth}
        style={styles.statusBar}
      />
      <View
        style={[
          styles.messages,
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
                      ...styles.message,
                      backgroundColor: themes[theme].colorSchemes.second,
                    },
                    item.role === "assistant"
                      ? {
                          ...styles.assistantMessage,
                          backgroundColor: themes[theme].colorSchemes.second,
                        }
                      : {
                          ...styles.userMessage,
                          backgroundColor: themes[theme].colorSchemes.third,
                        },
                  ]}
                >
                  {item.role === "assistant" && (
                    <Text
                      style={[
                        styles.assistantTitle,
                        { color: themes[theme].colorSchemes.fourth },
                      ]}
                    >
                      {themes[theme].Title}
                    </Text>
                  )}
                  {item.role === "user" && (
                    <Text
                      style={[
                        styles.userTitle,
                        { color: themes[theme].colorSchemes.fifth },
                      ]}
                    >
                      You
                    </Text>
                  )}
                  <Text style={styles.messageText} selectable>
                    {item.content}
                  </Text>
                </View>
                {/* {item.role === "assistant" && (
                  <BannerAd
                    unitId={adUnitId}
                    size={BannerAdSize.BANNER}
                    requestOptions={{ requestNonPersonalizedAdsOnly: false }}
                    style={{
                      paddingTop: 100,
                      backgroundColor: themes[theme].colorSchemes.seventh,
                    }} // add 10 pixels of padding to the top
                  />
                )} */}
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

      <View
        style={[
          styles.input,
          { backgroundColor: themes[theme].colorSchemes.sixth },
        ]}
      >
        <TextInput
          style={styles.inputText}
          value={message}
          onChangeText={setMessage}
          placeholder={themes[theme].inputPlaceholder}
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
  userMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#232e3b",
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
  centeredView: {
    position: "absolute",
    top: Platform.OS === "ios" ? Constants.statusBarHeight + 56 : 56,
    width: "100%",
    alignItems: "center",
  },
  modalView: {
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 0.84,
    maxHeight: 600,
    elevation: 5,
  },
  optionButton: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 1,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#2196F3",
  },
  optionText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 8,
    paddingRight: 8,
    marginBottom: 8,
    borderRadius: 4,
    color: "#fff",
    fontSize: 16,
  },
});
