import React from "react";
import { TextInput, StyleSheet } from "react-native";

const PersonSearch = ({ searchQuery, setSearchQuery, searchPerson }) => {
  return (
    <TextInput
      style={PersonSearchStyles.searchInput}
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
  );
};

const PersonSearchStyles = StyleSheet.create({
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
});

export default PersonSearch;
