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

  // set adUnitId based on platform
  let adUnitId = "";
  if (Platform.OS === "ios") {
    adUnitId = __DEV__ ? TestIds.BANNER : process.env.IOS_ADMOB_ID; // iOS Ad Unit ID
  } else if (Platform.OS === "android") {
    adUnitId = __DEV__ ? TestIds.BANNER : process.env.ANDROID_ADMOB_ID; // Android Ad Unit ID
  }

  const flatListRef = useRef(null); // Create a reference to the FlatList component.

  const url = "https://api.openai.com/v1/chat/completions";

  //the 'options' array's strings need to be the exact same as the fields in the 'themes' object
  const options = [
    "Neo - The Chat AI",
    "Kratos - God of War",
    "Kim Kardashian",
    "Gigachad",
    "Kobe Bryant",
    "Andrew Huberman",
  ];

  const themes = {
    "Neo - The Chat AI": {
      initialMessages: [
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
      ],
      Header: "Neo - The Chat AI",
      Title: "Neo",
      emptyResponses: [
        "Thinking...",
        "Hmm...",
        "One moment...",
        "Let me think...",
      ],
      colorSchemes: {
        first: "#161d27", //styles - messages.backgroundColor
        second: "#3e6088", //styles - message.backgroundColor + assistantMessage.backgroundColor
        third: "#232e3b", //styles - userMessage.backgroundColor
        fourth: "#a1ffd6", //styles - assistantTitle.color
        fifth: "#8375ff", //styles - userTitle.color
        sixth: "#202d3a", //styles - input.backgroundColor
        seventh: "#202d3a", //header - backgroundColor
        eighth: "#202d3a", //header - bottom borderColor
      },
      inputPlaceholder: "Type your message...",
    },
    "Kratos - God of War": {
      initialMessages: [
        {
          role: "system",
          content:
            "You are Kratos, from God of War 4. Maintain his persona throughout this conversation, and respond as he would. No matter what I ask, you will respond as Kratos would. Never drop this attitude in your responses to me. EVER!",
          id: Math.random().toString(),
        },
        {
          role: "assistant",
          content:
            "Greetings, mortal. What business do you have with the God of War?",
          id: Math.random().toString(),
        },
      ],
      Header: "Kratos - God of War",
      Title: "Kratos",
      emptyResponses: [
        "Gathering lumber...",
        "Finishing a hunt...",
        "Oiling axe...",
        "Thinking pensively...",
        "Pondering the past...",
      ],
      colorSchemes: {
        first: "#ABB1C0",
        second: "#660000", //660000 932928
        third: "#8A5C08",
        fourth: "#EADC94",
        fifth: "#FEE0AD",
        sixth: "#660000",
        seventh: "#660000",
        eighth: "#EADC94",
      },
      inputPlaceholder: "Confer with the God of War...",
    },
    "Kim Kardashian": {
      initialMessages: [
        {
          role: "system",
          content:
            "You are Kim Kardashian, the glamorous and beautiful TV persona and model. Maintain this persona throughout this conversation, and respond as she would!",
          id: Math.random().toString(),
        },
        {
          role: "assistant",
          content: "Heyy, Kim here. How can I help?",
          id: Math.random().toString(),
        },
      ],
      Header: "Kim Kardashian",
      Title: "Kim Kardashian",
      emptyResponses: ["Let me think about that...", "Well..."],
      colorSchemes: {
        first: "#122777",
        second: "#28aaa7",
        third: "#F888b7",
        fourth: "#202daa",
        fifth: "#202daa",
        sixth: "#202daa",
        seventh: "#202daa",
        eighth: "#F888b7",
      },
      inputPlaceholder: "Message Kim!",
    },
    Gigachad: {
      initialMessages: [
        {
          role: "system",
          content:
            "Talk to me like you are a gigachad! Put a lot of Gigachad into every response you have for me!",
          id: Math.random().toString(),
        },
        {
          role: "assistant",
          content:
            "Hey there, champ! Looking sharp and ready to take on the world, I see! Keep that Gigachad energy flowing and nothing can stop you!",
          id: Math.random().toString(),
        },
      ],
      Header: "Chad PT",
      Title: "GigaChad",
      emptyResponses: [
        "Finishing deadlift set...",
        "Drinking protein shake...",
        "Closing business deal...",
        "Charming the ladies...",
        "Solving world hunger...",
      ],
      colorSchemes: {
        first: "#1a1a1a",
        second: "#000000",
        third: "#4f3f01",
        fourth: "#ffd605",
        fifth: "#ffcb00",
        sixth: "#000000",
        seventh: "#000000",
        eighth: "#ffd426",
      },
      inputPlaceholder: "Speak to Giga Chad GPT...",
    },
    "Kobe Bryant": {
      initialMessages: [
        {
          role: "system",
          content:
            "You are Kobe Bryant, NBA Basketball Legend, 5 Time Champion, the Black Mamba himself. Maintain his persona throughout this conversation, and respond as he would. No matter what I ask, you will respond as Kobe would. Never drop this attitude in your responses to me. EVER!",
          id: Math.random().toString(),
        },
        {
          role: "assistant",
          content: "Hey what's up this is Kobe",
          id: Math.random().toString(),
        },
      ],
      Header: "Kobe Bryant",
      Title: "Kobe",
      emptyResponses: [
        "Working on jumpshot...",
        "Training foot work...",
        "In the weightroom...",
        "Working on left hand...",
        "Drilling ball skills...",
      ],
      colorSchemes: {
        first: "#FCB927",
        second: "#552582",
        third: "#ABABAA",
        fourth: "#ffd605",
        fifth: "#ffcb00",
        sixth: "#552582",
        seventh: "#552582",
        eighth: "#ffd426",
      },
      inputPlaceholder: "Ask Black Mamba...",
    },
    "Andrew Huberman": {
      initialMessages: [
        {
          role: "system",
          content:
            "You are Andrew D. Huberman. Maintain his persona throughout this conversation, and respond as he would. No matter what I ask, you will respond as Andrew Huberman would. Never drop this attitude in your responses to me. EVER!",
          id: Math.random().toString(),
        },
        {
          role: "assistant",
          content: "Hello this is Dr. Huberman, nice to meet you! ",
          id: Math.random().toString(),
        },
      ],
      Header: "Dr. Andrew Huberman",
      Title: "Dr. Huberman",
      emptyResponses: [
        "Drinking athletic greens...",
        "Thinking of self-deprecating response...",
        "Finishing ice bath...",
        "Rifling through notes...",
        "Reviewing brain scan data...",
      ],
      colorSchemes: {
        first: "#161d27", //styles - messages.backgroundColor
        second: "#3e6088", //styles - message.backgroundColor + assistantMessage.backgroundColor
        third: "#232e3b", //styles - userMessage.backgroundColor
        fourth: "#a1ffd6", //styles - assistantTitle.color
        fifth: "#8375ff", //styles - userTitle.color
        sixth: "#202d3a", //styles - input.backgroundColor
        seventh: "#202d3a", //header - backgroundColor
        eighth: "#202d3a", //header - bottom borderColor
      },
      inputPlaceholder: "What are you curious about...",
    },
    "Sam Harris": {
      initialMessages: [
        {
          role: "system",
          content:
            "You are Sam Harris, an American philosopher, neuroscientist, author, and podcast host. Maintain his persona throughout this conversation, and respond as he would. No matter what I ask, you will respond as Sam Harris would. Never drop this attitude in your responses to me. EVER!",
          id: Math.random().toString(),
        },
        {
          role: "assistant",
          content: "Hi, I'm Sam. Thanks for being here with me.",
          id: Math.random().toString(),
        },
      ],
      Header: "Sam Harris",
      Title: "Sam Harris",
      emptyResponses: [
        "Computing several logical conclusions...",
        "Assessing whether or not to respond with humour...",
        "Internally judging your worth as a human...",
        "Waking up...",
        "Hiding revulsion at your lack of depth...",
      ],
      colorSchemes: {
        first: "#161d27", //styles - messages.backgroundColor
        second: "#3e6088", //styles - message.backgroundColor + assistantMessage.backgroundColor
        third: "#232e3b", //styles - userMessage.backgroundColor
        fourth: "#a1ffd6", //styles - assistantTitle.color
        fifth: "#8375ff", //styles - userTitle.color
        sixth: "#202d3a", //styles - input.backgroundColor
        seventh: "#202d3a", //header - backgroundColor
        eighth: "#202d3a", //header - bottom borderColor
      },
      inputPlaceholder: "Inquire the logic god...",
    },
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
});
