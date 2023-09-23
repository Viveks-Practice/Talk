import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const SuccessModal = ({
  showSuccessModal,
  onAcknowledge,
  purchasedItem,
  themes,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showSuccessModal}
      onRequestClose={onAcknowledge}
    >
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            {
              backgroundColor: "#161d27",
            },
          ]}
        >
          <Text style={styles.successText}>
            You have successfully purchased
          </Text>
          <Text style={styles.itemText}>{purchasedItem}</Text>
          <TouchableOpacity
            style={[
              styles.acknowledgeButton,
              {
                backgroundColor: themes["Neo - The Chat AI"].colorSchemes.sixth,
              },
            ]}
            onPress={onAcknowledge}
          >
            <Text style={styles.buttonText}>Ok</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalView: {
    width: "80%",
    padding: 35,
    backgroundColor: "#FFF",
    borderRadius: 20,
    alignItems: "center",
  },
  successText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "white",
    fontWeight: "bold",
  },
  itemText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    color: "white",
    fontWeight: "bold",
  },
  acknowledgeButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default SuccessModal;
