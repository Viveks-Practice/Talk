import React from "react";
import {
  Modal,
  Pressable,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import Constants from "expo-constants";

const PersonaModal = ({
  modalVisible,
  setModalVisible,
  themes,
  searchQuery,
  setSearchQuery,
  searchPerson,
  setSelectedOption,
  setTheme,
  setMessages,
  options,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <Pressable
        style={PersonaModalStyles.modalOverlay}
        onPress={() => setModalVisible(false)}
      >
        <View style={PersonaModalStyles.centeredView}>
          <View
            style={[
              PersonaModalStyles.modalView,
              {
                backgroundColor: themes["Neo - The Chat AI"].colorSchemes.first,
              },
            ]}
          >
            {/* Add the search bar */}
            <TextInput
              style={PersonaModalStyles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => {
                searchPerson(searchQuery);
                setSearchQuery("");
              }}
              placeholder="Search for a person"
              placeholderTextColor="#657284"
              returnKeyType="search"
            />
            <FlatList
              data={options}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    PersonaModalStyles.optionButton,
                    {
                      backgroundColor:
                        themes["Neo - The Chat AI"].colorSchemes.sixth,
                    },
                  ]}
                  onPress={() => {
                    setSelectedOption(item);
                    setTheme(item);
                    setMessages(themes[item].initialMessages);
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={PersonaModalStyles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const PersonaModalStyles = StyleSheet.create({
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  centeredView: {
    position: "absolute",
    top: Platform.OS === "ios" ? Constants.statusBarHeight + 56 : 56,
    width: "100%",
    alignItems: "center",
  },
  modalView: {
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 0.84,
    maxHeight: 600,
    elevation: 5,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 8,
    paddingRight: 8,
    marginBottom: 8,
    borderRadius: 4,
    color: "#fff",
    fontSize: 16,
  },
  optionButton: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 1,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#2196F3",
  },
  optionText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PersonaModal;
