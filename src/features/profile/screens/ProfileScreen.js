import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
const { ipAddress } = require("../../../config");

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState(null); // État pour les infos utilisateur
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [orders, setOrders] = useState([]); // Simuler les commandes
  const navigation = useNavigation();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        if (!username) {
          console.error("Username not found in AsyncStorage");
          setLoading(false);
          return;
        }

        const endpoint = `http://${ipAddress}:5001/api/Authentication/user/${username}`;
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserInfo(data);

        // Simuler des commandes si elles ne sont pas récupérées depuis l'API
        const mockOrders = [
          {
            id: "12345",
            totalAmount: "$50.00",
            deliveryAddress: "123 Main St, New York, NY",
            status: "Confirmed",
          },
          {
            id: "67890",
            totalAmount: "$30.00",
            deliveryAddress: "456 Elm St, Boston, MA",
            status: "Delivered",
          },
          {
            id: "11223",
            totalAmount: "$75.00",
            deliveryAddress: "789 Pine St, Chicago, IL",
            status: "Pending",
          },
        ];
        setOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    console.log("Logged out");
    navigation.navigate("Login");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#028090" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: `${userInfo.image}`,
            }}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.profileName}>
            {userInfo?.firstName} {userInfo?.lastName}
          </Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={18} color="#FFF" />
            <Text style={styles.infoText}>{userInfo?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={18} color="#FFF" />
            <Text style={styles.infoText}>{userInfo?.phoneNumber}</Text>
          </View>
        </View>
      </View>

      {/* Orders Section */}
      <View style={styles.ordersSection}>
        <Text style={styles.sectionTitle}>Order History</Text>
        {orders.length > 0 ? (
          orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderID}>Order #{order.id}</Text>
                <Text
                  style={[
                    styles.orderStatus,
                    order.status === "Delivered"
                      ? { color: "#2D6A4F" }
                      : order.status === "Pending"
                      ? { color: "#FFB703" }
                      : { color: "#028090" },
                  ]}
                >
                  {order.status}
                </Text>
              </View>
              <Text style={styles.orderDetailText}>
                Total: {order.totalAmount}
              </Text>
              <Text style={styles.orderDetailText}>
                Address: {order.deliveryAddress}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noOrdersText}>No orders found.</Text>
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={18} color="#FFF" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5F4",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#028090",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#008080",
    padding: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 50,
    elevation: 4,
  },
  imageContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#028090",
  },
  infoContainer: {
    flex: 2,
    marginLeft: 20,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#FFF",
    marginLeft: 10,
  },
  ordersSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#028090",
    marginBottom: 15,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderID: {
    fontSize: 16,
    fontWeight: "600",
    color: "#028090",
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
  orderDetailText: {
    fontSize: 14,
    color: "#6C757D",
  },
  noOrdersText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6C757D",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default ProfileScreen;
