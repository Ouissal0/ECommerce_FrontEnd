import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const MarketSuccessScreen = () => {
  const navigation = useNavigation();

  const handleGoHome = () => {
    navigation.navigate("MarketProducts"); 
  };

  return (
    <View style={styles.container}>
      {/* Rounded Image Container */}
      <View style={styles.imageBackground}>
        <Image
          source={require("../../../../assets/images/market-success.jpg")} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Success Message */}
      <Text style={styles.title}>Success!</Text>
      <Text style={styles.subTitle}>
        Your market has been created successfully.
      </Text>

      {/* Button to go back to home */}
      <TouchableOpacity style={styles.button} onPress={handleGoHome}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  imageBackground: {
    width: 250,
    height: 250,
    borderRadius: 120,
    backgroundColor: "rgba(0, 128, 128, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100, 
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#008080", 
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#008080",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MarketSuccessScreen;
