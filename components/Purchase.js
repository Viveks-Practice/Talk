import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const PurchaseComponent = ({
  selectedPersona,
  currentCoins,
  onClose,
  onBuyCoins,
  onPurchase,
}) => {
  const cost = selectedPersona.price;
  const balance = currentCoins - cost;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Purchase {selectedPersona.name}</Text>
      <Text>Current Coins: {currentCoins}</Text>
      <Text>Cost: {cost}</Text>
      <Text style={[styles.balance, balance < 0 && styles.negativeBalance]}>
        Remaining Balance: {balance}
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={onClose} />
        <Button title="Purchase" onPress={onPurchase} disabled={balance < 0} />
      </View>
      <Button title="Buy Coins" onPress={onBuyCoins} />
    </View>
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
});

export default PurchaseComponent;
