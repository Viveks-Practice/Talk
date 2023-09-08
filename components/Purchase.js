import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import ProductModal from "./ProductModal";

const Purchase = ({
  selectedPersona,
  currentCoins,
  setCoins,
  onClose,
  onBuyCoins,
  onPurchase,
  products,
  id,
  db,
}) => {
  const [productModalVisible, setProductModalVisible] = useState(false);
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
      <ProductModal // Add the ProductModal here
        isVisible={productModalVisible}
        onClose={() => setProductModalVisible(false)}
        products={products}
        id={id}
        db={db}
        coins={currentCoins}
        setCoins={setCoins}
      />
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

export default Purchase;
