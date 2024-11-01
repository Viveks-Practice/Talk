import React, { useState } from "react";
import {
  Modal,
  Pressable,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import axios from "axios";
import PersonSearch from "./PersonSearch";
import Purchase from "./Purchase";

const PersonaModal = ({
  userId,
  db,
  products,
  personaModalVisible,
  setPersonaModalVisible,
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
}) => {
  const [purchasePersona, setPurchasePersona] = useState({
    name: "Harry Styles",
    owned: false,
    price: 200,
  });
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const databaseFriendlyName = (name) => {
    return name.toLowerCase().replace(/ /g, "-");
  };

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
        setOptions((prevOptions) => [
          {
            name: name,
            owned: true,
            price: null,
          },
          ...prevOptions,
        ]);
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
        visible={personaModalVisible}
        onRequestClose={() => {
          setPersonaModalVisible(!personaModalVisible);
        }}
      >
        <Pressable
          style={PersonaModalStyles.modalOverlay}
          onPress={() => setPersonaModalVisible(false)}
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
                      item.price !== null &&
                        PersonaModalStyles.largeOptionButton,
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
                      setPersonaModalVisible(!personaModalVisible);
                    }}
                  >
                    {item.price !== null ? (
                      <ImageBackground
                        source={{
                          uri: `http://${
                            process.env.GCS_LOAD_BALANCER_CDN_IP
                          }/${item.name}/${databaseFriendlyName(
                            item.name
                          )}-1.png`,
                        }}
                        style={PersonaModalStyles.centerImage}
                      >
                        {!item.owned && (
                          <View style={PersonaModalStyles.dimOverlay}></View>
                        )}
                        <Text style={PersonaModalStyles.overlayText}>
                          {item.name}
                        </Text>
                        {!item.owned && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Ionicons
                              name="wallet-outline"
                              size={24}
                              color="#e3c562"
                              paddingBottom={8}
                            />
                            <Text style={PersonaModalStyles.costText}>
                              {`${item.price} Coins`}
                            </Text>
                          </View>
                        )}
                      </ImageBackground>
                    ) : (
                      <View style={PersonaModalStyles.centerImage}>
                        <Text style={PersonaModalStyles.optionText}>
                          {item.name}
                          {!item.owned && ` - ${item.price}`}
                        </Text>
                      </View>
                    )}
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
        showPurchaseModal={showPurchaseModal} // stored in this comp
        currentCoins={coins} // stored in App.js state
        userId={userId} // stored in App.js state
        db={db} // stored in App.js state
        products={products} // stored in App.js state
        options={options} // stored in App.js state
        setOptions={setOptions} // stored in App.js state
        setCoins={setCoins} // stored in App.js state
        purchasePersona={purchasePersona} // stored in this comp
        onClose={() => setShowPurchaseModal(false)} // stored in this comp
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
  largeOptionButton: {
    ...this.optionButton, // This will spread all properties of optionButton
    height: 400,
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
    backgroundColor: "rgba(0, 0, 0, 0.0)", // Adjust the alpha value as needed
  },
  centerImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "flex-end", // This ensures the text aligns at the bottom of the image
  },
  overlayText: {
    color: "white",
    // backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional, if you want a background for better readability
    paddingHorizontal: 5,
    textAlign: "center",
    paddingBottom: 10, // Increased padding from bottom
    textShadowColor: "rgba(0, 0, 0, 1)", // Black shadow
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 30,
    fontWeight: "bold",
    fontSize: 20,
  },
  costText: {
    color: "#e3c562",
    // backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional, if you want a background for better readability
    paddingHorizontal: 5,
    textAlign: "center",
    paddingBottom: 10, // Increased padding from bottom
    textShadowColor: "rgba(0, 0, 0, 1)", // Black shadow
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 30,
    fontWeight: "bold",
    fontSize: 18,
  },
  dimOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 0.5 is the opacity level, you can adjust this
  },
});

export default PersonaModal;
