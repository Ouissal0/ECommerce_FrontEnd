import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Feather,
  MaterialIcons,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const { ipAddress } = require("../../../config");

const defaultColors = {
  All: "#6B46C1",
  Food: "#ED8936",
  "Personal Care": "#38B2AC",
  Electronics: "#F6AD55",
  Clothing: "#E53E3E",
  Furniture: "#9F7AEA",
  Sports: "#38A169",
  Toys: "#F9A8D4",
  Default: "#A0AEC0",
};

const getIcon = (categoryName) => {
  switch (categoryName) {
    case "Food":
      return <MaterialIcons name="fastfood" size={20} color="#FFFFFF" />;
    case "Personal Care":
      return <FontAwesome name="medkit" size={20} color="#FFFFFF" />;
    case "Electronics":
      return <Feather name="cpu" size={20} color="#FFFFFF" />;
    case "Clothing":
      return <FontAwesome name="shopping-bag" size={20} color="#FFFFFF" />;
    case "Furniture":
      return <MaterialIcons name="weekend" size={20} color="#FFFFFF" />;
    case "Sports":
      return <FontAwesome name="soccer-ball-o" size={20} color="#FFFFFF" />;
    case "Toys":
      return <MaterialIcons name="toys" size={20} color="#FFFFFF" />;
    default:
      return <Feather name="grid" size={20} color="#FFFFFF" />;
  }
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([
    {
      name: "All",
      icon: <Feather name="grid" size={20} color="#FFFFFF" />,
      color: defaultColors.All,
    },
  ]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleProductPress = (product) => {
    navigation.navigate("ProductDetails", { product });
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://${ipAddress}:5001/api/Categories`);
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();

      const fetchedCategories = data.map((category) => ({
        name: category.name,
        icon: getIcon(category.name),
        color: defaultColors[category.name] || defaultColors.Default,
      }));

      setCategories((prevCategories) => [
        ...prevCategories,
        ...fetchedCategories,
      ]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCategoryById = async (categoryId) => {
    try {
      const response = await fetch(
        `http://${ipAddress}:5001/api/Categories/${categoryId}`
      );
      if (!response.ok) throw new Error("Failed to fetch category");
      const data = await response.json();
      return data.name;
    } catch (error) {
      console.error(`Error fetching category ${categoryId}:`, error);
      return "Unknown Category";
    }
  };

  const fetchMarketById = async (marketId) => {
    try {
      const response = await fetch(
        `http://${ipAddress}:5001/api/Markets/${marketId}`
      );
      if (!response.ok) throw new Error("Failed to fetch market");
      const data = await response.json();
      return data.name;
    } catch (error) {
      console.error(`Error fetching market ${marketId}:`, error);
      return "Unknown Market";
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://${ipAddress}:5001/api/Products`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();

      const enrichedProducts = await Promise.all(
        data.map(async (product) => {
          const categoryName = await fetchCategoryById(product.categoryId);
          const marketName = await fetchMarketById(product.marketId);
          return {
            id: product.id,
            market: marketName,
            name: product.name,
            price: product.price,
            image: product.image,
            category: categoryName,
            stockQuantity: product.stockQuantity,
            description: product.description,
          };
        })
      );

      setProducts(enrichedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const getFilteredProducts = () => {
    return selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);
  };

  const getCategoryTitle = () => {
    return selectedCategory === "All"
      ? "All Products"
      : `${selectedCategory} Products`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../../../assets/logos/dealsquare.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("Panier")}
        >
          <Feather name="shopping-cart" size={24} color="#4A5568" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={`${category.name}-${index}`}
            style={[
              styles.categorySquare,
              { backgroundColor: category.color },
              selectedCategory === category.name && styles.categorySquareActive,
            ]}
            onPress={() => setSelectedCategory(category.name)}
          >
            {category.icon}
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>{getCategoryTitle()}</Text>

      <FlatList
        data={getFilteredProducts()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => handleProductPress(item)}
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.marketName}>{item.market}</Text>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    elevation: 2,
    marginTop: 25,
  },
  logo: {
    width: 140,
    height: 60,
    resizeMode: "contain",
    top: 5,
  },
  cartButton: {
    padding: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
  },
  categoriesContainer: {
    padding: 10,
    flexDirection: "row",
  },
  categorySquare: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 10,
  },
  categorySquareActive: {
    borderWidth: 2,
    borderColor: "#4FD1C5",
  },
  categoryText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    margin: 10,
  },
  gridContainer: {
    padding: 10,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 2,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  productInfo: {
    padding: 10,
  },
  marketName: {
    fontSize: 12,
    color: "#718096",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#319795",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#006666",
    paddingVertical: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  addButtonText: {
    color: "#FFFFFF",
    marginLeft: 5,
    fontWeight: "600",
  },
});

export default HomeScreen;
