// iapFunctions.js
import {
  doc,
  writeBatch,
  getDoc,
  collection,
  Timestamp,
} from "@firebase/firestore"; // assuming you use @firebase/firestore
import { Platform, Alert } from "react-native";
import productIdToCoins from "./productIdToCoins.json";
import Constants from "expo-constants";

// Update the database with the user's purchase data (coins)
export async function deliverContent(purchase, id, db, selectedProductDetails) {
  const userRef = doc(db, "users", id);
  //start a batch write operation
  try {
    const batch = writeBatch(db);
    const { name } = Constants.manifest;

    // Fetch the current user document
    const userDoc = await getDoc(userRef);
    // Calculate new coin count
    let currentCoins = 0;
    if (!userDoc.exists()) {
      currentCoins = 0;
    } else {
      // Check if the 'coins' field exists
      if ("coins" in userDoc.data()) {
        currentCoins = userDoc.data().coins;
      } else {
        // console.log("User doc exists but 'coins' field does not.");
        currentCoins = 0; // or any default value you want
      }
    }

    const additionalCoins = productIdToCoins[purchase.productIdentifier]; // Fetch the amount of coins from the map
    if (!additionalCoins) {
      console.log(`Unknown product ID ${purchase.productIdentifier}`);
      return;
    }
    const newCoins = currentCoins + additionalCoins;

    batch.set(userRef, { coins: newCoins }, { merge: true });

    // Check if the document exists
    if (!userDoc.exists()) {
      // If it does not exist, create it with all the fields
      batch.set(userRef, {
        createdAt: new Date(),
        lastActiveAt: new Date(),
        platform: Platform.OS,
        appVariant: name,
        coins: newCoins,
      });
    } else {
      // If it exists, update it, but skip updating 'createdAt'
      batch.update(userRef, {
        lastActiveAt: new Date(),
        platform: Platform.OS,
        appVariant: name,
        coins: newCoins,
      });
    }

    const purchaseTimeDate = new Date(purchase.customerInfo.requestDate); // Convert Unix timestamp to JavaScript Date
    const purchaseTimeTimestamp = Timestamp.fromDate(purchaseTimeDate); // Convert Date to Firestore Timestamp

    //Create a new purchase document in the 'purchases' collection
    const purchasesCollectionRef = collection(userRef, "purchases");
    const newPurchaseRef = doc(purchasesCollectionRef); // Let Firestore auto-generate an ID for the new purchase
    batch.set(
      newPurchaseRef,
      {
        createdAt: new Date(),
        purchaseType: "currencyPurchase",
        amount: additionalCoins,
        offeringIdentifier: selectedProductDetails.offeringIdentifier,
        currency: selectedProductDetails.product.currencyCode,
        description: selectedProductDetails.product.description,
        price: selectedProductDetails.product.price || 0, // The  real-world money cost
        productCategory: selectedProductDetails.product.productCategory || "",
        productType: selectedProductDetails.product.productType || "",
        title: selectedProductDetails.product.title,
        subscriptionPeriod: selectedProductDetails.subscriptionPeriod || "",
        productId: purchase.productIdentifier,
        purchaseTime: purchaseTimeTimestamp,

        // platform-specific fields
        ...(Platform.OS === "android"
          ? {
              //   packageName: purchase.packageName || "", //fallback to empty string if undefined
              //   purchaseToken: purchase.purchaseToken || "", //fallback to empty string if undefined
              platform: "android",
            }
          : {}), // include fields for Android
        ...(Platform.OS === "ios"
          ? {
              //   transactionReceipt: purchase.transactionReceipt || "", //fallback to empty string if undefined
              //   originalPurchaseTime: purchase.originalPurchaseTime || "", //fallback to empty string if undefined
              //   originalOrderId: purchase.originalOrderId || "", //fallback to empty string if undefined
              platform: "ios",

              // other iOS-specific fields here
            }
          : {}), // include fields for iOS
      },
      { merge: true }
    );
    await batch.commit();

    console.log("(#3 deliverContent) - Purchase completed successfully!");
  } catch (error) {
    console.error("(#3 deliverContent) - Error in deliverContent: ", error);
    throw error; // rethrow the error so we can handle it later
  }
}
