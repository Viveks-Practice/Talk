import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";

const ProductsModal = ({ isVisible, onClose, products }) => {
  console.log(
    "Products read into the products modal component: ",
    JSON.stringify(products, null, 2)
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>
        ${item.price} {item.priceCurrencyCode}
      </Text>
    </View>
  );

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
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onClose}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // ... your styles here, similar to LoginModal
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
  },
  title: {
    fontSize: 32,
  },
  description: {
    fontSize: 16,
  },
  price: {
    fontSize: 12,
  },
});

export default ProductsModal;
