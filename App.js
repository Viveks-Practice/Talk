import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, StatusBar, SafeAreaView } from "react-native";
import {
  AppOpenAd,
  InterstitialAd,
  RewardedAd,
  BannerAd,
  TestIds,
  BannerAdSize,
  AdEventType,
} from "react-native-google-mobile-ads";
import axios from "axios";
import themes from "./themes.json";
import NeoHeader from "./components/Header";
import PersonaModal from "./components/PersonaModal"; // Import the newly created component
import Banner from "./components/Banner"; // Import the Banner component
import ChatWindow from "./components/ChatWindow"; // Import the Banner component
import MessageEntry from "./components/MessageEntry"; // Import the newly created component

//branch - sendMessage-to-component
//don't forget to
//  -delete the styles used in the persona component from this main component
//  -move functions used only in the components into the components, no need for them to be here

let adUnitIdInterstitial = "";
if (Platform.OS === "ios") {
  adUnitIdInterstitial = __DEV__
    ? TestIds.INTERSTITIAL
    : process.env.IOS_ADMOB_INTERSTITIAL_ID; // iOS Ad Unit ID
} else if (Platform.OS === "android") {
  adUnitIdInterstitial = __DEV__
    ? TestIds.INTERSTITIAL
    : process.env.ANDROID_ADMOB_INTERSTITIAL_ID; // Android Ad Unit ID
}

const interstitial = InterstitialAd.createForAdRequest(adUnitIdInterstitial, {
  requestNonPersonalizedAdsOnly: true,
});

export default function App() {
  const [messageCount, setMessageCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
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
    "David Goggins",
    "Link",
    "Princess Zelda",
    "Calamity Ganon",
    "King Rhoam Bosphoramus Hyrule",
    "Ganondorf",
    "Beedle",
    "Yoda",
    "Darth Vader",
    "Kratos - God of War",
    "Kim Kardashian",
    "Gigachad",
    "Kobe Bryant",
    "Andrew Huberman",
    "Sam Harris",
  ]); //this is the list that will be seen by the user when the title of the app is selected. For different persona selection

  // set adUnitId based on platform
  let adUnitId = "";
  if (Platform.OS === "ios") {
    adUnitId = __DEV__ ? TestIds.BANNER : process.env.IOS_ADMOB_ID; // iOS Ad Unit ID
  } else if (Platform.OS === "android") {
    adUnitId = __DEV__ ? TestIds.BANNER : process.env.ANDROID_ADMOB_ID; // Android Ad Unit ID
  }

  const flatListRef = useRef(null); // Create a reference to the FlatList component.

  const url = "https://api.openai.com/v1/chat/completions";

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

      setMessageCount(messageCount + 1); //Loads interstitial message - triggers useEffect
      if (loaded === true && messageCount % 4 == 3) {
        interstitial.show();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error processing your message. Please try again.");
    }
  };

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
        console.log("Interstitial ad loaded!");
      }
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, [messageCount]);

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
      <NeoHeader
        selectedOption={selectedOption}
        setModalVisible={setModalVisible}
        theme={theme}
      />
      <PersonaModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        themes={themes}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSelectedOption={setSelectedOption}
        setTheme={setTheme}
        setMessages={setMessages}
        options={options}
        setOptions={setOptions}
      />
      <Banner theme={theme} />
      <StatusBar
        barStyle="light-content"
        backgroundColor={themes[theme].colorSchemes.sixth}
        style={styles.statusBar}
      />
      <ChatWindow
        messages={messages}
        theme={theme}
        flatListRef={flatListRef}
        themes={themes}
      />
      <MessageEntry
        theme={theme}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161d27",
  },
  statusBar: {
    backgroundColor: "#202d3a",
    color: "#fff",
    height: 30,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
});
