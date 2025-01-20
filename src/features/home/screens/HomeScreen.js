import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Feather, MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

const categories = [
  { name: 'All', icon: <Feather name="grid" size={20} color="#FFFFFF" />, color: '#6B46C1' },
  { name: 'Food', icon: <MaterialIcons name="fastfood" size={20} color="#FFFFFF" />, color: '#ED8936' },
  { name: 'Personal Care', icon: <FontAwesome name="medkit" size={20} color="#FFFFFF" />, color: '#38B2AC' },
  { name: 'Electronics', icon: <Feather name="cpu" size={20} color="#FFFFFF" />, color: '#F6AD55' },
  { name: 'Clothing', icon: <FontAwesome name="shopping-bag" size={20} color="#FFFFFF" />, color: '#E53E3E' },
  { name: 'Furniture', icon: <MaterialIcons name="weekend" size={20} color="#FFFFFF" />, color: '#9F7AEA' },
  { name: 'Sports', icon: <FontAwesome name="soccer-ball-o" size={20} color="#FFFFFF" />, color: '#38A169' },
  { name: 'Toys', icon: <MaterialIcons name="toys" size={20} color="#FFFFFF" />, color: '#F9A8D4' },
];

const products = [
  { id: '1', market: 'Fresh Market', name: 'Apple', price: '$2.00', image: 'https://via.placeholder.com/100', category: 'Food' },
  { id: '2', market: 'Tech Store', name: 'Laptop', price: '$1200', image: 'https://via.placeholder.com/100', category: 'Electronics' },
  { id: '3', market: 'Fashion Hub', name: 'Jacket', price: '$80', image: 'https://via.placeholder.com/100', category: 'Clothing' },
  { id: '4', market: 'Toy Land', name: 'Teddy Bear', price: '$20', image: 'https://via.placeholder.com/100', category: 'Toys' },
];

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const getFilteredProducts = () => {
    return selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);
  };

  const getCategoryTitle = () => {
    return selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Products`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <Image
          source={require('../../../../assets/logos/dealsquare.png')}  
          style={styles.logo}
        />
        <TouchableOpacity style={styles.cartButton}>
          <Feather name="shopping-cart" size={24} color="#4A5568" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
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

      {/* Section Title */}
      <Text style={styles.sectionTitle}>{getCategoryTitle()}</Text>

      {/* Products Grid */}
      <FlatList
        data={getFilteredProducts()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard}>
            <Image
              source={{ uri: item.image }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.marketName}>{item.market}</Text>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
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
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    marginTop: 25,
  },
  logo: {
    width: 140,
    height: 60,  
    resizeMode: 'contain', 
    top:5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  cartButton: {
    padding: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
  },
  categoriesContainer: {
    padding: 10,
    flexDirection: 'row',
  },
  categorySquare: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  categorySquareActive: {
    borderWidth: 2,
    borderColor: '#4FD1C5',
  },
  categoryText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    margin: 10,
  },
  gridContainer: {
    padding: 10,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 10,
  },
  marketName: {
    fontSize: 12,
    color: '#718096',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#319795',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006666',
    paddingVertical: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontWeight: '600',
  },
});

export default HomeScreen;
