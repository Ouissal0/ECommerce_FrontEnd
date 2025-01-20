import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const customMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f5f5f5" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c9c9c9" }],
  },
];

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMarketsAndLocation = async () => {
      try {
        // Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "You need to allow location access to see nearby markets."
          );
          setLoading(false);
          return;
        }

        // Get user's current location
        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });

        // Fetch markets from the API
        const response = await fetch("http://192.168.27.154:5003/api/Markets");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Format the markets data
        const formattedMarkets = data.map((market) => ({
          id: market.id.toString(),
          name: market.name,
          description: market.description,
          image: market.image || "https://via.placeholder.com/100",
          coordinates: {
            latitude: market.latitude,
            longitude: market.longitude,
          },
          phone: market.phoneNumber,
          owner: market.owner, 
        }));

        setMarkets(formattedMarkets);
      } catch (error) {
        Alert.alert("Error", `Failed to load markets: ${error.message}`);
      } finally {
        setLoading(false); // Stop the loading indicator
      }
    };

    fetchMarketsAndLocation();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Unable to access location. Please enable location services.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={location}
        customMapStyle={customMapStyle}
      >
        {markets.map((market) => (
          <Marker
            key={market.id}
            coordinate={market.coordinates}
            onPress={() =>
              navigation.navigate("MarketDetails", { market: market })
            }
          >
            <View style={styles.markerWrapper}>
              <Image
                source={{ uri: market.image }}
                style={styles.markerImage}
                resizeMode="cover"
              />
            </View>

            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{market.name}</Text>
                <Text style={styles.calloutDescription}>
                  {market.description}
                </Text>
                <Text style={styles.calloutPhone}>Phone: {market.phone}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4ECDC4",
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  calloutContainer: {
    width: width * 0.6,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#4ECDC4",
  },
  calloutDescription: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  calloutPhone: {
    fontSize: 12,
    color: "#888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#FF6B6B",
    textAlign: "center",
  },
});

export default MapScreen;
