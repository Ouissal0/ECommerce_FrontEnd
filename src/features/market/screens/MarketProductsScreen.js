import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
const { ipAddress } = require("../../../config");

const MarketProductsScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const username = await AsyncStorage.getItem("username");
      if (!username) {
        console.error("Username not found in AsyncStorage");
        return;
      }
      const marketResponse = await fetch(
        `http://${ipAddress}:5001/api/Markets/Owner/${username}`
      );
      if (!marketResponse.ok) {
        throw new Error("Error retrieving MarketId");
      }
      const marketData = await marketResponse.json();
      const marketId = marketData.marketId;

      const productsResponse = await fetch(
        `http://${ipAddress}:5001/api/Products/Market/${marketId}`
      );
      const productsData = await productsResponse.json();

      const productsWithCategory = await Promise.all(
        productsData.map(async (product) => {
          const categoryResponse = await fetch(
            `http://${ipAddress}:5001/api/Categories/${product.categoryId}`
          );
          const categoryData = await categoryResponse.json();
          return { ...product, categoryName: categoryData.name };
        })
      );

      setProducts(productsWithCategory);
    } catch (error) {
      console.error("Error fetching data: ", error);
      Alert.alert("Error", "Failed to load products. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const handleAddProduct = () => {
    navigation.navigate("AddProduct");
  };

  const confirmDelete = (productId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => onDeleteProduct(productId),
          style: "destructive",
        },
      ]
    );
  };

  const onDeleteProduct = async (productId) => {
    try {
      const response = await fetch(
        `http://${ipAddress}:5001/api/Products/${productId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete the product");
      }
      Alert.alert("Success", "Product deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting product: ", error);
      Alert.alert("Error", "Failed to delete the product");
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.infoRow}>
          <Text style={styles.productCategory}>{item.categoryName}</Text>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        </View>
        <Text style={styles.productQuantity}>Stock: {item.stockQuantity}</Text>
        <TouchableOpacity
          style={styles.deleteIcon}
          onPress={() => confirmDelete(item.id)}
        >
          <Icon name="delete" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0D9488" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.marketName}>My Market</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {products.length === 0 ? (
          <View style={styles.noProductsContainer}>
            <Icon name="shopping-basket" size={48} color="#3B82F6" />
            <Text style={styles.noProductsText}>
              No products in your market. Tap the "+" button to add a new
              product.
            </Text>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.gridContainer}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={fetchData} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D9488",
  },
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
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  marketName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 40,
  },
  addButton: {
    backgroundColor: "#FFFFFF",
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0D9488",
  },
  gridContainer: {
    padding: 10,
  },
  productCard: {
    width: "47%",
    margin: "1.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "flex-start",
  },
  productImage: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#0D9488",
  },
  infoContainer: {
    flex: 1,
    width: "100%",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  productCategory: {
    fontSize: 14,
    color: "#64748B",
    fontStyle: "italic",
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D9488",
  },
  productQuantity: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
  },
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F0F9FF",
    margin: 20,
    borderRadius: 15,
  },
  noProductsText: {
    fontSize: 18,
    textAlign: "center",
    color: "#3B82F6",
    lineHeight: 24,
    marginTop: 12,
  },
});

export default MarketProductsScreen;
