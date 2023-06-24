//login-button branch

import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
// import {
//   AppOpenAd,
//   InterstitialAd,
//   RewardedAd,
//   BannerAd,
//   TestIds,
//   BannerAdSize,
//   AdEventType,
// } from "react-native-google-mobile-ads";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";

import themes from "./themes.json";
import NeoHeader from "./components/Header";
import PersonaModal from "./components/personaModal";
// import Banner from "./components/Banner";
import ChatWindow from "./components/ChatWindow";
import MessageEntry from "./components/MessageEntry";

// let adUnitIdInterstitial = "";
// if (Platform.OS === "ios") {
//   adUnitIdInterstitial = __DEV__
//     ? TestIds.INTERSTITIAL
//     : process.env.IOS_ADMOB_INTERSTITIAL_ID;
// } else if (Platform.OS === "android") {
//   adUnitIdInterstitial = __DEV__
//     ? TestIds.INTERSTITIAL
//     : process.env.ANDROID_ADMOB_INTERSTITIAL_ID;
// }

// const interstitial = InterstitialAd.createForAdRequest(adUnitIdInterstitial, {
//   requestNonPersonalizedAdsOnly: true,
// });

/*****Firebase Config Start****** */
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

let app;
let auth;

if (getApps().length === 0) {
  // Initialize app and auth if they have not been initialized
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  // Get the existing app and auth instances if they have been initialized
  app = getApp(); // get the default app
  auth = getAuth(app);
}

const db = getFirestore(app);

/*****Firebase Config End******** */

export default function App() {
  const [messageCount, setMessageCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [anonId, setAnonId] = useState("");
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
    "Sonic The Hedgehog",
    "Shadow The Hedgehog",
    "Knuckles the Echidna",
    "Amy Rose The Hedgehog",
    "Yoda",
    "Darth Vader",
    "Kratos - God of War",
    "Kim Kardashian",
    "Gigachad",
    "Kobe Bryant",
    "Andrew Huberman",
    "Sam Harris",
  ]);

  // let adUnitId = "";
  // if (Platform.OS === "ios") {
  //   adUnitId = __DEV__ ? TestIds.BANNER : process.env.IOS_ADMOB_ID;
  // } else if (Platform.OS === "android") {
  //   adUnitId = __DEV__ ? TestIds.BANNER : process.env.ANDROID_ADMOB_ID;
  // }

  const flatListRef = useRef(null);

  // useEffect(() => {
  //   if (loaded === true && messageCount % 4 == 3) {
  //     interstitial.show();
  //   }
  //   const unsubscribe = interstitial.addAdEventListener(
  //     AdEventType.LOADED,
  //     () => {
  //       setLoaded(true);
  //       // console.log("Interstitial ad loaded!");
  //     }
  //   );

  //   // Start loading the interstitial straight away
  //   interstitial.load();

  //   // Unsubscribe from events on unmount
  //   return unsubscribe;
  // }, [messageCount]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true }); // Scroll to the end of the list after a new message is received
    }
  }, [messages]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        console.log("onAuthStateChanged: user is signed in");
        // alert("onAuthStateChanged: user is signed in");
        const uid = user.uid;
        setAnonId(uid);
        console.log("User is already logged in as: ", uid);
        // alert("User is already logged in as: " + uid);
      } else {
        console.log("onAuthStateChanged: user is not signed in");
        signInAnonymously(auth)
          .then((user) => {
            // Signed in..
            console.log("User signed in anonymously");
            // alert("User signed in anonymously as: " + user);
            console.log(user);
            let userId = user.user.uid;
            console.log(userId);
            setAnonId(userId);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // console.log("Error code: ", errorCode);
            // console.log("Error message: ", errorMessage);
          });
      }
    });
  }, []);

  return (
    <>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView
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
          {/* <Banner theme={theme} /> */}
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
            anonId={anonId}
            app={app}
            db={db}
            auth={auth}
          />
        </KeyboardAvoidingView>
      ) : (
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
          {/* <Banner theme={theme} /> */}
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
            anonId={anonId}
            app={app}
            db={db}
            auth={auth}
          />
        </SafeAreaView>
      )}
    </>
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
