import React, { useState } from "react";
import {
  Modal,
  View,
  Pressable,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
} from "react-native";
import Purchases from "react-native-purchases";
import { deliverContent } from "../iapFunctions";
import SuccessModal from "./SuccessModal";
import productIdToCoins from "../productIdToCoins.json";

const ProductModal = ({
  productModalVisible,
  setProductModalVisible,
  onClose,
  products,
  id,
  db,
  coins,
  setCoins,
  theme,
  themes,
}) => {
  const [isPurchasingCoins, setIsPurchasingCoins] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedCoins, setSelectedCoins] = useState("");

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={productModalVisible}
        onRequestClose={onClose}
      >
        <Pressable style={styles.modalOverlay}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>X</Text>
              </Pressable>
              <Text style={styles.modalTitle}>Purchase Coins</Text>
              <FlatList
                data={products}
                keyExtractor={(item) => item.identifier}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.pressableStyle}
                    onPress={async () => {
                      setSelectedCoins(
                        productIdToCoins[item.identifier] + " Coins"
                      );
                      setIsPurchasingCoins(true);
                      try {
                        // const { customerInfo, productIdentifier } =
                        const purchaseResponse =
                          await Purchases.purchasePackage(item);
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
                            setShowSuccessModal(true);
                            setProductModalVisible(false);
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
                      } finally {
                        setIsPurchasingCoins(false);
                      }
                    }}
                  >
                    <View style={styles.purchasableItemStyle}>
                      <ImageBackground
                        source={{
                          uri: `http://${process.env.GCS_LOAD_BALANCER_CDN_IP}/coins/coins-2.png`,
                        }}
                        style={styles.backgroundImageContainer}
                        imageStyle={styles.backgroundImage}
                      >
                        <View style={styles.productContainer}>
                          <Text style={styles.productTitle}>
                            {item.product.title.split(" ")[0] + " Coins"}
                          </Text>
                          <Text style={styles.productPrice}>
                            {item.product.priceString +
                              " " +
                              item.product.currencyCode}
                          </Text>
                        </View>
                      </ImageBackground>
                    </View>
                  </Pressable>
                )}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: "center",
                  // alignItems: "center",
                }}
              />
            </View>
          </View>
        </Pressable>
        {isPurchasingCoins && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator
              size="large"
              color={themes[theme].colorSchemes.fourth}
            />
          </View>
        )}
      </Modal>
      <SuccessModal
        showSuccessModal={showSuccessModal}
        onAcknowledge={() => setShowSuccessModal(false)}
        purchasedItem={selectedCoins}
        themes={themes}
      />
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    width: "100%", // Ensures the modal takes the full width of its container
    height: "100%",
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalView: {
    margin: 20, // Ensures a light padding around the modal
    padding: 20, // Inner padding for modal content
    backgroundColor: "#161d27",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "100%", // Ensures the modal takes the full width of its container
    height: "100%", // Ensures the modal takes the full height of its container
    justifyContent: "flex-start", // Center content vertically
    flexDirection: "column", // Arrange modal content vertically, instead of horizontally
  },
  productContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 5,
    width: "100%",
    alignItems: "center",
    borderWidth: 3,
    borderRadius: 20,
    borderColor: "#dbb98c",
    // borderColor: "#c4a756",
  },
  productTitle: {
    color: "#c4a756",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 22,
    backgroundColor: "rgba(22, 29, 39, 0.6)",
    borderRadius: 8,
    padding: 5,
  },
  productPrice: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(22, 29, 39, 0.6)",
    borderRadius: 8,
    padding: 5,
  },
  productDescription: {
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
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  backgroundImageContainer: {
    width: "100%", // or your desired width
    height: 300, // adjust according to your UI/UX design
  },
  backgroundImage: {
    resizeMode: "cover", // Ensure image covers the entire space
    borderRadius: 20,
  },
  modalTitle: {
    color: "white",
    fontSize: 24, // or whatever size you prefer
    fontWeight: "bold",
    marginTop: 10, // or adjust as needed to position the title appropriately
    marginBottom: 20, // optional, adjust as needed
    alignSelf: "center",
  },
  closeButton: {
    position: "absolute", // This takes your button out of the document flow
    top: 10, // Adjust as per your UI needs
    right: 10, // Adjust as per your UI needs
    padding: 10, // Provides space around the 'X', making it easier to tap
    zIndex: 2, // Ensure the button is above other UI elements
  },
  closeButtonText: {
    fontSize: 18, // Adjust as per your UI needs
    color: "white",
    fontWeight: "bold",
  },
  pressableStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
  purchasableItemStyle: {
    margin: 5,
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
  },
});

export default ProductModal;
