//renaming_props branch

import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import {
  InterstitialAd,
  TestIds,
  AdEventType,
} from "react-native-google-mobile-ads";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  orderBy,
  getDoc,
  query,
} from "firebase/firestore";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import {
  fetchCoins,
  fetchPersonas,
} from "./firebaseFunctions/firebaseOperations";

import Purchases, { LOG_LEVEL } from "react-native-purchases";

import themes from "./themes.json";
import NeoHeader from "./components/Header";
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
  const [interstitialAdLoaded, setInterstitialAdLoaded] = useState(false);
  const [firebaseDataLoading, setFirebaseDataLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [coins, setCoins] = useState(0);
  const [anonId, setAnonId] = useState(null);
  const [context, setContext] = useState(0);
  const [products, setProducts] = useState([]);
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
  const [theme, setTheme] = useState("Neo - The Chat AI");
  const [adIndex, setAdIndex] = useState(1);
  const [options, setOptions] = useState([
    { name: "Neo - The Chat AI", owned: true, price: null },
    { name: "Harry Styles", owned: false, price: 200 },
    { name: "Gigachad", owned: true, price: null },
    { name: "David Goggins", owned: true, price: null },
    { name: "Link", owned: true, price: null },
    { name: "Princess Zelda", owned: true, price: null },
    { name: "Calamity Ganon", owned: true, price: null },
    { name: "King Rhoam Bosphoramus Hyrule", owned: true, price: null },
    { name: "Ganondorf", owned: true, price: null },
    { name: "Beedle", owned: true, price: null },
    { name: "Sonic The Hedgehog", owned: true, price: null },
    { name: "Shadow The Hedgehog", owned: true, price: null },
    { name: "Knuckles the Echidna", owned: true, price: null },
    { name: "Amy Rose The Hedgehog", owned: true, price: null },
    { name: "Yoda", owned: true, price: null },
    { name: "Darth Vader", owned: true, price: null },
    { name: "Kratos - God of War", owned: true, price: null },
    { name: "Kim Kardashian", owned: true, price: null },
    { name: "Kobe Bryant", owned: true, price: null },
    { name: "Andrew Huberman", owned: true, price: null },
    { name: "Sam Harris", owned: true, price: null },
  ]);

  let adUnitId = "";
  if (Platform.OS === "ios") {
    adUnitId = __DEV__ ? TestIds.BANNER : process.env.IOS_ADMOB_ID;
  } else if (Platform.OS === "android") {
    adUnitId = __DEV__ ? TestIds.BANNER : process.env.ANDROID_ADMOB_ID;
  }

  const flatListRef = useRef(null);
  //advertisement interstitial
  useEffect(() => {
    if (interstitialAdLoaded === true && messageCount % 4 == 3) {
      interstitial.show();
    }
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setInterstitialAdLoaded(true);
        console.log("Interstitial ad loaded!");
      }
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, [messageCount]);

  // Initialize the RevenueCat SDK
  useEffect(() => {
    // Purchases.setDebugLogsEnabled(true);
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    if (Platform.OS === "android") {
      //process.env.FIREBASE_APP_ID
      Purchases.configure({ apiKey: process.env.REVENUECAT_GOOGLE_API_KEY });
    } else {
      Purchases.configure({ apiKey: process.env.REVENUECAT_APPLE_API_KEY });
    }

    // Retrieve the products from RevenueCat
    const fetchData = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current !== null) {
          setProducts(offerings.current.availablePackages);
          console.log(
            console.log(JSON.stringify(offerings.current.availablePackages))
          );
        }
      } catch (error) {
        console.log("Error in fetching products from RevenueCat: ", error);
      }
    };

    fetchData().catch(console.log);
  }, []);

  // scrolls to the bottom of the messages list when the messages state changes (may not be the most efficient way of achieving this)
  useEffect(() => {
    let timeoutId;
    if (flatListRef.current) {
      timeoutId = setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 180); // or even 500ms depending on your case
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [messages]);

  // set the anonymous user id
  // if the user is already logged in, use the existing user id
  // if the user is not logged in, log them in anonymously and use the new user id
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

  // state setter: set the coins state
  // triggers: when the anonymous user id changes (or when the user logs in)
  // method: read coins from the database and update the coins state
  useEffect(() => {
    const getCoins = async () => {
      // If anonId is set
      if (anonId) {
        const coinCount = await fetchCoins(db, anonId);
        if (coinCount) {
          setCoins(coinCount);
          console.log("Coins: ", coinCount);
        } else {
          console.log("Coins: ", coins);
        }
      }
    };

    getCoins();
  }, [anonId]); // This useEffect runs whenever anonId changes

  // state setter: set the persona options state
  // triggers: when the anonymous user id changes (or when the user logs in)
  // method: read the persona options from the database and update the options state
  useEffect(() => {
    fetchPersonas(db, anonId)
      .then((ownedPersonasSet) => {
        if (!ownedPersonasSet) return; // If null, don't do anything

        const updatedOptions = options.map((option) => {
          // If the current option is in the ownedPersonasSet, set owned to true, otherwise leave it unchanged
          if (ownedPersonasSet.has(option.name)) {
            return {
              ...option,
              owned: true,
            };
          }

          // If it's not in the set, return the option as-is
          return option;
        });

        setOptions(updatedOptions);
      })
      .catch((error) => {
        console.error("Error fetching owned personas:", error);
      });
  }, [anonId]); // This useEffect runs whenever anonId changes

  // state setter: set the messages state
  // triggers: when the anonymous user id changes or the selectedOption changes
  // fetch messages from the firestore database, everytime the selectedOption changes or the userID changes
  useEffect(() => {
    // When anonId or selectedOption changes, fetch the messages
    if (anonId && selectedOption) {
      const fetchMessages = async () => {
        setFirebaseDataLoading(true); // Set loading state to true before starting fetch
        try {
          const messagesCollectionRef = collection(
            db,
            "users",
            anonId,
            "chats",
            selectedOption,
            "messages"
          );
          const queryDatabase = query(
            messagesCollectionRef,
            orderBy("createdAt")
          );
          const messagesSnapshot = await getDocs(queryDatabase);

          const messagesArray = messagesSnapshot.docs.map((doc) => {
            return {
              role: doc.data().role,
              content: doc.data().content,
              id: doc.id,
            };
          });

          // Fetch the aiContextLength from the chat document
          const chatDocRef = doc(db, "users", anonId, "chats", selectedOption);
          const chatDoc = await getDoc(chatDocRef);
          let aiContextLength = 8; //if the context limit was not set, but there were messages, default to 8
          if (chatDoc.exists() && chatDoc.data().aiContextLength) {
            aiContextLength = chatDoc.data().aiContextLength;
          }

          // Update the context state
          setContext(aiContextLength);

          // Updates the 'messages' state variable with the new 'messagesArray', while keeping the first entry.
          setMessages((prevMessages) => [
            prevMessages[0],
            prevMessages[1],
            ...messagesArray,
          ]);
        } catch (error) {
          console.error("Error fetching messages: ", error);
        }

        setFirebaseDataLoading(false); // Set loading state to false after fetch is complete
      };

      fetchMessages();

      let timeoutId;
      if (flatListRef.current) {
        timeoutId = setTimeout(() => {
          flatListRef.current.scrollToEnd({ animated: true });
        }, 4000); // or even 500ms depending on your case
      }

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [anonId, selectedOption]);

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
            setSelectedOption={setSelectedOption}
            theme={theme}
            themes={themes}
            setTheme={setTheme}
            setMessages={setMessages}
            options={options}
            setOptions={setOptions}
            products={products}
            id={anonId}
            db={db}
            coins={coins}
            setCoins={setCoins}
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
            firebaseDataLoading={firebaseDataLoading}
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
            anonId={anonId}
            db={db}
            firebaseDataLoading={firebaseDataLoading}
            context={context}
            setContext={setContext}
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
            setSelectedOption={setSelectedOption}
            theme={theme}
            themes={themes}
            setTheme={setTheme}
            setMessages={setMessages}
            options={options}
            setOptions={setOptions}
            products={products}
            id={anonId}
            db={db}
            coins={coins}
            setCoins={setCoins}
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
            firebaseDataLoading={firebaseDataLoading}
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
            loaded={interstitialAdLoaded}
            anonId={anonId}
            app={app}
            db={db}
            auth={auth}
            firebaseDataLoading={firebaseDataLoading}
            context={context}
            setContext={setContext}
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
  purchaseOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)", // This will give a dim effect behind the Purchase component
  },
});
