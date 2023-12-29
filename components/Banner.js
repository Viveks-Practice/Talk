import React from "react";
import { View } from "react-native";
import {
  BannerAd,
  TestIds,
  BannerAdSize,
} from "react-native-google-mobile-ads";
import themes from "../themes.json";

const Banner = ({ theme }) => {
  let adUnitId = "";
  if (Platform.OS === "ios") {
    adUnitId = __DEV__ ? TestIds.BANNER : process.env.IOS_ADMOB_ID; // iOS Ad Unit ID
  } else if (Platform.OS === "android") {
    adUnitId = __DEV__ ? TestIds.BANNER : process.env.ANDROID_ADMOB_ID; // Android Ad Unit ID
  }

  return (
    <View
      style={{
        backgroundColor: themes[theme].colorSchemes.first,
      }}
    >
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        style={{
          paddingTop: 100,
          backgroundColor: themes[theme].colorSchemes.seventh,
        }} // add 10 pixels of padding to the top
      />
    </View>
  );
};

export default Banner;
