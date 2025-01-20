import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MarketDetailsScreen = ({ route, navigation }) => {
  const { market } = route.params;

  const handleCall = () => {
    Linking.openURL(`tel:${market.phone}`);
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Arrow */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
          <Ionicons name="arrow-back" size={24} color="#008080" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Market Details</Text>
      </View>

      {/* Market Image */}
      <Image source={{ uri: market.image }} style={styles.marketImage} />

      {/* Market Details */}
      <Text style={styles.marketName}>{market.name}</Text>
      <Text style={styles.marketDescription}>{market.owner}</Text>
      <Text style={styles.marketDescription}>{market.description}</Text>
      <Text style={styles.marketPhone}>Phone: {market.phone}</Text>

      {/* Call Button */}
      <TouchableOpacity style={styles.callButton} onPress={handleCall}>
        <Text style={styles.callButtonText}>Call Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  backArrow: {
    marginRight: 10,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  marketImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
  },
  marketName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#008080",
    marginBottom: 10,
    textAlign: "center",
  },
  marketDescription: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 10,
    textAlign: "center",
  },
  marketPhone: {
    fontSize: 16,
    color: "#007BFF",
    marginBottom: 20,
    textAlign: "center",
  },
  callButton: {
    backgroundColor: "#008080",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  callButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MarketDetailsScreen;
