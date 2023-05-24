import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  Button,
  Pressable,
  Text,
  StyleSheet,
} from "react-native";

const LoginModal = ({ isVisible, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log(
      `Logging in with username: ${username} and password: ${password}`
    );
    onClose();
  };

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
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleLogin}
            >
              <Text style={styles.textStyle}>Login</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              //   onPress={handleLogin}
            >
              <Text style={styles.textStyle}> Need an account? Sign Up</Text>
            </Pressable>
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#3e6088",
  },
  buttonClose: {
    backgroundColor: "#3e6088",
    width: 200,
    marginTop: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#3e6088",
    color: "#fff",
  },
});

export default LoginModal;
