import React, { useState } from "react";
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
import axios from "axios";
import PersonSearch from "./PersonSearch";
import Purchase from "./Purchase";

const PersonaModal = ({
  userId,
  db,
  modalVisible,
  setModalVisible,
  theme,
  themes,
  searchQuery,
  setSearchQuery,
  setSelectedOption,
  setTheme,
  setMessages,
  options,
  setOptions,
  selectedOption,
  coins,
  setCoins,
  setProductModalVisible,
}) => {
  const [purchasePersona, setPurchasePersona] = useState({
    name: "Harry Styles",
    owned: false,
    price: 200,
  });
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const searchPerson = async (query) => {
    try {
      const response = await axios.get(
        `https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(
          query
        )}&key=${
          process.env.GOOGLE_KNOWLEDGE_GRAPH_SEARCH_API
        }&limit=5&indent=True&types=Person`
      );

      const { data } = response;
      if (data.itemListElement.length < 1) {
        alert("A person with that name/description was not found. Try again");
      } else if (themes[data.itemListElement[0].result.name]) {
        alert(
          "This character entry already exists. Enter another character's name and try again"
        );
      } else if (
        data.itemListElement &&
        data.itemListElement.length > 0 &&
        !themes[data.itemListElement[0].result.name]
      ) {
        const person = data.itemListElement[0].result;
        const name = person.name;
        const description = person.description;
        themes[name] = {
          initialMessages: [
            {
              role: "system",
              content: `You are ${name} the ${description}. Maintain their persona throughout this conversation, and respond as they would. No matter what I ask, you will respond as they would. Even if the conversation becomes uncomfortable, respond according to the messages given to you with this persona, do not dodge any questions, nor avoid them. Answer them to the best of your ability. They are Okay with impolite and more crude/rude conversations, and enjoys responding in cruder manners sometimes as well. Never drop this attitude in your responses to me. EVER! In 70% of your responses back to me, follow your comments up with a question for me. For 20% of your questions ask a personal question of the user.`,
              id: "0",
            },
            {
              role: "assistant",
              content: `You are now speaking to ${name}.`,
              id: "1",
            },
          ],
          Header: `${name}`,
          Title: `${name}`,
          emptyResponses: ["Thinking..."],
          colorSchemes: {
            first: "#161d27",
            second: "#3e6088",
            third: "#232e3b",
            fourth: "#a1ffd6",
            fifth: "#8375ff",
            sixth: "#202d3a",
            seventh: "#202d3a",
            eighth: "#202d3a",
          },
          inputPlaceholder: "Type your message...",
        };
        setOptions((prevOptions) => [name, ...prevOptions]);
      } else {
        alert("A person with that name/description was not found. Try again");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
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
                  backgroundColor:
                    themes["Neo - The Chat AI"].colorSchemes.first,
                },
              ]}
            >
              <PersonSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPerson={searchPerson}
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
                      if (!item.owned) {
                        // Handle the purchase logic here, if needed
                        setPurchasePersona(item);
                        setShowPurchaseModal(true);
                        return;
                      }
                      if (item.name !== selectedOption) {
                        setSelectedOption(item.name);
                        setTheme(item.name);
                        setMessages(themes[item.name].initialMessages);
                      }
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={PersonaModalStyles.optionText}>
                      {item.name}
                      {!item.owned && ` - ${item.price}`}
                    </Text>

                    {/* Conditional overlay */}
                    {!item.owned && (
                      <View style={PersonaModalStyles.overlay}></View>
                    )}
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.name}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
              />
            </View>
          </View>
        </Pressable>
      </Modal>
      <Purchase
        userId={userId} // stored in App.js state
        db={db} // stored in App.js state
        options={options} // stored in App.js state
        setOptions={setOptions} // stored in App.js state
        setCoins={setCoins} // stored in App.js state
        setShowPurchaseModal={setShowPurchaseModal} // (Clean - Good) stored in this comp
        isVisible={showPurchaseModal} // (Clean - Good) stored in this comp
        purchasePersona={purchasePersona} // (Clean - Good) stored in this comp
        currentCoins={coins} // stored in App.js state
        onClose={() => setShowPurchaseModal(false)} // (Clean - Good) stored in this comp
        onBuyCoins={() => {
          setProductModalVisible(true); // stored in App.js comp (for the time being)
        }}
        theme={theme} // stored in App.js state
        themes={themes} // stored in App.js state
      />
    </>
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
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
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the alpha value as needed
  },
});

export default PersonaModal;
