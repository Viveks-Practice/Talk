// iapFunctions.js
import {
  doc,
  writeBatch,
  getDoc,
  collection,
  Timestamp,
} from "@firebase/firestore"; // assuming you use @firebase/firestore
import { Platform, Alert } from "react-native";
import React from "react";
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

    const purchaseData = {
      createdAt: new Date(),
      purchaseType: "currencyPurchase",
      coinsAmount: additionalCoins,
      offeringIdentifier: selectedProductDetails.offeringIdentifier,
      currency: selectedProductDetails.product.currencyCode,
      description: selectedProductDetails.product.description,
      price: selectedProductDetails.product.price || 0,
      productCategory: selectedProductDetails.product.productCategory || "",
      productType: selectedProductDetails.product.productType || "",
      title: selectedProductDetails.product.title,
      subscriptionPeriod: selectedProductDetails.subscriptionPeriod || "",
      productId: purchase.productIdentifier,
      purchaseTime: purchaseTimeTimestamp,
      userId: id,
      // platform-specific fields
      ...(Platform.OS === "android"
        ? {
            platform: "android",
          }
        : {}),
      ...(Platform.OS === "ios"
        ? {
            platform: "ios",
          }
        : {}),
    };

    // Create a new purchase document in the 'purchases' sub-collection of the user
    const userPurchasesCollectionRef = collection(userRef, "purchases");
    const newUserPurchaseRef = doc(userPurchasesCollectionRef);

    batch.set(newUserPurchaseRef, purchaseData, { merge: true });

    // Create a reference to the top-level 'purchases' collection
    const topPurchasesCollectionRef = collection(db, "purchases");
    const topNewPurchaseRef = doc(topPurchasesCollectionRef);

    // Add the same purchase data to the top-level 'purchases' collection
    batch.set(topNewPurchaseRef, purchaseData, { merge: true });

    await batch.commit();

    console.log("(#3 deliverContent) - Purchase completed successfully!");
  } catch (error) {
    console.error("(#3 deliverContent) - Error in deliverContent: ", error);
    throw error; // rethrow the error so we can handle it later
  }
}

/**
 * `purchasePersona` Function
 *
 * Handles the logic for a user's persona purchase in the application.
 *
 * 1. Validates user's current coin balance against the selected persona's cost.
 * 2. Updates user's coin balance in the database post-purchase (not in the app's current state).
 * 3. Records the purchase in the user's 'purchases' subcollection.
 * 4. Adds the purchased persona to the user's 'ownedProducts' subcollection (not in the app's current state).
 *
 * Note: Utilizes batched writes to ensure atomicity of database operations.
 *
 * @param {string} id - The unique user ID.
 * @param {object} db - The database reference.
 * @param {object} selectedPersonaDetails - Contains details of the persona to be purchased.
 *
 * @throws Will throw an error if the transaction fails or if user lacks sufficient coins.
 */

export async function iapPersona(id, db, selectedPersonaDetails) {
  // Define a reference to the current user's document in the "users" collection.
  const userRef = doc(db, "users", id);
  try {
    // Begin a batched write operation to ensure atomic updates to the database.
    const batch = writeBatch(db);
    const { name } = Constants.manifest;

    // Fetch the current user document
    const userDoc = await getDoc(userRef);

    // Initialize the user document if it doesn't exist
    if (!userDoc.exists()) {
      batch.set(userRef, {
        coins: 0,
        createdAt: new Date(),
        lastActiveAt: new Date(),
        platform: Platform.OS,
        appVariant: name,
      });
    }

    // Calculate coins
    let currentCoins = 0;
    if (userDoc.exists() && "coins" in userDoc.data()) {
      currentCoins = userDoc.data().coins;
    }

    // Check Persona Cost & User's Coin Balance
    const personaCost = selectedPersonaDetails.price; // Fetch the cost of the persona in coins
    if (personaCost === null || personaCost > currentCoins) {
      console.log(
        `Either the persona cost is unknown or user doesn't have enough coins. The button should have been disabled and greyed out`
      );
      alert("You don't have enough coins to purchase this persona");
      return;
    }

    // First database update: update the user's coin count
    const newCoins = currentCoins - personaCost;
    batch.update(userRef, {
      lastActiveAt: new Date(),
      coins: newCoins,
    });

    // Second database update: add the purchased persona to the purchases subcollection
    // Create a new purchase document in the 'purchases' collection
    const purchasesCollectionRef = collection(userRef, "purchases");
    const newPurchaseRef = doc(purchasesCollectionRef);
    batch.set(
      newPurchaseRef,
      {
        createdAt: new Date(),
        purchaseType: "coinsPurchase",
        price: selectedPersonaDetails.price,
        platform: Platform.OS,
        productCategory: "persona",
        productId: selectedPersonaDetails.name,
        productType: "PERMANENT", // PERMANENT || CONSUMABLE || SUBSCRIPTION
        purchaseTime: Timestamp.fromDate(new Date()),

        // platform-specific fields (similar to your template)
        ...(Platform.OS === "android" ? { platform: "android" } : {}),
        ...(Platform.OS === "ios" ? { platform: "ios" } : {}),
      },
      { merge: true }
    );

    // Third database update: Add the purchase details to the top-level 'purchases' collection.
    const topPurchasesCollectionRef = collection(db, "purchases");
    const newTopPurchaseRef = doc(topPurchasesCollectionRef); // Auto-generate ID
    batch.set(
      newTopPurchaseRef,
      {
        createdAt: new Date(),
        purchaseType: "coinsPurchase",
        price: selectedPersonaDetails.price,
        platform: Platform.OS,
        productCategory: "persona",
        productId: selectedPersonaDetails.name,
        productType: "PERMANENT", // PERMANENT || CONSUMABLE || SUBSCRIPTION
        purchaseTime: Timestamp.fromDate(new Date()),
        userId: id, // Including the user ID in top-level purchases collection can be useful for querying/filtering
        // platform-specific fields (similar to your template)
        ...(Platform.OS === "android" ? { platform: "android" } : {}),
        ...(Platform.OS === "ios" ? { platform: "ios" } : {}),
      },
      { merge: true }
    );

    // Fourth database update: add the purchased persona to the 'ownedProducts' subcollection
    // Add the purchased persona to the 'ownedProducts' subcollection
    const ownedProductsCollectionRef = collection(userRef, "ownedProducts");
    const newOwnedProductRef = doc(ownedProductsCollectionRef);
    batch.set(
      newOwnedProductRef,
      {
        productId: selectedPersonaDetails.name,
        purchaseDate: new Date(),
        purchaseId: newPurchaseRef.id,
        productCategory: "persona",
        productType: "PERMANENT", // PERMANENT || CONSUMABLE || SUBSCRIPTION
      },
      { merge: true }
    );

    await batch.commit();

    console.log("(#3 purchasePersona) - Persona purchased successfully!");
  } catch (error) {
    console.error("(#3 purchasePersona) - Error in purchasePersona: ", error);
    throw error; // rethrow the error so we can handle it later
  }
}
