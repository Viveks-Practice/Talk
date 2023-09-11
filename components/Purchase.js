import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Modal, Pressable } from "react-native";
import ProductModal from "./ProductModal";

const Purchase = ({
  isVisible,
  purchasePersona,
  currentCoins,
  onClose,
  onBuyCoins,
  onPurchase,
}) => {
  const cost = purchasePersona.price;
  const balance = currentCoins - cost;

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
            <Text style={styles.title}>Purchase {purchasePersona.name}</Text>
            <Text>Current Coins: {currentCoins}</Text>
            <Text>Cost: {cost}</Text>
            <Text
              style={[styles.balance, balance < 0 && styles.negativeBalance]}
            >
              Remaining Balance: {balance}
            </Text>
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={onClose} />
              <Button
                title="Purchase"
                onPress={onPurchase}
                disabled={balance < 0}
              />
            </View>
            <Button title="Buy Coins" onPress={onBuyCoins} />
          </View>
        </View>
      </Pressable>
    </Modal>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  balance: {
    marginTop: 10,
  },
  negativeBalance: {
    color: "red",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
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
});

export default Purchase;
