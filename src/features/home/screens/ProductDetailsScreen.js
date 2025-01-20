import React, { useState } from "react"
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  SafeAreaView,
} from "react-native"
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

const ProductDetailsScreen = ({ navigation, route }) => {
  const { product } = route.params
  const [quantity, setQuantity] = useState(1)
  const scrollY = new Animated.Value(0)

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  })

  const updateQuantity = (increment) => {
    const newQuantity = quantity + increment
    if (newQuantity > 0 && newQuantity <= product.stockQuantity) {
      setQuantity(newQuantity)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <Text style={styles.headerTitle}>{product.name}</Text>
      </Animated.View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <AntDesign name="left" size={24} color="#000" />
      </TouchableOpacity>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.price}>{product.price} €</Text>
          </View>

          <View style={styles.stockInfo}>
            <MaterialIcons
              name={product.stockQuantity > 0 ? "check-circle" : "cancel"}
              size={20}
              color={product.stockQuantity > 0 ? "#00a6a6" : "#ff6b6b"}
            />
            <Text style={[styles.stockText, { color: product.stockQuantity > 0 ? "#00a6a6" : "#ff6b6b" }]}>
              {product.stockQuantity > 0 ? `${product.stockQuantity} unités en stock` : "Rupture de stock"}
            </Text>
          </View>

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantité:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(-1)}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(1)}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.marketContainer}>
            <View style={styles.marketHeader}>
              <Image source={{ uri: product.market.image }} style={styles.marketImage} />
              <View style={styles.marketInfo}>
                <Text style={styles.marketName}>{product.market}</Text>
                <View style={styles.marketStats}>
                  <AntDesign name="star" size={16} color="#FFD700" />
                  <Text style={styles.marketRating}>{product.market.rating}</Text>
                  <Text style={styles.marketSales}>{product.market.totalSales} ventes</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.visitButton}>
                <Text style={styles.visitButtonText}>Visiter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => {
            // Logique d'ajout au panier
            console.log("Ajouté au panier:", quantity)
          }}
        >
          <Text style={styles.addToCartText}>Ajouter au panier</Text>
          <Text style={styles.totalPrice}>{(product.price * quantity).toFixed(2)} €</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#e0f7f7",
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#cce5e5",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007373",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1001,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(224, 247, 247, 0.8)",
  },
  imageContainer: {
    width: width,
    height: width,
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  categoryBadge: {
    position: "absolute",
    bottom: 30,
    left: 20,
    backgroundColor: "#007373",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  contentContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
    color: "#007373",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00a6a6",
  },
  stockInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stockText: {
    marginLeft: 8,
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 15,
    color: "#007373",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f7f7",
    borderRadius: 25,
    padding: 5,
  },
  quantityButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#007373",
  },
  quantity: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: "600",
    color: "#007373",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#007373",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  marketContainer: {
    backgroundColor: "#e0f7f7",
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
  },
  marketHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  marketImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  marketInfo: {
    flex: 1,
    marginLeft: 15,
  },
  marketName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007373",
  },
  marketStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  marketRating: {
    marginLeft: 5,
    marginRight: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#00a6a6",
  },
  marketSales: {
    fontSize: 14,
    color: "#666",
  },
  visitButton: {
    backgroundColor: "#007373",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  visitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  actionContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0f7f7",
  },
  addToCartButton: {
    backgroundColor: "#00a6a6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  totalPrice: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default ProductDetailsScreen

