import {
  doc,
  setDoc,
  addDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import Constants from "expo-constants";

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

// used to update the user's access to personas whenever the app starts up0
export const fetchPersonas = async (db, userId) => {
  // If userId is null or undefined, exit early
  if (!userId) {
    console.log("fetchPersonas was called with a null userId. Exiting.");
    return null;
  }
  try {
    // 1. Fetch all the documents from the `ownedProducts` sub-collection where `productCategory` is `"persona"`
    console.log("test #1 - Querying owned products for user ID:", userId);
    const ref = collection(db, "users", userId, "ownedProducts");
    console.log("test #2");
    const personaQuery = query(ref, where("productCategory", "==", "persona"));
    const querySnapshot = await getDocs(personaQuery);
    console.log("test #3");
    // Check if the snapshot is empty
    if (querySnapshot.empty) {
      console.log("No owned products found for this user.");
      return null; // or return an empty Set for consistency: new Set();
    }

    console.log("test #4");
    // 2. Extract the names of the personas from these documents and store them in a Set
    const ownedPersonasSet = new Set();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.productId) {
        ownedPersonasSet.add(data.productId);
      }
    });
    console.log("test #5");
    // 3. Return the Set so you can use it to update your state
    return ownedPersonasSet;
  } catch (error) {
    console.log("Error fetching personas: ", error);
    throw error;
  }
};
