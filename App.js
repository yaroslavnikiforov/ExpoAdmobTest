import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { AdMobInterstitial, setTestDeviceIDAsync } from "expo-ads-admob";

const unitId = Platform.select({
  ios: "ca-app-pub-3940256099942544/4411468910",
  android: "ca-app-pub-3940256099942544/1033173712",
});
let servePersonalizedAds = false;

export default function App() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    AdMobInterstitial.setAdUnitID(unitId);

    const interstitialListeners = {
      interstitialDidLoad: onInterstitialDidLoad,
      interstitialDidFailToLoad: onInterstitialDidFailToLoad,
      interstitialDidOpen: onInterstitialDidOpen,
      interstitialDidClose: onInterstitialDidClose,
    };

    Object.keys(interstitialListeners).forEach((eventName) =>
      AdMobInterstitial.addEventListener(
        eventName,
        interstitialListeners[eventName]
      )
    );

    return () => {
      AdMobInterstitial.removeAllListeners();
    };
  }, []);

  function onInterstitialDidLoad() {
    console.info("Ad loaded.");

    AdMobInterstitial.showAdAsync();
    setIsLoading(false);
  }

  function onInterstitialDidFailToLoad(error) {
    console.info("Ad failed to load:", error);

    setIsLoading(false);
  }

  function onInterstitialDidOpen() {
    console.info("Ad opened.");
  }

  function onInterstitialDidClose() {
    console.info("Ad closed.");
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (!isLoading) {
            setIsLoading(true);
            AdMobInterstitial.requestAdAsync({
              servePersonalizedAds,
            }).catch((err) => console.info("err: ", err));
          }
        }}
        activeOpacity={1}
      >
        <Text style={styles.text}>{isLoading ? "Loading..." : "Load"}</Text>
      </TouchableOpacity>

      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },

  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 60,
    borderRadius: 30,
    backgroundColor: "green",
  },

  text: {
    color: "white",
  },
});
