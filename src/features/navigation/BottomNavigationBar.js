import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProfileScreen from "../profile/screens/ProfileScreen";
import MarketScreen from "../market/screens/MarketScreen";
import MarketProductsScreen from "../market/screens/MarketProductsScreen";
import HomeScreen from "../home/screens/HomeScreen";
import MapScreen from "../map/screens/MapScreen";
import PanierScreen from "../panier/screens/PanierScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { ipAddress } = require("../../config");

const Tab = createBottomTabNavigator();
export default function BottomNavigationBar() {
  const [isMarket, setIsMarket] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        if (!username) {
          console.error("Username not found in AsyncStorage");
          setIsMarket(false); // Définir une valeur par défaut
          setLoading(false); // Arrêter l'indicateur de chargement
          return;
        }

        // Vérifiez si l'utilisateur a un rôle de Market
        const roleEndpoint = `http://${ipAddress}:5001/api/Authentication/user/role/${username}`;
        const roleResponse = await fetch(roleEndpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!roleResponse.ok) {
          throw new Error(`HTTP error! status: ${roleResponse.status}`);
        }

        const isMarket = await roleResponse.json();
        console.log("Fetched isMarket value:", isMarket);

        if (isMarket) {
          console.log("the username :", username);
          // Si l'utilisateur a un rôle Market, vérifiez si le Market est créé
          const marketEndpoint = `http://${ipAddress}:5001/api/Markets/owner-exists/${username}`;
          const marketResponse = await fetch(marketEndpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!marketResponse.ok) {
            throw new Error(`HTTP error! status: ${marketResponse.status}`);
          }

          const isCreated = await marketResponse.json();
          console.log("Fetched isCreated value:", isCreated);

          // Mettez à jour les états en fonction des résultats
          setIsMarket(true);
          setIsCreated(isCreated);
        } else {
          // Si l'utilisateur n'est pas un Market
          setIsMarket(false);
          setIsCreated(false);
        }
      } catch (error) {
        console.error("Error fetching market status:", error);
        setIsMarket(false);
        setIsCreated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketStatus();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Map") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "Panier") {
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "Market") {
            iconName = focused ? "storefront" : "storefront-outline";
          } else if (route.name === "Products") {
            iconName = focused ? "storefront" : "storefront-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: "#008080", // Teal for active icons
        tabBarInactiveTintColor: "gray", // Gray for inactive icons
        tabBarStyle: {
          height: 70,
          position: "absolute",
          bottom: 10,
          marginLeft: 10,
          marginRight: 15,
          borderRadius: 25,
          backgroundColor: "#ffffff",
          elevation: 5, // Shadow for Android
          shadowColor: "#000", // Shadow for iOS
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
          marginTop: 5,
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#008080", // Teal indicator
          height: 4,
          borderRadius: 2,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      {isMarket ? (
        isCreated ? (
          <Tab.Screen
            name="Products"
            component={MarketProductsScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons
                  name={isMarket ? "storefront" : "storefront-outline"}
                  size={24}
                  color={color}
                />
              ),
            }}
          />
        ) : (
          <Tab.Screen
            name="Market"
            component={MarketScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons
                  name={isMarket ? "storefront" : "storefront-outline"}
                  size={24}
                  color={color}
                />
              ),
            }}
          />
        )
      ) : (
        <Tab.Screen
          name="Panier"
          component={PanierScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name={!isMarket ? "cart" : "cart-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
      )}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
