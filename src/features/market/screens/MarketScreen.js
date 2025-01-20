import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useNavigation } from "@react-navigation/native";

const MarketScreen = () => {
  const navigation = useNavigation();
  const [marketName, setMarketName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [searchPlace, setSearchPlace] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null); // État pour stocker l'image

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setSelectedLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setMapRegion(currentLocation);
      setLoading(false);
    })();
  }, []);

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Denied", "Camera roll permission is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setImage(`data:image/png;base64,${base64}`);
    }
  };
  const handleSearch = async () => {
    if (!searchPlace.trim()) {
      Alert.alert("Error", "Please enter a location to search!");
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      searchPlace
    )}&format=json&addressdetails=1`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "MyReactNativeApp/1.0 (your-email@example.com)",
        },
      });

      if (!response.ok) {
        Alert.alert(
          "Error",
          `Unable to connect to the search service. (HTTP ${response.status})`
        );
        return;
      }

      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const newLocation = {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setSelectedLocation({
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
        });
        setMapRegion(newLocation);
      } else {
        Alert.alert("Error", "Location not found. Please try another search.");
      }
    } catch (error) {
      Alert.alert("Error", `Unable to search for location: ${error.message}`);
    }
  };
  const handleCreateMarket = async () => {
    if (!marketName || !description || !phone || !selectedLocation || !image) {
      Alert.alert("Error", "Please fill all the fields and select an image!");
      return;
    }

    try {
      // Récupérer le username depuis le local storage
      const username = await AsyncStorage.getItem("username");
      if (!username) {
        Alert.alert("Error", "Unable to find username in local storage!");
        return;
      }

      const marketData = {
        name: marketName,
        owner: username, // Utiliser le username récupéré
        description,
        longitude: selectedLocation.longitude,
        latitude: selectedLocation.latitude,
        phoneNumber: phone,
        image,
      };

      const response = await fetch("http://192.168.27.154:5003/api/Markets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(marketData),
      });

      if (response.ok) {
        navigation.navigate("MarketSuccess");
      } else {
        const errorData = await response.json();
        Alert.alert("Error", `Failed to create market: ${errorData.message}`);
      }
    } catch (error) {
      Alert.alert("Error", `An error occurred: ${error.message}`);
    }
  };
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Create Market</Text>
        <Text style={styles.subtitle}>
          Fill in the details below to create your market.
        </Text>
      </View>

      {/* Form Section */}
      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Market Name Input */}
        <Text style={styles.label}>Market Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Market Name"
          value={marketName}
          onChangeText={setMarketName}
        />

        {/* Description Input */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter Market Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Phone Input */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* Image Picker */}
        <Text style={styles.label}>Market Image</Text>
        <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
          <Text style={styles.imageButtonText}>
            {image ? "Change Image" : "Select Image"}
          </Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        {/* Search Place */}
        <Text style={styles.label}>Search for a Location</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter a place, e.g., Casablanca"
            value={searchPlace}
            onChangeText={setSearchPlace}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Map Section */}
        <Text style={styles.label}>Select Market Location</Text>
        {loading ? (
          <Text>Loading map...</Text>
        ) : (
          <MapView
            style={styles.map}
            region={mapRegion}
            onPress={(event) =>
              setSelectedLocation(event.nativeEvent.coordinate)
            }
          >
            {selectedLocation && <Marker coordinate={selectedLocation} />}
          </MapView>
        )}

        {/* Create Market Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateMarket}
        >
          <Text style={styles.createButtonText}>Create Market</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FDF4",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0D9488",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    marginTop: 30,
  },
  subtitle: {
    fontSize: 16,
    color: "#E0F2F1",
    textAlign: "center",
    marginBottom: 10,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D9488",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    elevation: 3,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  imageButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  imageButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginRight: 10,
    elevation: 3,
  },
  searchButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  map: {
    height: 250,
    borderRadius: 10,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  createButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default MarketScreen;
