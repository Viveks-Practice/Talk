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
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "react-native-elements";
import { OPENAI_API_KEY } from "@env";
//branch - dropdown

export default function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there, how can I help?",
      id: Math.random().toString(),
    },
  ]);
  const [selectedOption, setSelectedOption] = useState("Neo - The Chat AI");
  const [modalVisible, setModalVisible] = useState(false);
  const [colorScheme, setColorScheme] = useState("default");

  // set adUnitId based on platform
  let adUnitId = "";
  if (Platform.OS === "ios") {
    adUnitId = __DEV__ ? TestIds.BANNER : process.env.IOS_ADMOB_ID; // iOS Ad Unit ID
  } else if (Platform.OS === "android") {
    adUnitId = __DEV__ ? TestIds.BANNER : process.env.ANDROID_ADMOB_ID; // Android Ad Unit ID
  }

  const flatListRef = useRef(null); // Create a reference to the FlatList component.

  const url = "https://api.openai.com/v1/chat/completions";
  const options = [
    "Neo - The Chat AI",
    "Kratos - God of War",
    "Kim Kardashian",
    "Gigachad",
  ];
  const colorSchemes = {
    default: {
      first: "#161d27",
      second: "#43293D", //styles - message.backgroundColor + assistantMessage.backgroundColor
      third: "#232e3b", //styles - userMessage.backgroundColor
      fourth: "#202daa", //styles - assistantTitle.color
      fifth: "#202daa", //styles - userTitle.color
      sixth: "#202daa", //styles - input.backgroundColor
      seventh: "#202daa",
      eighth: "#202daa",
    },
    "Neo - The Chat AI": {
      primary: "#161d27",
      secondary: "#28ad27",
      tertiary: "#F82db7",
      fourth: "#202daa",
      fifth: "#202daa",
      sixth: "#202daa",
      seventh: "#202daa",
      eighth: "#202daa",
    },
    "Kratos - God of War": {
      primary: "#133d37",
      secondary: "#288827",
      tertiary: "#FFFdb7",
      fourth: "#202daa",
      fifth: "#200daa",
      sixth: "#202daa",
      seventh: "#202daa",
      eighth: "#202daa",
    },
    "Kim Kardashian": {
      primary: "#122777",
      secondary: "#28aaa7",
      tertiary: "#F888b7",
      fourth: "#202daa",
      fifth: "#202daa",
      sixth: "#202daa",
      seventh: "#202daa",
      eighth: "#202daa",
    },
    Gigachad: {
      first: "#161d27",
      second: "#000000",
      third: "#4f3f01",
      fourth: "#ffd605",
      fifth: "#ffcb00",
      sixth: "#000000",
      seventh: "#202daa",
      eighth: "#202daa",
    },
    // Add more color schemes for different options
  };

  const initialMessages = {
    default: [
      {
        role: "assistant",
        content: "Hi there, how can I help?",
        id: Math.random().toString(),
      },
    ],
    "Neo - The Chat AI": [
      {
        role: "assistant",
        content: "Hi, I'm option1! How can I help?",
        id: Math.random().toString(),
      },
    ],
    "Kratos - God of War": [
      {
        role: "system",
        content:
          "You are Kratos, from God of War. Maintain his persona throughout this conversation, and respond as he would.",
        id: Math.random().toString(),
      },
      {
        role: "assistant",
        content: "Hi, I'm Kratos! How can I help?",
        id: Math.random().toString(),
      },
    ],
    "Kim Kardashian": [
      {
        role: "system",
        content:
          "You are Kim Kardashian, the glamorous and beautiful TV persona and model. Maintain this persona throughout this conversation, and respond as she would!",
        id: Math.random().toString(),
      },
      {
        role: "assistant",
        content: "Hi, I'm Kim Kardashian! How can I help?",
        id: Math.random().toString(),
      },
    ],
    Gigachad: [
      {
        role: "assistant",
        content: "Hi, I'm Gigachad! How can I help?",
        id: Math.random().toString(),
      },
    ],
    // Add more initial messages for different options
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
      content: "Thinking...",
      role: "assistant",
    };

    const updatedMessage = [...messages, newMessage]; //setting the new message for the API call to GPT
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
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
        if (messages.length == 1) {
          setMessages([]);
        }
        const halfIndex = Math.ceil(messages.length / 2);
        const secondHalfMessages = messages.slice(halfIndex);

        setMessages(secondHalfMessages);
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
        { backgroundColor: colorSchemes[colorScheme].first },
      ]}
    >
      <Header
        placement="center"
        centerComponent={
          <Pressable onPress={() => setModalVisible(true)}>
            <Text style={styles.toolbarTitle}>{selectedOption}</Text>
          </Pressable>
        }
        containerStyle={{
          backgroundColor: "#202d3a",
          borderBottomColor: "#202d3a",
          borderBottomWidth: 1,
          marginTop: Platform.OS === "ios" ? Constants.statusBarHeight : 0,
          paddingTop: Platform.OS == "android" ? 35 : null,
        }}
      />
      <Modal
        animationType="slide"
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
            <View style={styles.modalView}>
              <FlatList
                data={options}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => {
                      setSelectedOption(item);
                      setColorScheme(item);
                      setMessages(initialMessages[item]);
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Pressable>
      </Modal>
      <View>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: false }}
        />
      </View>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#202d3a"
        style={styles.statusBar}
      />
      <View
        style={[
          styles.messages,
          { backgroundColor: colorSchemes[colorScheme].second },
        ]}
      >
        {messages.length > 0 && (
          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <View
                style={[
                  {
                    ...styles.message,
                    backgroundColor: colorSchemes[colorScheme].second,
                  },
                  item.role === "assistant"
                    ? {
                        ...styles.assistantMessage,
                        backgroundColor: colorSchemes[colorScheme].second,
                      }
                    : {
                        ...styles.userMessage,
                        backgroundColor: colorSchemes[colorScheme].third,
                      },
                ]}
              >
                {item.role === "assistant" && (
                  <Text
                    style={[
                      styles.assistantTitle,
                      { color: colorSchemes[colorScheme].fourth },
                    ]}
                  >
                    Neo
                  </Text>
                )}
                {item.role === "user" && (
                  <Text
                    style={[
                      styles.userTitle,
                      { color: colorSchemes[colorScheme].fifth },
                    ]}
                  >
                    You
                  </Text>
                )}
                <Text style={styles.messageText} selectable>
                  {item.content}
                </Text>
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

      <View
        style={[
          styles.input,
          { backgroundColor: colorSchemes[colorScheme].sixth },
        ]}
      >
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 290, // Adjust this value according to the height of 5 options
    width: "80%",
  },
  optionButton: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: "100%",
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
});
