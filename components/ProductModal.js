import React from "react";
import {
  Modal,
  View,
  Pressable,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import Purchases from "react-native-purchases";
import { deliverContent } from "../iapFunctions";
import { fetchCoins } from "../firebaseFunctions/firebaseOperations";
import productIdToCoins from "../productIdToCoins.json";

const ProductModal = ({
  isVisible,
  onClose,
  products,
  id,
  db,
  coins,
  setCoins,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList
              data={products}
              keyExtractor={(item) => item.identifier}
              renderItem={({ item }) => (
                <View style={styles.productContainer}>
                  <Text style={styles.productTitle}>{item.product.title}</Text>
                  <Text style={styles.productDescription}>
                    {item.product.description}
                  </Text>
                  <Text style={styles.productPrice}>{item.product.price}</Text>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={async () => {
                      try {
                        // const { customerInfo, productIdentifier } =
                        const purchaseResponse =
                          await Purchases.purchasePackage(item);

                        console.log("Purchased item: ", item);
                        console.log(
                          "RevenueCat Purchase Response: ",
                          purchaseResponse
                        );
                        console.log(
                          "Purchase Response all entitlements",
                          purchaseResponse.customerInfo.entitlements.all
                        );
                        console.log(
                          "Purchase Response non-subscription transactions",
                          purchaseResponse.customerInfo
                            .nonSubscriptionTransactions
                        );
                        console.log("RevenueCat Purchase completed");
                        // Deliver purchased content
                        deliverContent(purchaseResponse, id, db, item)
                          .then((result) => {
                            // successfully delivered purchased content
                            console.log(
                              "(#3 deliverContent) - The content has been delivered successfully!",
                              result
                            );
                            // increase coin count
                            const coinsToAdd =
                              productIdToCoins[item.identifier];
                            const newCoins = coins + coinsToAdd;
                            setCoins(newCoins);
                            console.log(
                              "New coin count after delivering the coins!",
                              newCoins
                            );
                          })
                          .catch((error) => {
                            // failed to deliver purchased content
                            console.log(
                              "(#3 deliverContent) - The content has failed to deliver!",
                              error
                            );
                          });
                      } catch (error) {
                        console.log(
                          "Error with trying to make a purchase with RevenueCat",
                          error
                        );
                        if (!error.userCancelled) {
                          // Alert.alert("Error purchasing package", e.message);
                        }
                      }
                    }}
                  >
                    <Text style={styles.textStyle}>Buy</Text>
                  </Pressable>
                </View>
              )}
            />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#161d27",
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
  },
  productContainer: {
    width: 200,
    marginBottom: 20,
  },
  productTitle: {
    color: "white",
    fontWeight: "bold",
  },
  productDescription: {
    color: "white",
  },
  productPrice: {
    color: "white",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#3e6088",
    marginTop: 10,
  },
  buttonClose: {
    backgroundColor: "#3e6088",
    width: 200,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProductModal;
