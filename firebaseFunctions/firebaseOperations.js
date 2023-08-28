import {
  doc,
  setDoc,
  addDoc,
  getDoc,
  updateDoc,
  collection,
  arrayUnion,
  increment,
} from "firebase/firestore";

// import { Platform } from "react-native";
import Constants from "expo-constants";

// import { app, db } from "../firebase";

export const updateFirestoreChat = async (
  message,
  role,
  chatId,
  aiName,
  db,
  contextLength
) => {
  const messageDocument = {
    content: message,
    createdAt: new Date(),
    role: role,
  };

  const { name } = Constants.manifest;

  // User document reference
  const userRef = doc(db, "users", chatId);

  // Get user document
  const userDoc = await getDoc(userRef);

  // Check if the document exists
  if (!userDoc.exists()) {
    // If it does not exist, create it
    await setDoc(userRef, {
      createdAt: new Date(), // Set the created at timestamp
      lastActiveAt: new Date(), // Set the last active timestamp
      platform: Platform.OS,
      appVariant: name,
    });
  } else {
    // If it exists, update it
    await updateDoc(userRef, {
      lastActiveAt: new Date(), // Update the last active timestamp
    });
  }

  // Chat document reference
  const chatRef = doc(userRef, "chats", aiName);

  // Get chat document
  const chatDoc = await getDoc(chatRef);

  // Check if the document exists
  if (!chatDoc.exists()) {
    // If it does not exist, create it
    await setDoc(chatRef, {
      createdAt: new Date(), // Set the created at timestamp
      lastMessageAt: new Date(), // Set the last message timestamp
      aiContextLength: contextLength,
    });
  } else {
    // If it exists, update it
    await updateDoc(chatRef, {
      lastMessageAt: new Date(), // Update the last message timestamp
      aiContextLength: contextLength,
    });
  }

  // Messages collection reference
  const messagesCollectionRef = collection(chatRef, "messages");

  // Add the message document to the messages collection
  await addDoc(messagesCollectionRef, messageDocument);
};

export const updateFirestoreContext = async (
  chatId,
  aiName,
  db,
  contextLength
) => {
  // User document reference
  const userRef = doc(db, "users", chatId);

  // Chat document reference
  const chatRef = doc(userRef, "chats", aiName);

  // Get chat document
  const chatDoc = await getDoc(chatRef);

  // Check if the document exists
  if (!chatDoc.exists()) {
    //do nothing
  } else {
    // If it exists just update the context length
    await updateDoc(chatRef, {
      aiContextLength: contextLength,
    });
  }
};

// used to update the user's coins in the database whenever the app starts, or when the user makes a purchase
export const fetchCoins = async (db, userId) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    return userDoc.data().coins;
  }
  return 0; // default to 0 if the user has no coins
};
