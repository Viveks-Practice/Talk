//message-limit branch

import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import {
  AppOpenAd,
  InterstitialAd,
  RewardedAd,
  BannerAd,
  TestIds,
  BannerAdSize,
  AdEventType,
} from "react-native-google-mobile-ads";
import themes from "./themes.json";
import NeoHeader from "./components/Header";
import PersonaModal from "./components/PersonaModal";
import Banner from "./components/Banner";
import ChatWindow from "./components/ChatWindow";
import MessageEntry from "./components/MessageEntry";

let adUnitIdInterstitial = "";
if (Platform.OS === "ios") {
  adUnitIdInterstitial = __DEV__
    ? TestIds.INTERSTITIAL
    : process.env.IOS_ADMOB_INTERSTITIAL_ID;
} else if (Platform.OS === "android") {
  adUnitIdInterstitial = __DEV__
    ? TestIds.INTERSTITIAL
    : process.env.ANDROID_ADMOB_INTERSTITIAL_ID;
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
  ]);

  let adUnitId = "";
  if (Platform.OS === "ios") {
    adUnitId = __DEV__ ? TestIds.BANNER : process.env.IOS_ADMOB_ID;
  } else if (Platform.OS === "android") {
    adUnitId = __DEV__ ? TestIds.BANNER : process.env.ANDROID_ADMOB_ID;
  }

  const flatListRef = useRef(null);

  useEffect(() => {
    if (loaded === true && messageCount % 4 == 3) {
      interstitial.show();
    }
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
        setMessages={setMessages}
        messages={messages}
        setMessageCount={setMessageCount}
        messageCount={messageCount}
        setAdIndex={setAdIndex}
        adIndex={adIndex}
        loaded={loaded}
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
