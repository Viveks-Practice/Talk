import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import SuccessModal from "./SuccessModal";
import ProductModal from "./ProductModal";
import { iapPersona } from "../iapFunctions";

const Purchase = ({
  showPurchaseModal,
  currentCoins,
  userId,
  db,
  products,
  options,
  setOptions,
  setCoins,
  purchasePersona,
  onClose,
  theme,
  themes,
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false); // rename to explain what is being purchased
  const [productModalVisible, setProductModalVisible] = useState(false); // rename to explain this is a coins purchase modal

  const cost = purchasePersona.price;
  const balance = currentCoins - cost;

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showPurchaseModal}
        onRequestClose={onClose}
      >
        <Pressable style={styles.modalOverlay} onPress={onClose}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  styles.buyCoinsButton,
                  {
                    backgroundColor:
                      themes["Neo - The Chat AI"].colorSchemes.sixth,
                  },
                ]}
                onPress={() => {
                  setProductModalVisible(true);
                }}
              >
                <Text style={styles.optionText}>Buy Coins</Text>
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  Purchase {purchasePersona.name}
                </Text>
              </View>
              <View style={styles.table}>
                <Text style={styles.tableLabel}>Current Coins:</Text>
                <Text style={styles.tableValue}>{currentCoins}</Text>
              </View>
              <View style={styles.table}>
                <Text style={styles.tableLabel}>Cost:</Text>
                <Text style={styles.tableValue}>-{cost}</Text>
              </View>
              <View style={styles.table}>
                <Text style={styles.tableLabel}>Remaining Coins:</Text>
                <Text
                  style={[
                    styles.tableValue,
                    balance < 0 && styles.negativeBalance,
                  ]}
                >
                  {balance}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <View style={styles.buttonWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor:
                          themes["Neo - The Chat AI"].colorSchemes.sixth,
                      },
                    ]}
                    onPress={onClose}
                  >
                    <Text style={styles.optionText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor:
                          themes["Neo - The Chat AI"].colorSchemes.sixth,
                      },
                      balance < 0 ? styles.disabledButton : {},
                    ]}
                    onPress={() => {
                      setIsPurchasing(true);

                      iapPersona(userId, db, purchasePersona)
                        .then(() => {
                          // update the options state to reflect the purchase
                          const updatedOptions = options.map((option) => {
                            // if the option is a purchased persona, set owned to true
                            if (option.name === purchasePersona.name) {
                              return {
                                ...option,
                                owned: true,
                              };
                            }
                            // if the option is not the purchased persona, return it as is
                            return option;
                          });
                          setOptions(updatedOptions);

                          // update the coins state to reflect the purchase
                          setCoins(
                            (prevCoins) => prevCoins - purchasePersona.price
                          );
                        })
                        .catch((error) => {
                          console.error(
                            "Error in making the purchase: ",
                            error
                          );
                        })
                        .finally(() => {
                          setIsPurchasing(false); // Always set the loading state back to false at the end
                          setShowSuccessModal(true);
                          onClose();
                        });
                    }}
                    disabled={balance < 0}
                  >
                    <Text style={styles.optionText}>Purchase</Text>
                    {balance < 0 && <View style={styles.overlay}></View>}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
        {isPurchasing && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator
              size="large"
              color={themes[theme].colorSchemes.fourth}
            />
          </View>
        )}
      </Modal>
      <ProductModal
        isVisible={productModalVisible} // stored in this component's state
        setIsVisible={setProductModalVisible} // stored in this component's state
        onClose={() => setProductModalVisible(false)} // stored in this component's state
        products={products} // passed in from App.js
        id={userId} // passed in from App.js
        db={db} // passed in from App.js
        coins={currentCoins} // passed in from App.js
        setCoins={setCoins} // passed in from App.js
        theme={theme} // passed in from App.js
        themes={themes} // passed in from App.js
      />
      <SuccessModal
        showSuccessModal={showSuccessModal}
        onAcknowledge={() => setShowSuccessModal(false)}
        purchasedItem={purchasePersona.name}
        themes={themes}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 50,
    right: 50,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  calcText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  balance: {
    marginTop: 10,
  },
  negativeBalance: {
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center the button wrappers
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
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
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#161d27",
    borderRadius: 20,
    padding: 35,
    width: "80%", // This helps ensure the modal remains within screen boundaries
    alignSelf: "center", // This will center the modal horizontally on the screen
    alignItems: "center", // Ensures children like the title are centered
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "relative", // Needed for absolutely positioning the Buy Coins button
  },
  optionButton: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 1,
    alignItems: "center",
    backgroundColor: "#2196F3",
    height: 40,
  },
  optionText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20, // Adjust as needed for spacing between title and content below
    position: "relative", // To allow for absolute positioning of children
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20, // Spacing below the title
    marginTop: 20,
  },
  buyCoinsButton: {
    position: "absolute",
    right: 10, // Gives a 10 pixel spacing from the right edge
    top: 10, // Gives a 10 pixel spacing from the top edge
  },
  buttonWrapper: {
    flex: 1, // Each button wrapper takes up half the width of the container
    justifyContent: "center", // Centers the button horizontally within its wrapper
    alignItems: "center", // Centers the button vertically within its wrapper
  },
  table: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  tableLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    flex: 4, // give it more space if needed
  },
  tableValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "right",
  },
  overlay: {
    // ...StyleSheet.absoluteFillObject, // will expand to cover the parent (button)
    // backgroundColor: "rgba(128, 128, 128, 0.6)", // semi-transparent grey
  },

  disabledButton: {
    opacity: 0.4, // Make the button slightly faded
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
});

export default Purchase;
