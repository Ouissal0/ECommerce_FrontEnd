import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const MarketProductsScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Apple",
      price: "$2.00",
      quantity: "50",
      image: "https://via.placeholder.com/100",
      category: "Fruits",
    },
    {
      id: "2",
      name: "Milk",
      price: "$1.50",
      quantity: "30",
      image: "https://via.placeholder.com/100",
      category: "Dairy",
    },
    {
      id: "3",
      name: "Bread",
      price: "$1.20",
      quantity: "20",
      image: "https://via.placeholder.com/100",
      category: "Bakery",
    },
    {
        id: "4",
        name: "Bread",
        price: "$1.20",
        quantity: "20",
        image: "https://via.placeholder.com/100",
        category: "Bakery",
      },
  ]);

  const handleAddProduct = () => {
    navigation.navigate("AddProduct"); 
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.productCategory}>{item.category}</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
        </View>
        <Text style={styles.productQuantity}>Stock: {item.quantity}</Text>
      </View>
    </View>
  );
  

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.marketName}>Market Name</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2} // Force a grid layout with 2 columns
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0D9488",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  marketName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 30,
  },
  addButton: {
    backgroundColor: "#FFFFFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0D9488",
  },
  gridContainer: {
    padding: 10,
  },
  productCard: {
    width: "48%",
    margin: "1%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "flex-start", // Alignement à gauche pour une meilleure lisibilité
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2, // Bordure pour mettre en valeur l'image
    borderColor: "#0D9488",
  },
  infoContainer: {
    flex: 1,
    width: "100%",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 14,
    color: "#64748B",
    fontStyle: "italic", 
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D9488",
  },
  productQuantity: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 5,
  },
});

export default MarketProductsScreen;
